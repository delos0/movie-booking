// __tests__/login.test.ts
import { Request, Response } from 'express';
import { User } from '../models/User';
import type { Secret, SignOptions } from 'jsonwebtoken';

jest.mock('../models/User');
jest.mock('jsonwebtoken');

type SignFn = (
  payload: { sub: number; role: string },
  secret: Secret,
  options?: SignOptions
) => string;

describe('login controller', () => {
  let login: (req: Request, res: Response) => Promise<any>;
  let mockedUser: jest.Mocked<typeof User>;
  let signMock: jest.MockedFunction<SignFn>;
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();

    process.env.JWT_SECRET = 'test-secret';
    process.env.JWT_EXPIRES_IN = '2h';

    const userModule = require('../models/User');
    mockedUser = userModule.User as jest.Mocked<typeof userModule.User>;

    const jwtModule = require('jsonwebtoken');
    signMock = (jwtModule.sign as unknown) as jest.MockedFunction<SignFn>;
    signMock.mockReturnValue('signed-token');

    const authController = require('../controllers/authController');
    login = authController.login;

    req = { body: { email: 'foo@example.com', password: 'password123' } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it('should return a token when credentials are valid', async () => {
    const mockUserInstance = {
      id: 1,
      role: 'user',
      checkPassword: jest.fn().mockResolvedValue(true),
    };
    mockedUser.findOne.mockResolvedValue(mockUserInstance as any);

    await login(req as Request, res as Response);

    expect(mockedUser.findOne).toHaveBeenCalledWith({ where: { email: 'foo@example.com' } });
    expect(mockUserInstance.checkPassword).toHaveBeenCalledWith('password123');
    expect(signMock).toHaveBeenCalledWith(
      { sub: 1, role: 'user' },
      'test-secret',
      { expiresIn: '2h' }
    );
    expect(res.json).toHaveBeenCalledWith({ token: 'signed-token' });
  });

  it('should return 400 if the user is not found', async () => {
    mockedUser.findOne.mockResolvedValue(null);

    await login(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid credentials' });
  });

  it('should return 400 if the password is incorrect', async () => {
    const mockUserInstance = {
      checkPassword: jest.fn().mockResolvedValue(false),
    };
    mockedUser.findOne.mockResolvedValue(mockUserInstance as any);

    await login(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid credentials' });
  });

  it('should return 500 on unexpected errors', async () => {
    mockedUser.findOne.mockRejectedValue(new Error('DB failure'));

    await login(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
  });
});

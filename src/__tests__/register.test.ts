// __tests__/register.test.ts
import { Request, Response } from 'express';
import type { Secret, SignOptions } from 'jsonwebtoken';

// Auto-mock both your User model and jsonwebtoken
jest.mock('../models/User');
jest.mock('jsonwebtoken');

type SignFn = (
  payload: { sub: number; role: string },
  secret: Secret,
  options?: SignOptions
) => string;

describe('register controller', () => {
  let register: typeof import('../controllers/authController').register;
  let signMock: jest.MockedFunction<SignFn>;
  let mockedUser: jest.Mocked<typeof import('../models/User').User>;
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    // Clear module cache so imports re-evaluate with fresh env
    jest.resetModules();

    // Set env BEFORE re-requiring the controller
    process.env.JWT_SECRET = 'test-secret';
    process.env.JWT_EXPIRES_IN = '2h';

    // Re-import the model & jwt mock
    const userModule = require('../models/User');
    mockedUser = userModule.User as jest.Mocked<typeof userModule.User>;

    const jwtModule = require('jsonwebtoken');
    signMock = (jwtModule.sign as unknown) as jest.MockedFunction<SignFn>;
    signMock.mockReturnValue('signed-jwt-token');

    // Finally re-import the controller under test
    const authController = require('../controllers/authController');
    register = authController.register;

    // Fake Express req/res
    req = {
      body: { email: 'foo@example.com', password: 'hunter2', role: 'admin' },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it('should create a user, sign a token, and return 201', async () => {
    mockedUser.create.mockResolvedValue({
      id: 42,
      email: 'foo@example.com',
      role: 'admin',
    } as any);

    await register(req as Request, res as Response);

    // Model called with correct args
    expect(mockedUser.create).toHaveBeenCalledWith({
      email: 'foo@example.com',
      password: 'hunter2',
      role: 'admin',
    });

    // jwt.sign got the updated env values
    expect(signMock).toHaveBeenCalledWith(
      { sub: 42, role: 'admin' },
      'test-secret',
      { expiresIn: '2h' }
    );

    // And we returned the right JSON
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: 'User registered succesfully',
    });
  });

  it('should catch errors and return 400 with message', async () => {
    mockedUser.create.mockRejectedValue(new Error('duplicate email'));

    await register(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'duplicate email',
    });
  });
});

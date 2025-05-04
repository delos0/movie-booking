// __tests__/authenticateToken.test.ts
import { Request, Response, NextFunction } from 'express';
import type { Secret } from 'jsonwebtoken';

jest.mock('jsonwebtoken');
type VerifyFn = (token: string, secret: Secret) => unknown;

describe('authenticateToken middleware', () => {
  let authenticateToken: (
    req: Request & { user?: any },
    res: Response,
    next: NextFunction
  ) => any;
  let verifyMock: jest.MockedFunction<VerifyFn>;
  let req: Partial<Request & { user?: any }>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'test-secret';

    // re-require after setting env
    const jwt = require('jsonwebtoken');
    verifyMock = (jwt.verify as unknown) as jest.MockedFunction<VerifyFn>;

    const mod = require('../middleware/auth'); 
    authenticateToken = mod.authenticateToken;

    req = { headers: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it('rejects when there is no Authorization header', () => {
    authenticateToken(req as any, res as any, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Token missing' });
    expect(next).not.toHaveBeenCalled();
  });

  it('rejects when Authorization header is not Bearer', () => {
    req.headers = { authorization: 'Token abc.def.ghi' };

    authenticateToken(req as any, res as any, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Token missing' });
    expect(next).not.toHaveBeenCalled();
  });

  it('rejects when jwt.verify throws', () => {
    req.headers = { authorization: 'Bearer bad.token.here' };
    verifyMock.mockImplementation(() => { throw new Error(); });

    authenticateToken(req as any, res as any, next);

    expect(verifyMock).toHaveBeenCalledWith('bad.token.here', 'test-secret');
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Token invalid or expired' });
    expect(next).not.toHaveBeenCalled();
  });

  it('rejects when payload is missing role', () => {
    req.headers = { authorization: 'Bearer some.token' };
    verifyMock.mockReturnValue({ sub: 1, iat: 0, exp: 1 });

    authenticateToken(req as any, res as any, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Token invalid or expired' });
    expect(next).not.toHaveBeenCalled();
  });

  it('calls next() and sets req.user on valid token', () => {
    const payload = { sub: 42, role: 'admin', iat: 100, exp: 200 };
    req.headers = { authorization: 'Bearer good.token' };
    verifyMock.mockReturnValue(payload);

    authenticateToken(req as any, res as any, next);

    expect(verifyMock).toHaveBeenCalledWith('good.token', 'test-secret');
    expect(req.user).toEqual(payload);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});

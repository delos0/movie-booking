import { Response, Request, NextFunction } from "express";
import jwt, { Jwt, JwtPayload, Secret } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

export type JwtPayloadWithRole = 
    Omit<JwtPayload, 'sub'> & {
        sub: number;
        role: string;
        iat: number;
        exp: number;
};

export function authenticateToken(
    req: Request & { user?: JwtPayloadWithRole },
    res: Response,
    next: NextFunction
) {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ')
        ? authHeader.slice(7) : null;

    if (!token) {
        return res.status(401).json({ error: 'Token missing' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET as Secret);
        const payload = decoded as unknown as JwtPayloadWithRole;

        if (typeof payload !== 'object' || !payload.role) {
            throw new Error('Invalid token payload');
        }

        req.user = payload;
        return next();
    } catch {
        return res.status(401).json({ error: 'Token invalid or expired' });
    }

}
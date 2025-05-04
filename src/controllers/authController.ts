import { Request, Response, NextFunction } from "express";
import * as jwt from 'jsonwebtoken';
import { User } from '../models/User';
import type { Secret, SignOptions } from 'jsonwebtoken';


const JWT_SECRET = process.env.JWT_SECRET!;
const raw_expiresIn = process.env.JWT_EXPIRES_IN || '1h';
const JWT_EXPIRES_IN = raw_expiresIn as unknown as SignOptions['expiresIn'];
interface JwtPayload {
    sub: number;
    role: string;
    iat: number;
    exp: number;
}

export const register = async (req: Request, res: Response) => {
    const { email, password, role = 'user' } = req.body as {
        email: string;
        password: string;
        role?: string;
    };

    try {
        const user = await User.create({email, password, role});

        const payload = { sub: user.id, role: user.role };
        const options: SignOptions = { expiresIn: JWT_EXPIRES_IN, };
        const token = jwt.sign(
            payload,
            JWT_SECRET,
            options,
        );

        return res.status(201).json({message: "User registered succesfully"});
    } catch(err: any) {
        return res.status(400).json({error: err.message});
    }
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body as {
        email: string;
        password: string; 
    };

    try {
        const user = await User.findOne({ where: { email }});
        if(!user) {
            return res.status(400).json({error: 'Invalid credentials' });
        }

        const valid = await user.checkPassword(password);
        if(!valid) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const payload = { sub: user.id, role: user.role };
        const options: SignOptions = { expiresIn: JWT_EXPIRES_IN, };
        const token = jwt.sign(
            payload,
            JWT_SECRET,
            options,
        );

        return res.json({ token });
    } catch(err: any) {
        return res.status(500).json({ error: 'Internal server error' });
    }
};
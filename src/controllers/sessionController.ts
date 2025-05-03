import { NextFunction, Request, Response } from "express";
import { Session } from "../models/Session";

/**
 * Controller to handle creating a new session in the database.
 * @param req - Express request object
 * @param res - Express response object
 */
export const createSession = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const session = await Session.create(req.body);
        res.status(201).json({message: "Session created successfully", id: session.id});
    } catch (error) {
        res.status(400).json({error: "Error creating session"});
    }
};

/**
 * Controller to handle fetching all sessions from the database.
 * @param req - Express request object
 * @param res - Express response object
 */
export const getAllSessions = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const sessions = await Session.findAll();
        res.json(sessions);
    } catch(error) {
        console.error("Error fetching sessions: ", error);
        res.status(500).json({error: "Internal server error"});
    }
};

export const getSessionById = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<any> => {
    try {
        const session = await Session.findByPk(req.params.id);
        if (!session) return res.status(404).json({error: "Session not found"});
        res.json(session);
    } catch(error) {
        console.error("Error fetching session: ", error);
        res.status(500).json({error: "Internal server error"});
    }
};

export const updateSession = async (
    req: Request, 
    res: Response,
    next: NextFunction
): Promise<any> => {
    try {
        const session = await Session.findByPk(req.params.id);
        if (!session) return res.status(404).json({error: "Session not found"});
        await session.update(req.body);
        res.json({"message": "Session updated successfully"});
    } catch(error) {
        console.error("Error updating session: ", error);
        res.status(500).json({error: "Internal server error"});
    }
};

export const deleteSession = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<any> => {
    try {
        const deleted = await Session.destroy({where: {id: req.params.id} });
        if (!deleted) return res.status(404).json({error: "Session not found"});
        res.json({message: "Session deleted successfully"});
    } catch(error) {
        console.error("Error deleting session: ", error);
        res.status(500).json({error: "Internal server error"});
    }
};


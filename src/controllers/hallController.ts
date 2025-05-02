import { NextFunction, Request, Response } from "express";
import { Hall } from "../models/Hall";

export const createHall = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const hall = await Hall.create(req.body);
        res.status(201).json({message: "Hall created successfully", id: hall.id});
    } catch (error) {
        res.status(400).json({error: "Error creating hall"});
    }
};

/**
 * Controller to handle fetching all halls from the database.
 * @param req - Express request object
 * @param res - Express response object
 */
export const getAllHalls = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const halls = await Hall.findAll();
        res.json(halls);
    } catch(error) {
        console.error("Error fetching halls: ", error);
        res.status(500).json({error: "Internal server error"});
    }
};

export const getHallById = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<any> => {
    try {
        const hall = await Hall.findByPk(req.params.id);
        if (!hall) return res.status(404).json({error: "Hall not found"});
        res.json(hall);
    } catch(error) {
        console.error("Error fetching hall: ", error);
        res.status(500).json({error: "Internal server error"});
    }
};

export const updateHall = async (
    req: Request, 
    res: Response,
    next: NextFunction
): Promise<any> => {
    try {
        const hall = await Hall.findByPk(req.params.id);
        if (!hall) return res.status(404).json({error: "Hall not found"});
        await hall.update(req.body);
        res.json({"message": "Hall updated successfully"});
    } catch(error) {
        console.error("Error updating hall: ", error);
        res.status(500).json({error: "Internal server error"});
    }
};

export const deleteHall = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<any> => {
    try {
        const deleted = await Hall.destroy({where: {id: req.params.id} });
        if (!deleted) return res.status(404).json({error: "Hall not found"});
        res.json({message: "Hall deleted successfully"});
    } catch(error) {
        console.error("Error deleting hall: ", error);
        res.status(500).json({error: "Internal server error"});
    }
};
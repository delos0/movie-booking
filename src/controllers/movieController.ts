import { NextFunction, Request, Response } from "express";
import { Movie } from "../models/Movie";

/**
 * Controller to handle creating a new movie in the database.
 * @param req - Express request object
 * @param res - Express response object
 */
export const createMovie = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const movie = await Movie.create(req.body);
        res.status(201).json({message: "Movie created successfully", id: movie.id});
    } catch (error) {
        res.status(400).json({error: "Error creating movie"});
    }
};

/**
 * Controller to handle fetching all movies from the database.
 * @param req - Express request object
 * @param res - Express response object
 */
export const getAllMovies = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const movies = await Movie.findAll();
        res.json(movies);
    } catch(error) {
        console.error("Error fetching movies: ", error);
        res.status(500).json({error: "Internal server error"});
    }
};

export const getMovieById = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<any> => {
    try {
        const movie = await Movie.findByPk(req.params.id);
        if (!movie) return res.status(404).json({error: "Movie not found"});
        res.json(movie);
    } catch(error) {
        console.error("Error fetching movie: ", error);
        res.status(500).json({error: "Internal server error"});
    }
};

export const updateMovie = async (
    req: Request, 
    res: Response,
    next: NextFunction
): Promise<any> => {
    try {
        const movie = await Movie.findByPk(req.params.id);
        if (!movie) return res.status(404).json({error: "Movie not found"});
        await movie.update(req.body);
        res.json({"message": "Movie updated successfully"});
    } catch(error) {
        console.error("Error updating movie: ", error);
        res.status(500).json({error: "Internal server error"});
    }
};

export const deleteMovie = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<any> => {
    try {
        const deleted = await Movie.destroy({where: {id: req.params.id} });
        if (!deleted) return res.status(404).json({error: "Movie not found"});
        res.json({message: "Movie deleted successfully"});
    } catch(error) {
        console.error("Error deleting movie: ", error);
        res.status(500).json({error: "Internal server error"});
    }
};


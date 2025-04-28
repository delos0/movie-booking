import express, { Request, Response, NextFunction } from "express";
import movieRoutes from "./routes/movieRoutes";

const app = express();
console.log('movieRoutes is', typeof movieRoutes);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/movies', movieRoutes);

export default app;
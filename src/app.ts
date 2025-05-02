import express, { Request, Response, NextFunction } from "express";
import movieRoutes from "./routes/movieRoutes";
import hallRoutes from "./routes/hallRoutes";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/movies', movieRoutes);
app.use('/halls', hallRoutes);
export default app;
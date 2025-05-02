import { Router } from "express";
import {
    createHall,
    getAllHalls,
    getHallById,
    updateHall,
    deleteHall,
} from "../controllers/hallController";

const router = Router();

router.post("/", createHall);
router.get("/", getAllHalls);
router.get("/:id", getHallById);
router.put("/:id", updateHall);
router.delete("/:id", deleteHall);

export default router;
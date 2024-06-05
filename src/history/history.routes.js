import { Router } from "express";
import { HistoryGet, getHistoryById } from "./history.controller.js";

const router = Router();

router.get("/", HistoryGet);
router.get("/:id", getHistoryById);

export default router;

import { Router } from "express";
import {
  check,
  reset,
} from "../controllers/rateLimiter.controller";

const router = Router();

router.post("/check", check);

router.post("/admin/reset/:apiKey", reset);

export default router;

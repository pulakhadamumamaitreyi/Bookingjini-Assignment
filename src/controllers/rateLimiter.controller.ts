import { Request, Response } from "express";
import {
  checkRateLimit,
  resetBucket,
} from "../services/tokenBucket.service";

export async function check(req: Request, res: Response) {
  try {
    const { apiKey, endpoint } = req.body;

    if (!apiKey || !endpoint) {
      return res.status(400).json({
        message: "apiKey and endpoint are required",
      });
    }

    const result = await checkRateLimit(apiKey);

    if (!result.allowed) {
      const retryAfter = Math.max(
        0,
        Math.ceil(
          (result.resetAt.getTime() - Date.now()) / 1000
        )
      );

      res.setHeader("Retry-After", retryAfter);

      return res.status(429).json(result);
    }

    return res.json(result);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

export async function reset(req: Request, res: Response) {
  try {
    const { apiKey } = req.params;

    await resetBucket(apiKey);

    return res.json({
      message: "Bucket Reset Successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

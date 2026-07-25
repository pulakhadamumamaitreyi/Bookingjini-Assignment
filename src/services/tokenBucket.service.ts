import fs from "fs";
import path from "path";
import redis from "./redis.service";

const luaScript = fs.readFileSync(
  path.join(__dirname, "../scripts/tokenBucket.lua"),
  "utf8"
);

const CAPACITY = 100;
const REFILL_RATE = 100 / 60;

export async function checkRateLimit(apiKey: string) {
  const key = `bucket:${apiKey}`;

  const now = Math.floor(Date.now() / 1000);

  const result = (await redis.eval(
    luaScript,
    1,
    key,
    CAPACITY,
    REFILL_RATE,
    now
  )) as number[];

  return {
    allowed: result[0] === 1,
    remaining: result[1],
    resetAt: new Date(result[2] * 1000),
  };
}

export async function resetBucket(apiKey: string) {
  await redis.del(`bucket:${apiKey}`);
}

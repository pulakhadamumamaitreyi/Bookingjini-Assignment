-- KEYS[1] = Redis key (bucket:<apiKey>)
-- ARGV[1] = Capacity
-- ARGV[2] = Refill rate (tokens per second)
-- ARGV[3] = Current timestamp (seconds)

local key = KEYS[1]

local capacity = tonumber(ARGV[1])
local refillRate = tonumber(ARGV[2])
local now = tonumber(ARGV[3])

-- Read bucket
local bucket = redis.call("HMGET", key, "tokens", "lastRefill")

local tokens = tonumber(bucket[1])
local lastRefill = tonumber(bucket[2])

-- First request
if tokens == nil then
    tokens = capacity
    lastRefill = now
end

-- Calculate elapsed time
local elapsed = now - lastRefill

-- Refill tokens
if elapsed > 0 then
    local refill = elapsed * refillRate
    tokens = math.min(capacity, tokens + refill)
    lastRefill = now
end

local allowed = 0

if tokens >= 1 then
    tokens = tokens - 1
    allowed = 1
end

redis.call(
    "HMSET",
    key,
    "tokens",
    tokens,
    "lastRefill",
    lastRefill
)

-- Expire bucket after inactivity
redis.call("EXPIRE", key, 120)

local resetSeconds = 0

if tokens < capacity then
    resetSeconds = math.ceil((capacity - tokens) / refillRate)
end

return {
    allowed,
    math.floor(tokens),
    now + resetSeconds
}

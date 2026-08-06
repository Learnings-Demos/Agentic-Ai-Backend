import { createClient } from "redis";

export const redisClient = createClient({
  socket: {
    reconnectStrategy: (retries) => {
      console.log(`🔁 Redis retry attempt #${retries}`);
      return Math.min(retries * 100, 3000); // retry with backoff
    },
  },
});

redisClient.on("connect", () => {
  console.log("✅ Redis Connected");
});

redisClient.on("reconnecting", () => {
  console.log("🔄 Redis reconnecting...");
});

redisClient.on("end", () => {
  console.log("⚠️ Redis connection closed");
});

redisClient.on("error", (err) => {
  console.error("❌ Redis error:", err);
});

export const initializeRedis = async () => {
  await redisClient.connect();
};

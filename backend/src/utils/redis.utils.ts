import { redisClient } from "../config/redis";

export const setValKey = async (key: string, data: string, Exp = 300) => {
  if (!key || !data) {
    throw new Error("provide all inputs");
  }

  await redisClient.set(key, data, { EX: Exp });
};

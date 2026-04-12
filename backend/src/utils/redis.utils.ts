import { redisClient } from "../config/redis";

export const setValKey = async (key: string, data: string, Exp = 300) => {
  if (!key || !data) {
    throw new Error("provide all inputs");
  }

  await redisClient.set(key, data, { EX: Exp });
};

export const getVal = async (cacheToken: string) => {
  try {
    if (!cacheToken) {
      throw new Error("give cache token");
    }

    const res = await redisClient.get(cacheToken);
    return res;
  } catch (err) {
    return null;
  }
};


export const scanKeys = async (pattern: string): Promise<string[]> => {
  const keys: string[] = [];
  let cursor = "0";

  do {
    const result = await redisClient.scan(cursor, {
      MATCH: pattern,
      COUNT: 100,
    });

    cursor = result.cursor;
    keys.push(...result.keys);
  } while (cursor !== "0");

  return keys;
};
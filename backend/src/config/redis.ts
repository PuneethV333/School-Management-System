import { createClient } from "redis";

const redisClient = createClient({
    url:process.env.REDIS_URL
})

redisClient.on("error",(err)=> {
    console.log("Redis error",err);
})
redisClient.on("connect",()=> {
    console.log("Redis connected...");
})
redisClient.on("ready",()=> {
    console.log("Redis ready to use...");
})

export const connectRedis = async () => {
    try{
        await redisClient.connect();
        console.log("Connected to redis");
    }catch(err){
        console.error(err);
        process.exit(1)
    }
}
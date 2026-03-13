import app from "./app"
import dotenv from "dotenv"
import connectDB from "./db/db"
import { connectRedis } from "./config/redis"



dotenv.config()

const PORT: number = Number(process.env.PORT) || 5000

const startServer = async () => {
    await connectDB();
    await connectRedis();
    
    app.listen(PORT,() => {
        console.log(`server running on ${PORT}`);
    })
}

startServer();
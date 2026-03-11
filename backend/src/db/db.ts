import mongoose from 'mongoose'

const connectDB = async (): Promise<void> => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("Mongo url not defined in .env")
        }
        await mongoose.connect(process.env.MONGO_URI);
        console.log("connected to db");
    } catch (err: any) {
        console.error("MongoDB connection failed:", err.message);
        process.exit(1);
    }
}

process.on("SIGINT", async () => {
    await mongoose.connection.close();
    console.log("mongodb disconnected");
    process.exit(0);
})

export default connectDB
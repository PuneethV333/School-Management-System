import app from "./app"
import dotenv from "dotenv"
import connectDB from "./db/db"



dotenv.config()

const PORT: number = Number(process.env.PORT) || 5000

connectDB().then(() => {
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
})

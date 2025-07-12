import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import adminrouter from "./routes/admin.auth";
import { connectCloudinary } from "./config/cloudinary";
import itemRouter from "./routes/item.routes";
const app = express();


app.use(express.json());
app.use(cors({
 origin: "http://localhost:3000",
  credentials: true,   
}))
 
dotenv.config()
connectCloudinary()



app.get("/test", (req, res) => {
  res.send("Backend is alive")
})



app.use("/api/admin",adminrouter)
app.use("/api/product",itemRouter)


app.listen(4000)
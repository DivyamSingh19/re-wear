import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import adminrouter from "./routes/admin.auth";
const app = express();


app.use(express.json());
app.use(cors())
 
dotenv.config()




app.get("/api/test", (req, res) => {
  res.send("Backend is alive")
})



app.use("/api/admin",adminrouter)



app.listen(4000)
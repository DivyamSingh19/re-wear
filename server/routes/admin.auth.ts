import adminLogin from "../controllers/adminAuth";
import express from "express"

const adminrouter = express.Router()


adminrouter.post("/admin-login",adminLogin)



export default adminrouter
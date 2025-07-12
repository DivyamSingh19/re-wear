import { register,login } from "../controllers/user.controller";
import express from "express"

const userRouter = express.Router();


userRouter.post("/register",register)
userRouter.post("/login",login)


export default userRouter
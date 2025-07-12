import { Request, Response } from "express";
import JWT from "jsonwebtoken";

const createToken = (id: string) => {
  return JWT.sign({ id }, process.env.JWT_SECRET as string);
};
const adminLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = JWT.sign(
        email + password,
        process.env.JWT_SECRET as string
      );
      res.json({
        success: true,
        token,
        email
      });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error  );
    res.status(500).json({
        success: false, 
        message:"Server error" });
  }
};

export default adminLogin;

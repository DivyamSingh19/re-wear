import { Request, Response, NextFunction } from "express";
import JWT from "jsonwebtoken";

const adminAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.token as string;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not Authorized. Login Again",
      });
    }

    const decoded = JWT.verify(token, process.env.JWT_SECRET as string);

    
    const expectedValue = (process.env.ADMIN_EMAIL || "") + (process.env.ADMIN_PASSWORD || "");

    if (decoded !== expectedValue) {
      return res.status(403).json({
        success: false,
        message: "Not Authorized. Login Again",
      });
    }

    next();
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

export default adminAuth;

import express, { NextFunction, Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

interface RegisterBody {
  name: string;
  email: string;
  password: string;
}

const router: Router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"; // fallback for dev

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

// Register
router.post("/register", async (req: Request, res: Response):Promise<any> => {
  try {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });
    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email },
      JWT_SECRET
    );
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Login
router.post("/login", async (req: Request, res: Response):Promise<any> => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email },
      JWT_SECRET
    );
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

export default router;

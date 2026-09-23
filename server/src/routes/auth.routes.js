import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/User.js";
import auth from "../middleware/auth.js";

const router = express.Router();


// REGISTER
router.post("/register", async (req, res) => {
  try {
    const {
      name,
      userId,
      email,
      password
    } = req.body;

    if (!name || !userId || !email || !password) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters"
      });
    }

    const existingUser = await User.findOne({
      $or: [
        { email: email.toLowerCase() },
        { userId: userId.toLowerCase() }
      ]
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Email or User ID already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      12
    );

    const user = await User.create({
      name,
      userId: userId.toLowerCase(),
      email: email.toLowerCase(),
      password: hashedPassword
    });

    const token = jwt.sign(
      {
        id: user._id.toString(),
        userId: user.userId
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d"
      }
    );

    res.status(201).json({
      message: "Registration successful",

      token,

      user: {
        id: user._id,
        name: user.name,
        userId: user.userId,
        email: user.email
      }
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Registration failed"
    });
  }
});


// LOGIN
router.post("/login", async (req, res) => {
  try {
    const {
      login,
      password
    } = req.body;

    if (!login || !password) {
      return res.status(400).json({
        message: "User ID/email and password are required"
      });
    }

    const user = await User.findOne({
      $or: [
        { email: login.toLowerCase() },
        { userId: login.toLowerCase() }
      ]
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }

    const token = jwt.sign(
      {
        id: user._id.toString(),
        userId: user.userId
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d"
      }
    );

    res.json({
      message: "Login successful",

      token,

      user: {
        id: user._id,
        name: user.name,
        userId: user.userId,
        email: user.email
      }
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Login failed"
    });
  }
});


// CURRENT USER
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.json({
      user
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch user"
    });
  }
});


export default router;
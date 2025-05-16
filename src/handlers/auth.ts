import { Request, Response } from "express";
import { RegisterDto } from "../dtos/Register.dto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../db";
import { BasicLoginDto } from "../dtos/BasicLogin.dto";
import crypto from "crypto";
import { sendEmail } from "../services/emailService";
import dotenv from "dotenv";

dotenv.config();

export const loginWithEmail = async (req: Request<{}, {}, BasicLoginDto>, res: Response) => {
  const { email, password } = req.body;
  if (!email || typeof email !== "string" || !email.includes("@")) {
    return res.status(400).json({ message: "Valid email is required" });
  }

  try {
    const user = await db.oneOrNone("SELECT * FROM users WHERE email = $1", [email]);

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password1" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password2" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET || "default_secret",
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const requestMagicLink = async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email || typeof email !== "string" || !email.includes("@")) {
    return res.status(400).json({ message: "Valid email is required" });
  }

  try {
    const user = await db.oneOrNone(`SELECT * FROM users WHERE email = $1`, [email]);
    if (!user) return res.status(404).json({ message: "Email not registered" });

    const token = crypto.randomBytes(32).toString("hex");

    const expiresAt = new Date(Date.now() + 1440 * 60 * 1000);

    await db.none(`INSERT INTO magic_links (user_id, token, expires_at) VALUES ($1, $2, $3)`, [user.id, token, expiresAt]);

    const link = `http://localhost:3000/api/auth/verify-email-token?token=${token}`;

    await sendEmail(email, "Login ke Aplikasi", `Klik link berikut untuk login (berlaku 1 hari):\n\n${link}`);

    res.json({ message: "Email Token has been sent to your email." });
  } catch (error) {
    console.error("Request magic link error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const verifyMagicLink = async (req: Request, res: Response) => {
  const { token } = req.query;

  if (!token || typeof token !== "string") {
    return res.status(400).json({ message: "Token is required" });
  }

  try {
    const record = await db.oneOrNone(`SELECT * FROM magic_links WHERE token = $1 AND expires_at > NOW() AND used = FALSE`, [token]);

    if (!record) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    await db.none(`UPDATE magic_links SET used = TRUE WHERE id = $1`, [record.id]);

    const user = await db.one(`SELECT * FROM users WHERE id = $1`, [record.user_id]);

    const jwtToken = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });

    res.json({ token: jwtToken, message: "Login successful" });
  } catch (error) {
    console.error("Verify magic link error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const register = async (req: Request<{}, {}, RegisterDto>, res: Response) => {
  const { email, password } = req.body;
  if (!email || typeof email !== "string" || !email.includes("@")) {
    return res.status(400).json({ message: "Valid email is required" });
  }

  try {
    const existingUser = await db.oneOrNone("SELECT id FROM users WHERE email = $1", [email]);
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await db.one(`INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email`, [email, hashedPassword]);

    return res.status(201).json({
      message: "User registered successfully.",
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

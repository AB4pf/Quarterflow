import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import pool from "../config/db";
import { signToken } from "../utils/jwt";

interface UserRow {
  id: number;
  email: string;
  password_hash: string;
  name: string;
}

export async function register(req: Request, res: Response) {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ error: "email, password, and name are required" });
  }

  if (typeof password !== "string" || password.length < 8) {
    return res.status(400).json({ error: "password must be at least 8 characters" });
  }

  const [existing] = await pool.query("SELECT id FROM users WHERE email = ?", [email]);
  if (Array.isArray(existing) && existing.length > 0) {
    return res.status(409).json({ error: "An account with that email already exists" });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const [result]: any = await pool.query(
    "INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)",
    [email, passwordHash, name]
  );

  const token = signToken({ userId: result.insertId, email });

  return res.status(201).json({
    token,
    user: { id: result.insertId, email, name },
  });
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "email and password are required" });
  }

  const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
  const users = rows as UserRow[];

  if (users.length === 0) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const user = users[0];
  const valid = await bcrypt.compare(password, user.password_hash);

  if (!valid) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const token = signToken({ userId: user.id, email: user.email });

  return res.json({
    token,
    user: { id: user.id, email: user.email, name: user.name },
  });
}

export async function me(req: Request, res: Response) {
  const [rows] = await pool.query("SELECT id, email, name, created_at FROM users WHERE id = ?", [
    req.user!.userId,
  ]);
  const users = rows as UserRow[];

  if (users.length === 0) {
    return res.status(404).json({ error: "User not found" });
  }

  return res.json({ user: users[0] });
}

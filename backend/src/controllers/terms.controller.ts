import { Request, Response } from "express";
import pool from "../config/db";

export async function createTerm(req: Request, res: Response) {
  const userId = req.user!.userId;
  const { name, start_date, end_date } = req.body;

  if (!name || !start_date || !end_date) {
    return res.status(400).json({ error: "name, start_date and end_date are required" });
  }

  try {
    const insertRes: any = await (pool.query(
      "INSERT INTO terms (user_id, name, start_date, end_date) VALUES (?, ?, ?, ?)",
      [userId, name, start_date, end_date]
    ) as Promise<any>);

    const termId = insertRes[0]?.insertId;
    const selectRes: any = await (pool.query(
      "SELECT id, user_id, name, start_date, end_date FROM terms WHERE id = ?",
      [termId]
    ) as Promise<any>);
    return res.status(201).json({ term: selectRes[0]?.[0] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to create term" });
  }
}

export async function listTerms(req: Request, res: Response) {
  const userId = req.user!.userId;
  try {
    const resRows: any = await (pool.query(
      "SELECT id, user_id, name, start_date, end_date FROM terms WHERE user_id = ? ORDER BY start_date DESC",
      [userId]
    ) as Promise<any>);
    return res.json({ terms: resRows[0] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to fetch terms" });
  }
}

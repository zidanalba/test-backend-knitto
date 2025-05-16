import { Request, Response } from "express";
import db from "../db";

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await db.any(`
      SELECT * 
      FROM products p
      `);
    res.status(200).json({
      message: "Products retrieved successfully.",
      data: products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

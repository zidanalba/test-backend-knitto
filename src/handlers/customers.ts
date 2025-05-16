import { Request, Response } from "express";
import db from "../db";

export const getCustomers = async (req: Request, res: Response) => {
  try {
    const customers = await db.any(`
      SELECT * 
      FROM customers c
      `);
    res.status(200).json({
      message: "Customers retrieved successfully.",
      data: customers,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

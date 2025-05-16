import { Request, Response } from "express";
import db from "../db";
import { CreateSalesDto } from "../dtos/CreateSales.dto";
import { UpdateSalesDto } from "../dtos/UpdateSales.dto";

export const getSales = async (req: Request, res: Response) => {
  try {
    const sales = await db.any(`
      SELECT 
        sh.id AS id, 
        c.name AS customer_name, 
        sh.date,
        sh.code,
        SUM(sd.subtotal) AS total
      FROM sales_headers sh
      JOIN customers c ON c.id = sh.customer_id
      JOIN sales_details sd ON sh.id = sd.sales_header_id
      GROUP BY sh.id, c.name, sh.date
      ORDER BY sh.date
      `);
    res.status(200).json({
      message: "Sales retrieved successfully.",
      data: sales,
    });
  } catch (error) {
    console.error("Error fetching sales:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getSaleById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const saleHeader = await db.oneOrNone(
      `
      SELECT
        sh.id,
        sh.customer_id,
        sh.date,
        sh.code,
        c.name AS customer_name
      FROM sales_headers sh
      JOIN customers c ON c.id = sh.customer_id 
      WHERE sh.id = $1
      `,
      [id]
    );

    if (!saleHeader) {
      return res.status(404).json({ message: "Sale not found" });
    }

    const saleDetails = await db.any(
      `
      SELECT 
        sd.id,
        sd.product_id, 
        p.name AS product_name,
        p.category, 
        p.price, 
        sd.quantity, 
        sd.subtotal
      FROM sales_details sd
      JOIN products p ON p.id = sd.product_id 
      WHERE sd.sales_header_id  = $1
      `,
      [id]
    );

    if (!saleDetails) {
      return res.status(404).json({ message: "Sale details not found" });
    }

    const result = {
      id: saleHeader.id,
      date: saleHeader.date,
      customer: {
        id: saleHeader.customer_id,
        name: saleHeader.customer_name,
      },
      items: saleDetails.map((item) => ({
        sale_details_id: item.id,
        product_id: item.product_id,
        name: item.product_name,
        category: item.category,
        price: item.price,
        quantity: item.quantity,
        subtotal: item.subtotal,
      })),
    };

    res.status(200).json({
      message: "Sale retrieved successfully.",
      data: result,
    });
  } catch (error) {
    console.error("Error fetching sale by ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const createSales = async (req: Request<{}, {}, CreateSalesDto>, res: Response) => {
  const { date, customer_id, items } = req.body;

  try {
    await db.tx(async (t) => {
      const code = await generateUniqueSalesCode(t);

      // produk dalam sales
      const productIds = items.map((item) => item.product_id);

      const products = await t.any(`SELECT id, price FROM products WHERE id IN ($1:csv)`, [productIds]);

      // mapping
      const productMap = new Map<number, number>();
      products.forEach((p) => productMap.set(p.id, p.price));

      // insert sales_headers
      const insertHeaderQuery = `
        INSERT INTO sales_headers (date, customer_id, code)
        VALUES ($1, $2, $3)
        RETURNING id
      `;
      const { id: sales_id } = await t.one(insertHeaderQuery, [date, customer_id, code]);

      // insert sales_details
      const insertDetailQuery = `
        INSERT INTO sales_details (sales_header_id, product_id, quantity, subtotal)
        VALUES ($1, $2, $3, $4)
      `;

      for (const item of items) {
        const price = productMap.get(item.product_id);
        if (price === undefined) {
          throw new Error(`Product with id ${item.product_id} not found`);
        }

        const subtotal = price * item.quantity;
        await t.none(insertDetailQuery, [sales_id, item.product_id, item.quantity, subtotal]);
      }

      res.status(201).json({
        message: "Sales created successfully.",
        sales_id,
      });
    });
  } catch (error) {
    console.error("Error creating sales:", error);
    res.status(500).json({ message: "Failed to create sales" });
  }
};

export const updateSaleById = async (req: Request<{ id: string }, {}, UpdateSalesDto>, res: Response) => {
  const { date, customer_id, items, new_items } = req.body;
  const { id } = req.params;

  try {
    await db.tx(async (t) => {
      // update sales_headers
      await t.none(`UPDATE sales_headers SET date = $1, customer_id = $2 WHERE id = $3`, [date, customer_id, id]);

      // update sales_details
      const existingDetails = await t.any(`SELECT id FROM sales_details WHERE sales_header_id = $1`, [id]);
      const existingIds = existingDetails.map((d) => d.id);

      const incomingIds = items.map((i) => i.sale_details_id);

      // hapus sales_details yang tidak ada dalam items (dianggap dihapus oleh user)
      const toDelete = existingIds.filter((id) => !incomingIds.includes(id));
      if (toDelete.length > 0) {
        await t.none(`DELETE FROM sales_details WHERE id IN ($1:csv)`, [toDelete]);
      }

      // update sale_details yang masih ada
      for (const item of items) {
        const product = await t.one(`SELECT price FROM products WHERE id = $1`, [item.product_id]);
        const subtotal = product.price * item.quantity;

        await t.none(`UPDATE sales_details SET product_id = $1, quantity = $2, subtotal = $3 WHERE id = $4`, [item.product_id, item.quantity, subtotal, item.sale_details_id]);
      }

      // tambah item baru ke sales_details (jika ada)
      for (const newItem of new_items) {
        const product = await t.one(`SELECT price FROM products WHERE id = $1`, [newItem.product_id]);
        const subtotal = product.price * newItem.quantity;

        await t.none(
          `INSERT INTO sales_details (sales_header_id, product_id, quantity, subtotal)
           VALUES ($1, $2, $3, $4)`,
          [id, newItem.product_id, newItem.quantity, subtotal]
        );
      }

      res.status(200).json({ message: "Sales updated successfully" });
    });
  } catch (error) {
    console.error("Error updating sales:", error);
    res.status(500).json({ message: "Failed to update sales" });
  }
};

export const deleteSaleById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await db.tx(async (t) => {
      const existingHeader = await t.oneOrNone(`SELECT id FROM sales_headers WHERE id = $1`, [id]);

      if (!existingHeader) {
        return res.status(404).json({ message: "Sale not found" });
      }

      // hapus sales_details
      await t.none(`DELETE FROM sales_details WHERE sales_header_id = $1`, [id]);

      // hapus sales_headers
      await t.none(`DELETE FROM sales_headers WHERE id = $1`, [id]);
    });

    res.status(200).json({ message: "Sale deleted successfully" });
  } catch (error) {
    console.error("Error deleting sale:", error);
    res.status(500).json({ message: "Failed to delete sale" });
  }
};

export const getReportSalesPerDay = async (req: Request, res: Response) => {
  try {
    const sales = await db.any(`
      SELECT 
        sh."date",
        sum(sd.subtotal) as total_sales
      FROM sales_details sd
      JOIN sales_headers sh ON sd.sales_header_id = sh.id
      GROUP BY sh.date
      ORDER BY sh.date
      `);
    res.status(200).json({
      message: "Sales report per day retrieved successfully.",
      data: sales,
    });
  } catch (error) {
    console.error("Error fetching sales:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// utils
async function generateUniqueSalesCode(t: any): Promise<string> {
  const today = new Date();
  const yyyymmdd = today.toISOString().slice(0, 10).replace(/-/g, "");
  const prefix = `INV-${yyyymmdd}`;

  // lock counter
  const counter = await t.oneOrNone(`SELECT * FROM code_counters WHERE prefix = $1 FOR UPDATE`, [prefix]);

  let nextNumber = 1;

  if (counter) {
    nextNumber = counter.last_number + 1;
    await t.none(`UPDATE code_counters SET last_number = $1 WHERE prefix = $2`, [nextNumber, prefix]);
  } else {
    await t.none(`INSERT INTO code_counters (prefix, last_number) VALUES ($1, $2)`, [prefix, nextNumber]);
  }

  const padded = nextNumber.toString().padStart(4, "0");
  return `${prefix}-${padded}`;
}

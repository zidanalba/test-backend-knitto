import cron from "node-cron";
import db from "../db";
import { sendEmail } from "../services/emailService";

cron.schedule("*/5 * * * *", async () => {
  try {
    const today = new Date().toISOString().split("T")[0];
    const result = await db.oneOrNone(
      `
    SELECT 
    COUNT(DISTINCT sh.id) AS total_transaksi,
    COALESCE(SUM(sd.quantity * p.price), 0) AS total_penjualan
    FROM sales_headers sh
    JOIN sales_details sd ON sh.id = sd.sales_header_id
    JOIN products p ON sd.product_id = p.id 
    WHERE sh.date = $1;
      `,
      [today]
    );

    const topProduct = await db.oneOrNone(
      `
        SELECT 
        p."name" AS product_name, 
        p.category,
        SUM(sd.quantity) AS total_qty
        FROM sales_details sd
        JOIN sales_headers sh ON sd.sales_header_id = sh.id
        JOIN products p ON sd.product_id = p.id 
        WHERE sh.date = $1
        GROUP BY (p.name, p.category)
        ORDER BY total_qty DESC
        LIMIT 1;
      `,
      [today]
    );

    const content = `
Laporan Penjualan Harian (${today})
======================================
Total Transaksi: ${result?.total_transaksi}
Total Penjualan: Rp ${result?.total_penjualan}
Produk Terlaris: ${topProduct?.product_name ?? "-"} (${topProduct?.total_qty ?? 0} unit)
`;
    const users = await db.any(`SELECT email FROM users WHERE email IS NOT NULL`);

    for (const user of users) {
      await sendEmail(user.email, `Laporan Penjualan ${today}`, content);
    }
    console.log("Laporan harian berhasil dikirim.");
  } catch (error) {
    console.error("Gagal kirim laporan harian:", error);
  }
});

import { Router } from "express";
import { authenticateJWT } from "../middlewares/authenticateJWT";
import { createOrder } from "../handlers/order";

const router = Router();
/**
 * @swagger
 * /order/:
 *   post:
 *     summary: Membuat order baru
 *     tags:
 *       - Order
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_customer:
 *                 type: integer
 *                 example: 1
 *               address:
 *                 type: string
 *                 example: "Jl. Merdeka No. 10, Jakarta"
 *               payment_type:
 *                 type: string
 *                 example: "Transfer Bank"
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     product_id:
 *                       type: integer
 *                       example: 101
 *                     name:
 *                       type: string
 *                       example: "Produk A"
 *                     price:
 *                       type: number
 *                       example: 150000
 *                     qty:
 *                       type: integer
 *                       example: 2
 *     responses:
 *       201:
 *         description: Order berhasil dibuat
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 order_number:
 *                   type: string
 *                   example: "ORDER-1-220524-00001"
 *                 message:
 *                   type: string
 *                   example: "Order berhasil dibuat"
 *       429:
 *         description: Request ditolak karena proses sebelumnya belum selesai
 *       500:
 *         description: Kesalahan server / penyimpanan file gagal
 */

router.post("/", createOrder);

export default router;

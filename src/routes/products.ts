import { Router } from "express";
import { getProducts } from "../handlers/products";
import { authenticateJWT } from "../middlewares/authenticateJWT";

const router = Router();

/**
 * @swagger
 * /products/:
 *   get:
 *     summary: Mengambil semua produk
 *     tags:
 *      - General
 *     responses:
 *       200:
 *         description: Products retrieved successfully.
 */
router.get("/", authenticateJWT, getProducts);

export default router;

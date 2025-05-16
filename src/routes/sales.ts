import { Router } from "express";
import { createSales, deleteSaleById, getSaleById, getSales, updateSaleById } from "../handlers/sales";
import { authenticateJWT } from "../middlewares/authenticateJWT";

const router = Router();

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /sales/:
 *   get:
 *     summary: Mengambil semua penjualan
 *     tags :
 *          - Sales
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sales retrieved successfully.
 */
router.get("/", authenticateJWT, getSales);

/**
 * @swagger
 * /sales/{id}:
 *   get:
 *     summary: Mengambil data penjualan berdasarkan id
 *     tags:
 *       - Sales
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID penjualan yang ingin diambil
 *         example: 1
 *     responses:
 *       200:
 *         description: Sales retrieved successfully.
 *       404:
 *         description: Sale not found
 */
router.get("/:id", authenticateJWT, getSaleById);

/**
 * @swagger
 * /sales/{id}:
 *   delete:
 *     summary: Menghapus data penjualan berdasarkan id
 *     tags:
 *       - Sales
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID penjualan yang ingin dihapus
 *         example: 1
 *     responses:
 *       200:
 *         description: Sales retrieved successfully.
 *       404:
 *         description: Sale not found
 */
router.delete("/:id", authenticateJWT, deleteSaleById);

/**
 * @swagger
 * /sales:
 *   post:
 *     summary: Membuat sales baru
 *     tags:
 *       - Sales
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - date
 *               - customer_id
 *               - items
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2025-05-16"
 *               customer_id:
 *                 type: integer
 *                 example: 1
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - product_id
 *                     - quantity
 *                   properties:
 *                     product_id:
 *                       type: integer
 *                       example: 3
 *                     quantity:
 *                       type: integer
 *                       example: 2
 *     responses:
 *       201:
 *         description: Sales created successfully
 *       500:
 *         description: Failed to create sales
 */
router.post("/", authenticateJWT, createSales);

/**
 * @swagger
 * /sales/{id}:
 *   put:
 *     summary: Update data penjualan
 *     tags:
 *       - Sales
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - date
 *               - customer_id
 *               - items
 *               - new_items
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2025-05-16"
 *               customer_id:
 *                 type: integer
 *                 example: 1
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - sale_details_id
 *                     - product_id
 *                     - quantity
 *                   properties:
 *                     sale_details_id:
 *                       type: integer
 *                       example: 10
 *                     product_id:
 *                       type: integer
 *                       example: 3
 *                     quantity:
 *                       type: integer
 *                       example: 2
 *               new_items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - product_id
 *                     - quantity
 *                   properties:
 *                     product_id:
 *                       type: integer
 *                       example: 4
 *                     quantity:
 *                       type: integer
 *                       example: 5
 *     responses:
 *       200:
 *         description: Sales updated successfully
 *       404:
 *         description: Sale not found
 *       500:
 *         description: Failed to update sales
 */

router.put("/:id", authenticateJWT, updateSaleById);

export default router;

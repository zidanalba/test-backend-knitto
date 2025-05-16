import { Router } from "express";
import { getCustomers } from "../handlers/customers";
import { authenticateJWT } from "../middlewares/authenticateJWT";

const router = Router();

/**
 * @swagger
 * /customers/:
 *   get:
 *     summary: Mengambil semua customer
 *     tags:
 *      - General
 *     responses:
 *       200:
 *         description: Customers retrieved successfully.
 */
router.get("/", authenticateJWT, getCustomers);

export default router;

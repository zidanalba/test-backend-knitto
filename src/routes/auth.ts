import { Router } from "express";
import { loginWithEmail, register, requestMagicLink, verifyMagicLink } from "../handlers/auth";

const router = Router();

/**
 * @swagger
 * /auth/login/:
 *   post:
 *     summary: Login menggunakan email dan password
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: yourpassword123
 *     responses:
 *       200:
 *         description: Login berhasil, mengembalikan token JWT dan data user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login successful
 *                 token:
 *                   type: string
 *                   description: JWT token yang digunakan untuk autentikasi
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     email:
 *                       type: string
 *                       format: email
 *                       example: user@example.com
 *       401:
 *         description: Email atau password tidak valid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid email or password
 *       500:
 *         description: Kesalahan server internal
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */

router.post("/login", loginWithEmail);

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register user baru menggunakan email dan password
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: secret123
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User registered successfully.
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     email:
 *                       type: string
 *                       example: user@example.com
 *       400:
 *         description: Email already registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Email already registered.
 *       500:
 *         description: Internal server error
 */

router.post("/register", register);

/**
 * @swagger
 * /auth/login-via-email-token:
 *   post:
 *     summary: Kirim magic link ke email untuk login tanpa password
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: Magic link telah dikirim ke email
 *       404:
 *         description: Email tidak terdaftar
 *       500:
 *         description: Terjadi kesalahan internal
 */

router.post("/login-via-email-token", requestMagicLink);

/**
 * @swagger
 * /auth/verify-email-token:
 *   post:
 *     summary: Verifikasi token dari magic link untuk login
 *     tags:
 *       - Auth
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Token yang dikirim melalui email
 *     responses:
 *       200:
 *         description: Login berhasil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token
 *                 message:
 *                   type: string
 *                   example: Login successful
 *       400:
 *         description: Token tidak diberikan
 *       401:
 *         description: Token tidak valid atau sudah kadaluarsa
 *       500:
 *         description: Terjadi kesalahan internal
 */

router.post("/verify-email-token", verifyMagicLink);

export default router;

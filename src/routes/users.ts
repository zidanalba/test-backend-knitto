import { Router } from "express";
import { createUser, getUserById, getUsers } from "../handlers/users";

const router = Router();

// /api/users/
router.get("/", getUsers);

// /api/users/
router.post("/", createUser);

// /api/users/:id
router.get("/:id", getUserById);

export default router;

import express from "express";
import usersRouter from "./routes/users";
import salesRouter from "./routes/sales";
import productsRouter from "./routes/products";
import customersRouter from "./routes/customers";
import authRouter from "./routes/auth";
import { swaggerSpec, swaggerUi } from "./swagger";
import dotenv from "dotenv";
import "./cron/dailyReport";

const app = express();

dotenv.config();

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(express.json());

app.use("/api/users", usersRouter);
app.use("/api/sales", salesRouter);
app.use("/api/products", productsRouter);
app.use("/api/customers", customersRouter);
app.use("/api/auth", authRouter);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Running on Port ${PORT}`);
});

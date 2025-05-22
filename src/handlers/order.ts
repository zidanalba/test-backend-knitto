import { Request, Response } from "express";
import { acquireLock, releaseLock } from "../helpers/lockManager";
import { generateOrderNumber, writeOrderFileWithRetry } from "../helpers/fileHelper";

export interface CreateOrderDto {
  id_customer: number;
  address: string;
  payment_type: string;
  items: {
    product_id: number;
    name: string;
    price: number;
    qty: number;
  }[];
}

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

const customerLocks: Record<string, boolean> = {};

export const createOrder = async (req: Request<{}, {}, CreateOrderDto>, res: Response) => {
  try {
    const { address, payment_type, items, id_customer } = req.body;

    if (!(await acquireLock(id_customer))) {
      return res.status(429).json({ message: "Request sedang diproses untuk customer ini" });
    }

    await delay(3000);

    const order_number = await generateOrderNumber(id_customer);
    const created_at = new Date().toISOString();

    const total_price = items.reduce((sum, item) => sum + item.price * item.qty, 0);

    const orderData = {
      order_number,
      id_customer,
      address,
      payment_type,
      items,
      total_price,
      status: "Diproses",
      created_at,
    };

    await writeOrderFileWithRetry(order_number, orderData);

    res.status(200).json({ message: "Order berhasil diproses", order_number });
  } catch (error: any) {
    res.status(500).json({ message: "Terjadi kesalahan", error: error.message });
  } finally {
    const id_customer = (req as any).user?.id || 1;
    releaseLock(id_customer);
  }
};

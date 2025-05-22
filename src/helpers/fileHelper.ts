import fs from "fs/promises";
import path from "path";
import { loadRunningNumber, saveRunningNumber } from "./runningNumber";

const orderDir = path.join(__dirname, "../database/customer-order");
let runningNumber = 1;

export async function generateOrderNumber(customerId: number): Promise<string> {
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, "0");
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const yy = String(now.getFullYear()).toString().slice(-2);
  const dateStr = `${dd}${mm}${yy}`;

  const key = `${customerId}-${dateStr}`;

  const counterMap = await loadRunningNumber();

  const currentNumber = (counterMap[key] || 0) + 1;
  counterMap[key] = currentNumber;

  await saveRunningNumber(counterMap);

  const orderNumber = `ORDER-${customerId}-${dateStr}-${String(currentNumber).padStart(5, "0")}`;
  return orderNumber;
}

export async function writeOrderFileWithRetry(orderNumber: string, data: any, attempt = 1): Promise<void> {
  const filePath = path.join(orderDir, `${orderNumber}.json`);
  try {
    await fs.mkdir(orderDir, { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  } catch (err) {
    if (attempt < 3) return await writeOrderFileWithRetry(orderNumber, data, attempt + 1);
    throw err;
  }
}

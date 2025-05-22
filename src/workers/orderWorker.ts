import fs from "fs/promises";
import path from "path";

const CUSTOMER_ORDER_DIR = path.join(__dirname, "../database/customer-order");
const DELIVERED_ORDER_DIR = path.join(__dirname, "../database/delivered-order");

const MAX_CONCURRENT_FILES = 10;
const MAX_RETRY = 3;

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

const processFileWithRetry = async (filename: string, attempt = 1): Promise<void> => {
  try {
    const filePath = path.join(CUSTOMER_ORDER_DIR, filename);
    const fileContent = await fs.readFile(filePath, "utf-8");
    const data = JSON.parse(fileContent);

    data.status = "Dikirim ke customer";

    const deliveredPath = path.join(DELIVERED_ORDER_DIR, filename);

    try {
      await fs.access(deliveredPath);
      console.log(`Lewati file ${filename}, sudah ada di delivered-order`);
      return;
    } catch {}

    await fs.writeFile(deliveredPath, JSON.stringify(data, null, 2));
    await fs.unlink(filePath);
    console.log(`Sukses kirim file: ${filename}`);
  } catch (err) {
    if (attempt < MAX_RETRY) {
      console.warn(`Retry file ${filename} (${attempt}/${MAX_RETRY})`);
      await delay(1000);
      return processFileWithRetry(filename, attempt + 1);
    } else {
      console.error(`Gagal proses file ${filename}:`, err.message);
    }
  }
};

const runWorker = async () => {
  try {
    const files = await fs.readdir(CUSTOMER_ORDER_DIR);
    const toProcess = files.slice(0, MAX_CONCURRENT_FILES); // maksimal 10 file

    await Promise.all(toProcess.map((file) => processFileWithRetry(file)));
  } catch (err) {
    console.error("Worker gagal dijalankan:", err.message);
  }
};

setInterval(runWorker, 10_000);

console.log("Worker berjalan tiap 10 detik...");

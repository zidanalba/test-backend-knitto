import fs from "fs/promises";
import path from "path";

const orderDir = path.join(__dirname, "../database/customer-order");
const counterFile = path.join(__dirname, "../database/runningNumber.json");

interface RunningNumberMap {
  [key: string]: number;
}

export async function loadRunningNumber(): Promise<RunningNumberMap> {
  try {
    const content = await fs.readFile(counterFile, "utf-8");
    return JSON.parse(content);
  } catch {
    return {};
  }
}

export async function saveRunningNumber(map: RunningNumberMap): Promise<void> {
  await fs.mkdir(path.dirname(counterFile), { recursive: true });
  await fs.writeFile(counterFile, JSON.stringify(map, null, 2));
}

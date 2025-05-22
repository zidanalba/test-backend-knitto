const locks = new Map<number, boolean>();

export async function acquireLock(customerId: number): Promise<boolean> {
  if (locks.get(customerId)) return false;
  locks.set(customerId, true);
  return true;
}

export function releaseLock(customerId: number) {
  locks.delete(customerId);
}

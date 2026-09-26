export const kudosEditWindowMs = 30 * 60 * 1000;

export function canEditKudos(createdAt: string | Date, now = Date.now()) {
  const sentAt =
    createdAt instanceof Date
      ? createdAt.getTime()
      : new Date(createdAt).getTime();

  return now - sentAt < kudosEditWindowMs;
}

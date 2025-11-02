import fs from "fs";
import path from "path";

export function createLog(room_id: string, message: string) {
  const dateNow = new Date();

  const logDir = path.join(__dirname, "..", "..", "logs");
  if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });
  const file = path.join(
    logDir,
    `${
      dateNow.getUTCMonth() + 1
    }.${dateNow.getUTCDate()}.${dateNow.getUTCFullYear()}_${room_id}.log`
  );

  const log = `[${dateNow.toISOString()}] ${message}\n`;

  try {
    fs.appendFileSync(file, log, "utf-8");
  } catch (err) {
    console.error(`Failed to write log for room ${room_id}:`, err);
  }
}

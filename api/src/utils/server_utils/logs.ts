import fs from "fs";
import path from "path";

export function createLog(room_id: string, message: string) {
   const dateNow = new Date();
   
   const file = path.join(__dirname, "..", "..", "logs", `${dateNow.getUTCMonth()}.${dateNow.getUTCDay()}.${dateNow.getUTCFullYear()}_${room_id}.log`);
   console.log(file);

   const log = `[${dateNow.toISOString()}] ${message}\n`

   fs.appendFileSync(file, log, "utf-8");
}
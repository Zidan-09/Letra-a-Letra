import fs from "fs";
import path from "path";

function createLog(message: string) {
   const dateNow = new Date();
   
   const file = path.join(__dirname, "..", "..", "logs", `${dateNow.getUTCDay()}_${dateNow.getUTCMonth()}_${dateNow.getUTCFullYear()}.log`);
   console.log(file);

   const log = `[${dateNow}] ${message}\n`

   fs.appendFileSync(file, log, "utf-8");
}
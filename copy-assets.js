import { cpSync } from "fs";
import { resolve } from "path";

const src = resolve("src/electron/html");
const dest = resolve("dist-electron/html");

cpSync(src, dest, { recursive: true });
console.log("✅ HTML assets copied to dist-electron/html");

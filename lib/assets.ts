import "server-only";
import { existsSync } from "node:fs";
import path from "node:path";

/** True when a file exists in /public (checked at build/render time on the server). */
export const publicFileExists = (src: string) => existsSync(path.join(process.cwd(), "public", src));

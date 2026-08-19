import { cpSync, mkdirSync } from "node:fs";

const standaloneRoot = ".next/standalone";

mkdirSync(`${standaloneRoot}/.next`, { recursive: true });
cpSync("public", `${standaloneRoot}/public`, { recursive: true });
cpSync(".next/static", `${standaloneRoot}/.next/static`, { recursive: true });

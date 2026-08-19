import { spawn } from "node:child_process";

const server = spawn(process.execPath, [".next/standalone/server.js"], {
  env: { ...process.env, HOSTNAME: "127.0.0.1", PORT: "3100" },
  stdio: "inherit",
});

async function waitForServer() {
  const deadline = Date.now() + 30_000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch("http://127.0.0.1:3100/shop");
      if (response.ok) return;
    } catch {
      // The server is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error("Timed out waiting for the E2E server");
}

function runPlaywright() {
  return new Promise((resolve, reject) => {
    const test = spawn(
      process.execPath,
      ["node_modules/@playwright/test/cli.js", "test"],
      { stdio: "inherit", env: process.env }
    );
    test.once("error", reject);
    test.once("exit", (code) => resolve(code ?? 1));
  });
}

let exitCode = 1;
try {
  await waitForServer();
  exitCode = await runPlaywright();
} finally {
  server.kill();
}

process.exitCode = exitCode;

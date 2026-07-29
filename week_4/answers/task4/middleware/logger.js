import fs from "fs";

export function requestLogger(req, res, next) {
  const start = Date.now();
  const timestamp = new Date().toISOString();

  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);

  if (req.method === "POST" || req.method === "PUT") {
    console.log(`  Body: ${JSON.stringify(req.body)}`);
  }

  res.on("finish", () => {
    const duration = Date.now() - start;
    const status = res.statusCode;
    const logLine = `[${timestamp}] ${req.method} ${req.originalUrl} -> ${status} (${duration}ms)`;

    if (status >= 400) {
      console.log(`\x1b[31m  ${logLine}\x1b[0m`);
    } else {
      console.log(`\x1b[32m  ${logLine}\x1b[0m`);
    }

    fs.appendFile("access.log", logLine + "\n", (err) => {
      if (err) console.error("Failed to write to access.log", err);
    });
  });

  next();
}

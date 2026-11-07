import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { spawn } from "node:child_process";

const origin = "http://127.0.0.1:8092";
const files = new Set(["index.html", "theme.css", "app.js", "storage.mjs", "i18n.mjs", "translation.mjs", "highlights.mjs", "operations.mjs",
  "rich-editor.mjs", "rich-editor-dom.mjs", "rich-text.mjs", "rich-list.mjs"]);
const types = {html:"text/html", css:"text/css", js:"text/javascript", mjs:"text/javascript"};

const server = createServer(async (request, response) => {
  const path = request.url?.split("?")[0].slice(1) || "index.html";
  if (!["GET", "HEAD"].includes(request.method) || !files.has(path)) {
    response.writeHead(404).end();
    return;
  }
  try {
    const content = await readFile(new URL(path, import.meta.url));
    response.writeHead(200, {
      "Content-Type": types[path.split(".").at(-1)] + "; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "no-cache"
    });
    response.end(request.method === "HEAD" ? undefined : content);
  } catch {
    response.writeHead(500).end();
  }
});
server.on("error", error => {
  console.error(error.code === "EADDRINUSE" ? "Port 8092 ist bereits belegt. Wenn der Service Desk läuft, öffne " + origin : error.message);
  process.exitCode = 1;
});
server.listen(8092, "127.0.0.1", () => {
  console.log("LLSG Service Desk läuft auf " + origin + " – zum Beenden Strg+C.");
  if (process.platform === "win32" && process.argv.includes("--open")) {
    const browser = spawn("cmd.exe", ["/d", "/c", "start", "", origin], {windowsHide:true, stdio:"ignore"});
    browser.on("error", () => console.log("Bitte die Adresse im Browser öffnen: " + origin));
  }
});


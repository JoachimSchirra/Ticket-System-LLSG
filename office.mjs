import { createHash, randomUUID } from "node:crypto";
import { mkdtemp, open, rmdir, unlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawn } from "node:child_process";

const limit = 10 * 1024 * 1024;
const sessions = new Map();
const digest = data => createHash("sha256").update(data).digest("hex");

async function readCopy(filename) {
  const file = await open(filename, "r");
  let bytes;
  try {
    const buffer = Buffer.alloc(limit + 1);
    let size = 0;
    while (size < buffer.length) {
      const {bytesRead} = await file.read(buffer, size, buffer.length - size, size);
      if (!bytesRead) break;
      size += bytesRead;
    }
    bytes = buffer.subarray(0, size);
  } finally { await file.close(); }
  return bytes;
}

export async function handleOffice(request, response, origin, path) {
  const send = (status, value) => {
    response.writeHead(status, {"Content-Type":"application/json", "Cache-Control":"no-store"});
    response.end(JSON.stringify(value));
  };
  if (request.method !== "POST" || request.headers.origin !== origin ||
      request.headers.host !== new URL(origin).host) return send(403, {});
  if (process.platform !== "win32") return send(501, {});
  if (path === "api/office/open") {
    const extension = request.headers["x-office-extension"];
    if (!["docx","xlsx","pptx"].includes(extension) ||
        request.headers["content-type"] !== "application/octet-stream") return send(400, {});
    if (sessions.size >= 24) return send(429, {});
    const id = randomUUID();
    sessions.set(id, null);
    let folder, filename;
    try {
      const chunks = [];
      let size = 0;
      for await (const chunk of request) {
        size += chunk.length;
        if (size > limit) { send(413, {}); break; }
        chunks.push(chunk);
      }
      if (size > limit) { sessions.delete(id); return; }
      const data = Buffer.concat(chunks);
      if (data.subarray(0,4).toString("hex") !== "504b0304") {
        sessions.delete(id);
        return send(400, {});
      }
      folder = await mkdtemp(join(tmpdir(), "llsg-ticket-"));
      filename = join(folder, "Dokument." + extension);
      await writeFile(filename, data, {flag:"wx"});
      const env = {...process.env, LLSG_OFFICE_FILE:filename};
      delete env.LLSG_DEEPL_API_KEY;
      await new Promise((resolve, reject) => {
        const child = spawn("powershell.exe", ["-NoProfile","-NonInteractive","-Command",
          "Start-Process -FilePath $env:LLSG_OFFICE_FILE -ErrorAction Stop"],
          {env, windowsHide:true, stdio:"ignore", timeout:15000});
        child.once("error", reject);
        child.once("exit", code => code === 0 ? resolve() : reject(Error("open")));
      });
      sessions.set(id, {folder, filename, hash:digest(data)});
      return send(200, {id});
    } catch {
      sessions.delete(id);
      if (filename) await unlink(filename).catch(() => {});
      if (folder) await rmdir(folder).catch(() => {});
      if (!response.headersSent) send(500, {});
      return;
    }
  }
  const match = /^api\/office\/(read|release)\/([\da-f-]{36})$/.exec(path);
  const session = match && sessions.get(match[2]);
  if (!session) return send(404, {});
  if (match[1] === "release") {
    try {
      const bytes = await readCopy(session.filename);
      if (bytes.length > limit || digest(bytes) !== request.headers["x-office-hash"]) return send(409, {});
      await unlink(session.filename);
    }
    catch (error) { if (error.code !== "ENOENT") return send(409, {}); }
    sessions.delete(match[2]);
    await rmdir(session.folder).catch(() => {});
    return send(200, {});
  }
  try {
    const bytes = await readCopy(session.filename);
    if (bytes.length > limit) return send(413, {});
    const hash = digest(bytes);
    response.setHeader("X-Office-Hash", hash);
    if (hash === session.hash) return send(204, {});
    if (bytes.subarray(0,4).toString("hex") !== "504b0304") return send(409, {});
    response.writeHead(200, {"Content-Type":"application/octet-stream","Cache-Control":"no-store"});
    response.end(bytes);
  } catch { send(409, {}); }
}

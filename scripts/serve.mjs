import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.resolve(__dirname, "..", ".output", "public");
const PORT = Number(process.env.PORT) || 8080;
const HOST = process.env.HOST || "0.0.0.0";

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".mjs": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".pdf": "application/pdf",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".ttf": "font/ttf",
};

function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return MIME_TYPES[ext] || "application/octet-stream";
}

function sendFile(req, res, filePath, stat) {
  const contentType = getContentType(filePath);
  const totalSize = stat.size;
  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : totalSize - 1;

    if (start >= totalSize || end >= totalSize || start > end) {
      res.writeHead(416, {
        "Content-Range": `bytes */${totalSize}`,
      });
      return res.end();
    }

    const chunksize = end - start + 1;
    const stream = fs.createReadStream(filePath, { start, end });

    res.writeHead(206, {
      "Content-Range": `bytes ${start}-${end}/${totalSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunksize,
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    });

    stream.pipe(res);
  } else {
    res.writeHead(200, {
      "Content-Length": totalSize,
      "Content-Type": contentType,
      "Accept-Ranges": "bytes",
      "Cache-Control": filePath.includes("/assets/")
        ? "public, max-age=31536000, immutable"
        : "public, max-age=3600",
    });
    fs.createReadStream(filePath).pipe(res);
  }
}

let nitroServer;
async function getNitroServer() {
  if (!nitroServer) {
    nitroServer = await import("../.output/server/index.mjs").then((m) => m.default);
  }
  return nitroServer;
}

const server = http.createServer(async (req, res) => {
  try {
    const parsedUrl = new URL(req.url, `http://${req.headers.host || "localhost"}`);
    const decodedPath = decodeURIComponent(parsedUrl.pathname);

    let filePath = path.join(PUBLIC_DIR, decodedPath);

    // Prevent path traversal
    if (!filePath.startsWith(PUBLIC_DIR)) {
      res.writeHead(403);
      return res.end("Forbidden");
    }

    if (decodedPath !== "/" && fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      return sendFile(req, res, filePath, fs.statSync(filePath));
    }

    // SSR rendering via Nitro
    try {
      const handler = await getNitroServer();
      const webReq = new Request(parsedUrl.href, {
        method: req.method,
        headers: req.headers,
      });
      const webRes = await handler.fetch(
        webReq,
        {},
        {
          waitUntil() {},
          passThroughOnException() {},
        },
      );

      const headers = {};
      for (const [key, value] of webRes.headers.entries()) {
        headers[key] = value;
      }

      res.writeHead(webRes.status, headers);
      if (webRes.body) {
        const reader = webRes.body.getReader();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          res.write(value);
        }
      }
      return res.end();
    } catch (ssrErr) {
      console.error("SSR Handler Error:", ssrErr);
    }

    // Fallback to static index.html if available
    const indexPath = path.join(PUBLIC_DIR, "index.html");
    if (fs.existsSync(indexPath) && fs.statSync(indexPath).isFile()) {
      return sendFile(req, res, indexPath, fs.statSync(indexPath));
    }

    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
  } catch (err) {
    console.error("Server Error:", err);
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("Internal Server Error");
  }
});

server.listen(PORT, HOST, () => {
  console.log(
    `🚀 Portfolio server is live at http://${HOST === "0.0.0.0" ? "localhost" : HOST}:${PORT}`,
  );
  console.log(`📁 Serving static content from: ${PUBLIC_DIR}`);
});

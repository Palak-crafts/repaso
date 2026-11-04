// Tiny static server for local checks: node scripts/serve.mjs [port]
import http from "node:http"; import fs from "node:fs"; import path from "node:path";
const port = +process.argv[2] || 4173;
const types = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".woff2": "font/woff2", ".webmanifest": "application/manifest+json" };
http.createServer((req, res) => {
  let p = path.join("dist", decodeURIComponent(req.url.split("?")[0]));
  if (p.endsWith(path.sep) || p === "dist") p = path.join(p, "index.html");
  fs.readFile(p, (err, data) => {
    if (err) { res.writeHead(404); return res.end("Not found"); }
    res.writeHead(200, { "Content-Type": types[path.extname(p)] || "application/octet-stream" });
    res.end(data);
  });
}).listen(port, () => console.log(`http://localhost:${port}`));

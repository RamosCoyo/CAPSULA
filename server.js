/**
 * Servidor estático sin dependencias para el sitio CAPSULABITS.
 * Uso: npm start  (o PORT=3000 npm start)
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const PORT = process.env.PORT || 8080;

const MIME = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.jfif': 'image/jpeg',
    '.pdf': 'application/pdf',
    '.txt': 'text/plain; charset=utf-8',
};

http.createServer((req, res) => {
    try {
        // Solo GET/HEAD y rutas relativas (evita path traversal)
        if (!['GET', 'HEAD'].includes(req.method)) {
            res.writeHead(405).end('Method Not Allowed');
            return;
        }

        let urlPath = decodeURIComponent(req.url.split('?')[0]);
        if (urlPath.endsWith('/')) urlPath += 'index.html';

        const filePath = path.normalize(path.join(ROOT, urlPath));
        if (!filePath.startsWith(ROOT)) {
            res.writeHead(403).end('Forbidden');
            return;
        }

        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end('<h1>404 - No encontrado</h1>');
                return;
            }
            const ext = path.extname(filePath).toLowerCase();
            res.writeHead(200, {
                'Content-Type': MIME[ext] || 'application/octet-stream',
                'Cache-Control': 'no-cache',
            });
            res.end(req.method === 'HEAD' ? undefined : data);
        });
    } catch (e) {
        res.writeHead(500).end('Error interno');
    }
}).listen(PORT, () => {
    console.log(`✓ CAPSULABITS corriendo en http://localhost:${PORT}`);
});

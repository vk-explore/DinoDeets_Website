import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

export default defineConfig({
  base: '/DinoDeets_Website/',
  server: {
    watch: {
      ignored: ['**/src/data/animation-state.json']
    }
  },
  plugins: [
    react(),
    {
      name: 'theatre-state-saver',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          // Helper: Parse JSON Body
          const parseBody = (request) => new Promise((resolve) => {
            let body = '';
            request.on('data', chunk => body += chunk.toString());
            request.on('end', () => resolve(body ? JSON.parse(body) : {}));
          });

          // API: Save Animation & Scene State
          if (req.url.endsWith('/api/save-animation') && req.method === 'POST') {
            parseBody(req).then((state) => {
              try {
                const targetDir = path.resolve(__dirname, 'src/data');
                if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });
                fs.writeFileSync(path.resolve(targetDir, 'animation-state.json'), JSON.stringify(state, null, 2));
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: true }));
              } catch (e) {
                res.statusCode = 500;
                res.end(JSON.stringify({ error: e.message }));
              }
            });
          }
          // API: Get State
          else if (req.url.includes('/api/get-state') && req.method === 'GET') {
            try {
              const filePath = path.resolve(__dirname, 'src/data/animation-state.json');
              let data = '{}';
              if (fs.existsSync(filePath)) {
                data = fs.readFileSync(filePath, 'utf-8');
              }
              res.setHeader('Content-Type', 'application/json');
              res.end(data);
            } catch (e) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: e.message }));
            }
          }
          // API: List Images
          else if (req.url.endsWith('/api/images') && req.method === 'GET') {
            try {
              const baseDir = path.resolve(__dirname, 'public/images');
              const results = [];
              const walk = (dir) => {
                const list = fs.readdirSync(dir);
                list.forEach(file => {
                  const fullPath = path.resolve(dir, file);
                  const stat = fs.statSync(fullPath);
                  if (stat && stat.isDirectory()) {
                    walk(fullPath);
                  } else if (file.match(/\.(png|jpg|jpeg|svg|webp|gif)$/i)) {
                    // Store the path relative to public/ so it can be loaded in the browser easily
                    results.push(fullPath.replace(path.resolve(__dirname, 'public'), ''));
                  }
                });
              };
              if (fs.existsSync(baseDir)) walk(baseDir);
              
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ images: results }));
            } catch (e) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: e.message }));
            }
          }
          // API: Upload Image (Base64)
          else if (req.url.endsWith('/api/upload') && req.method === 'POST') {
            parseBody(req).then((data) => {
              try {
                // Expecting { filename: "my-image.png", base64: "data:image/png;base64,..." } or { ..., image: "..." }
                const rawBase64 = data.base64 || data.image;
                if (!rawBase64) {
                  throw new Error("Missing base64 image data. Provide either 'base64' or 'image' field.");
                }
                const base64Data = rawBase64.replace(/^data:image\/\w+;base64,/, "");
                const buffer = Buffer.from(base64Data, 'base64');
                const targetDir = path.resolve(__dirname, 'public/images/uploads');
                if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });
                
                const filePath = path.resolve(targetDir, data.filename);
                fs.writeFileSync(filePath, buffer);
                
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ 
                  success: true, 
                  url: `/images/uploads/${data.filename}`,
                  path: `/images/uploads/${data.filename}` 
                }));
              } catch (e) {
                res.statusCode = 500;
                res.end(JSON.stringify({ error: e.message }));
              }
            });
          } else {
            next();
          }
        });
      }
    }
  ]
});

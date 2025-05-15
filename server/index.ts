import express from "express";
import cors from 'cors';
import { registerRoutes } from "./routes";
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// CORS config
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// API routes
const server = await registerRoutes(app);

// Serve static files from dist/client
if (process.env.NODE_ENV === 'production') {
  // Đường dẫn tới thư mục dist/client
  const clientPath = path.join(__dirname, '../../dist/client');
  console.log('Serving static files from:', clientPath);
  
  // Serve static files
  app.use(express.static(clientPath));
  
  // Serve index.html for all routes không phải /api
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(clientPath, 'index.html'));
    }
  });
}

const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log('Environment:', process.env.NODE_ENV);
  console.log('Current directory:', __dirname);
});
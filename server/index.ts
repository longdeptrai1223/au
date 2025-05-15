import express from "express";
import cors from 'cors';
import { registerRoutes } from "./routes";
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

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
  try {
    const clientPath = path.resolve(__dirname, '../client');
    console.log('Looking for static files in:', clientPath);
    
    // Kiểm tra xem thư mục tồn tại không
    if (!fs.existsSync(clientPath)) {
      console.error('Client directory not found at:', clientPath);
    }
    
    // Serve static files
    app.use(express.static(clientPath));
    
    // Serve index.html for client-side routing
    app.get('*', (req, res) => {
      if (!req.path.startsWith('/api')) {
        const indexPath = path.join(clientPath, 'index.html');
        console.log('Trying to serve:', indexPath);
        
        if (!fs.existsSync(indexPath)) {
          console.error('index.html not found at:', indexPath);
          return res.status(404).send('index.html not found');
        }
        
        res.sendFile(indexPath);
      }
    });
  } catch (error) {
    console.error('Error setting up static files:', error);
  }
}

const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log('Environment:', process.env.NODE_ENV);
  console.log('Current directory:', __dirname);
});
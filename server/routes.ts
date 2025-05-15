import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { initFirebaseAdmin, auth } from "./firebase-admin";
import { insertMiningActivitySchema, insertAdViewSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  initFirebaseAdmin();

  const verifyToken = async (req: any, res: any, next: any) => {
    if (req.path.endsWith('.png') || req.path.endsWith('.json') || req.path.endsWith('.ico')) {
      return next();
    }

    const token = req.cookies.firebaseToken || req.headers.authorization?.split("Bearer ")[1];
    if (!token) {
      return res.status(401).json({ message: "No authorization token provided" });
    }

    try {
      const decodedToken = await auth.verifyIdToken(token, true);
      req.user = decodedToken;
      next();
    } catch (error) {
      console.error("Error verifying token:", error);
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  };

  app.use('/api', verifyToken);

  app.post('/api/set-token', (req: any, res: any) => {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }

    // Cấu hình cookie cho cả development và production
    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie('firebaseToken', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      maxAge: 3600000, // 1 hour
      path: '/',
      domain: isProduction ? process.env.COOKIE_DOMAIN : 'localhost'
    });
    
    res.json({ success: true });
  });

  const httpServer = createServer(app);
  return httpServer;
}
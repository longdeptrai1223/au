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
    res.cookie('firebaseToken', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });
    res.json({ success: true });
  });

  app.get("/api/user", async (req: any, res: any) => {
    try {
      const firebaseUid = req.user.uid;
      const user = await storage.getUserByFirebaseUid(firebaseUid);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/user", async (req: any, res: any) => {
    try {
      const firebaseUid = req.user.uid;
      const userData = req.body;
      let user = await storage.getUserByFirebaseUid(firebaseUid);
      if (user) {
        user = await storage.updateUser(firebaseUid, userData);
      } else {
        user = await storage.createUser({
          ...userData,
          firebaseUid
        });
      }
      res.json(user);
    } catch (error) {
      console.error("Error creating/updating user:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/mining-activity", async (req: any, res: any) => {
    try {
      const schema = insertMiningActivitySchema.extend({
        userId: z.string().optional(),
      });
      const validatedData = schema.parse(req.body);
      const firebaseUid = req.user.uid;
      validatedData.userId = validatedData.userId || firebaseUid;
      if (!validatedData.userId) {
        throw new Error("userId is required");
      }
      const activity = await storage.createMiningActivity({
        ...validatedData,
        userId: validatedData.userId
      });
      res.json(activity);
    } catch (error) {
      console.error("Error logging mining activity:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/ad-view", async (req: any, res: any) => {
    try {
      const schema = insertAdViewSchema.extend({
        userId: z.string().optional(),
      });
      const validatedData = schema.parse(req.body);
      const firebaseUid = req.user.uid;
      validatedData.userId = validatedData.userId || firebaseUid;
      if (!validatedData.userId) {
        throw new Error("userId is required");
      }
      const adView = await storage.createAdView({
        ...validatedData,
        userId: validatedData.userId
      });
      res.json(adView);
    } catch (error) {
      console.error("Error logging ad view:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/referrals", async (req: any, res: any) => {
    try {
      const firebaseUid = req.user.uid;
      const referrals = await storage.getUserReferrals(firebaseUid);
      res.json(referrals);
    } catch (error) {
      console.error("Error fetching referrals:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
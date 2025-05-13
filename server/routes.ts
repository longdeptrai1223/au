import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { initFirebaseAdmin, auth } from "./firebase-admin";
import { insertMiningActivitySchema, insertAdViewSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize Firebase Admin
  initFirebaseAdmin();

  // Verify Firebase token middleware
  const verifyToken = async (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "No authorization token provided" });
    }

    const token = authHeader.split("Bearer ")[1];
    if (!token) {
      return res.status(401).json({ message: "Invalid token format" });
    }

    try {
      const decodedToken = await auth.verifyIdToken(token);
      req.user = decodedToken;
      next();
    } catch (error) {
      console.error("Error verifying token:", error);
      return res.status(401).json({ message: "Invalid token" });
    }
  };

  // Get user data
  app.get("/api/user", verifyToken, async (req: any, res: any) => {
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

  // Create or update user
  app.post("/api/user", verifyToken, async (req: any, res: any) => {
    try {
      const firebaseUid = req.user.uid;
      const userData = req.body;
      
      let user = await storage.getUserByFirebaseUid(firebaseUid);
      
      if (user) {
        // Update existing user
        user = await storage.updateUser(firebaseUid, userData);
      } else {
        // Create new user
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

  // Log mining activity
  app.post("/api/mining-activity", verifyToken, async (req: any, res: any) => {
    try {
      const schema = insertMiningActivitySchema.extend({
        userId: z.string().optional(),
      });

      const validatedData = schema.parse(req.body);
      const firebaseUid = req.user.uid;
      
      // Always set userId to Firebase UID to ensure it's defined
      validatedData.userId = validatedData.userId || firebaseUid;
      
      // TypeScript validation - ensure userId is defined
      if (!validatedData.userId) {
        throw new Error("userId is required");
      }
      
      // Now TypeScript knows userId is not undefined
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

  // Log ad view
  app.post("/api/ad-view", verifyToken, async (req: any, res: any) => {
    try {
      const schema = insertAdViewSchema.extend({
        userId: z.string().optional(),
      });
      
      const validatedData = schema.parse(req.body);
      const firebaseUid = req.user.uid;
      
      // Always set userId to Firebase UID to ensure it's defined
      validatedData.userId = validatedData.userId || firebaseUid;
      
      // TypeScript validation - ensure userId is defined
      if (!validatedData.userId) {
        throw new Error("userId is required");
      }
      
      // Now TypeScript knows userId is not undefined
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

  // Get referral statistics
  app.get("/api/referrals", verifyToken, async (req: any, res: any) => {
    try {
      const firebaseUid = req.user.uid;
      const referrals = await storage.getUserReferrals(firebaseUid);
      res.json(referrals);
    } catch (error) {
      console.error("Error fetching referrals:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);

  return httpServer;
}

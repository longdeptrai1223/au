import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User table for storing core user information
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  firebaseUid: text("firebase_uid").notNull().unique(),
  username: text("username").notNull().unique(),
  email: text("email").notNull(),
  displayName: text("display_name"),
  photoURL: text("photo_url"),
  balance: integer("balance").notNull().default(0),
  referralCode: text("referral_code").notNull().unique(),
  referredBy: text("referred_by"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Referrals table to track user referrals
export const referrals = pgTable("referrals", {
  id: serial("id").primaryKey(),
  referrerId: text("referrer_id").notNull(),
  referredId: text("referred_id").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Mining activity table for analytics
export const miningActivities = pgTable("mining_activities", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  type: text("type").notNull(), // claim, ad_boost, etc.
  amount: text("amount").notNull(),
  details: text("details"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Ad views for tracking ad interactions
export const adViews = pgTable("ad_views", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  adType: text("ad_type").notNull(),
  boostAmount: integer("boost_amount").notNull(),
  boostDuration: integer("boost_duration").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  firebaseUid: true,
  username: true,
  email: true,
  displayName: true,
  photoURL: true,
  referralCode: true,
  referredBy: true,
});

export const insertReferralSchema = createInsertSchema(referrals);

export const insertMiningActivitySchema = createInsertSchema(miningActivities);

export const insertAdViewSchema = createInsertSchema(adViews);

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertReferral = z.infer<typeof insertReferralSchema>;
export type Referral = typeof referrals.$inferSelect;

export type InsertMiningActivity = z.infer<typeof insertMiningActivitySchema>;
export type MiningActivity = typeof miningActivities.$inferSelect;

export type InsertAdView = z.infer<typeof insertAdViewSchema>;
export type AdView = typeof adViews.$inferSelect;

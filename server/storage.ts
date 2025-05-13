import { 
  users, 
  referrals, 
  miningActivities, 
  adViews, 
  type User, 
  type InsertUser, 
  type Referral,
  type InsertReferral,
  type MiningActivity,
  type InsertMiningActivity,
  type AdView,
  type InsertAdView
} from "@shared/schema";
import { drizzle } from "drizzle-orm/neon-serverless";
import { neon } from "@neondatabase/serverless";

// Define the storage interface
export interface IStorage {
  // User methods
  getUserByFirebaseUid(firebaseUid: string): Promise<User | undefined>;
  getUserById(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(firebaseUid: string, userData: Partial<User>): Promise<User>;
  
  // Referral methods
  createReferral(referral: InsertReferral): Promise<Referral>;
  getUserReferrals(firebaseUid: string): Promise<Referral[]>;
  
  // Mining activity methods
  createMiningActivity(activity: InsertMiningActivity): Promise<MiningActivity>;
  getMiningActivities(userId: string): Promise<MiningActivity[]>;
  
  // Ad view methods
  createAdView(adView: InsertAdView): Promise<AdView>;
  getAdViews(userId: string): Promise<AdView[]>;
}

// Memory storage implementation for development without DB
export class MemStorage implements IStorage {
  private usersMap: Map<string, User>;
  private referralsMap: Map<number, Referral>;
  private activitiesMap: Map<number, MiningActivity>;
  private adViewsMap: Map<number, AdView>;
  private currentIds: {
    users: number;
    referrals: number;
    activities: number;
    adViews: number;
  };

  constructor() {
    this.usersMap = new Map();
    this.referralsMap = new Map();
    this.activitiesMap = new Map();
    this.adViewsMap = new Map();
    this.currentIds = {
      users: 1,
      referrals: 1,
      activities: 1,
      adViews: 1
    };
  }

  // User methods
  async getUserByFirebaseUid(firebaseUid: string): Promise<User | undefined> {
    return Array.from(this.usersMap.values()).find(
      (user) => user.firebaseUid === firebaseUid
    );
  }

  async getUserById(id: number): Promise<User | undefined> {
    return Array.from(this.usersMap.values()).find(
      (user) => user.id === id
    );
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.usersMap.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = this.currentIds.users++;
    const newUser: User = {
      ...user,
      id,
      balance: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.usersMap.set(id.toString(), newUser);
    return newUser;
  }

  async updateUser(firebaseUid: string, userData: Partial<User>): Promise<User> {
    const user = await this.getUserByFirebaseUid(firebaseUid);
    if (!user) {
      throw new Error("User not found");
    }
    
    const updatedUser: User = {
      ...user,
      ...userData,
      updatedAt: new Date(),
    };
    
    this.usersMap.set(user.id.toString(), updatedUser);
    return updatedUser;
  }

  // Referral methods
  async createReferral(referral: InsertReferral): Promise<Referral> {
    const id = this.currentIds.referrals++;
    const newReferral: Referral = {
      ...referral,
      id,
      createdAt: new Date(),
    };
    this.referralsMap.set(id, newReferral);
    return newReferral;
  }

  async getUserReferrals(firebaseUid: string): Promise<Referral[]> {
    return Array.from(this.referralsMap.values()).filter(
      (referral) => referral.referrerId === firebaseUid
    );
  }

  // Mining activity methods
  async createMiningActivity(activity: InsertMiningActivity): Promise<MiningActivity> {
    const id = this.currentIds.activities++;
    const newActivity: MiningActivity = {
      ...activity,
      id,
      createdAt: new Date(),
    };
    this.activitiesMap.set(id, newActivity);
    return newActivity;
  }

  async getMiningActivities(userId: string): Promise<MiningActivity[]> {
    return Array.from(this.activitiesMap.values())
      .filter((activity) => activity.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  // Ad view methods
  async createAdView(adView: InsertAdView): Promise<AdView> {
    const id = this.currentIds.adViews++;
    const newAdView: AdView = {
      ...adView,
      id,
      createdAt: new Date(),
    };
    this.adViewsMap.set(id, newAdView);
    return newAdView;
  }

  async getAdViews(userId: string): Promise<AdView[]> {
    return Array.from(this.adViewsMap.values())
      .filter((adView) => adView.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
}

// PostgreSQL storage implementation for production
export class PostgresStorage implements IStorage {
  private db: any;

  constructor() {
    const sql = neon(process.env.DATABASE_URL!);
    this.db = drizzle(sql);
  }

  // User methods
  async getUserByFirebaseUid(firebaseUid: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where({ firebaseUid }).limit(1);
    return result[0];
  }

  async getUserById(id: number): Promise<User | undefined> {
    const result = await this.db.select().from(users).where({ id }).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where({ username }).limit(1);
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await this.db.insert(users).values(user).returning();
    return result[0];
  }

  async updateUser(firebaseUid: string, userData: Partial<User>): Promise<User> {
    const result = await this.db
      .update(users)
      .set({ ...userData, updatedAt: new Date() })
      .where({ firebaseUid })
      .returning();
    return result[0];
  }

  // Referral methods
  async createReferral(referral: InsertReferral): Promise<Referral> {
    const result = await this.db.insert(referrals).values(referral).returning();
    return result[0];
  }

  async getUserReferrals(firebaseUid: string): Promise<Referral[]> {
    return this.db
      .select()
      .from(referrals)
      .where({ referrerId: firebaseUid })
      .orderBy({ createdAt: 'desc' });
  }

  // Mining activity methods
  async createMiningActivity(activity: InsertMiningActivity): Promise<MiningActivity> {
    const result = await this.db.insert(miningActivities).values(activity).returning();
    return result[0];
  }

  async getMiningActivities(userId: string): Promise<MiningActivity[]> {
    return this.db
      .select()
      .from(miningActivities)
      .where({ userId })
      .orderBy({ createdAt: 'desc' });
  }

  // Ad view methods
  async createAdView(adView: InsertAdView): Promise<AdView> {
    const result = await this.db.insert(adViews).values(adView).returning();
    return result[0];
  }

  async getAdViews(userId: string): Promise<AdView[]> {
    return this.db
      .select()
      .from(adViews)
      .where({ userId })
      .orderBy({ createdAt: 'desc' });
  }
}

// Choose the appropriate storage implementation based on environment
export const storage = process.env.NODE_ENV === 'production' 
  ? new PostgresStorage() 
  : new MemStorage();

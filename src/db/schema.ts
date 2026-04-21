// import { pgTable, text, timestamp, boolean, index } from "drizzle-orm/pg-core";

// export const user = pgTable("user", {
//   id: text("id").primaryKey(),
//   name: text("name").notNull(),
//   email: text("email").notNull().unique(),
//   emailVerified: boolean("email_verified").default(false).notNull(),
//   image: text("image"),
//   createdAt: timestamp("created_at").defaultNow().notNull(),
//   updatedAt: timestamp("updated_at")
//     .defaultNow()
//     .$onUpdate(() => /* @__PURE__ */ new Date())
//     .notNull(),
// });

// export const session = pgTable(
//   "session",
//   {
//     id: text("id").primaryKey(),
//     expiresAt: timestamp("expires_at").notNull(),
//     token: text("token").notNull().unique(),
//     createdAt: timestamp("created_at").defaultNow().notNull(),
//     updatedAt: timestamp("updated_at")
//       .$onUpdate(() => /* @__PURE__ */ new Date())
//       .notNull(),
//     ipAddress: text("ip_address"),
//     userAgent: text("user_agent"),
//     userId: text("user_id")
//       .notNull()
//       .references(() => user.id, { onDelete: "cascade" }),
//   },
//   (table) => [index("session_userId_idx").on(table.userId)],
// );

// export const account = pgTable(
//   "account",
//   {
//     id: text("id").primaryKey(),
//     accountId: text("account_id").notNull(),
//     providerId: text("provider_id").notNull(),
//     userId: text("user_id")
//       .notNull()
//       .references(() => user.id, { onDelete: "cascade" }),
//     accessToken: text("access_token"),
//     refreshToken: text("refresh_token"),
//     idToken: text("id_token"),
//     accessTokenExpiresAt: timestamp("access_token_expires_at"),
//     refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
//     scope: text("scope"),
//     password: text("password"),
//     createdAt: timestamp("created_at").defaultNow().notNull(),
//     updatedAt: timestamp("updated_at")
//       .$onUpdate(() => /* @__PURE__ */ new Date())
//       .notNull(),
//   },
//   (table) => [index("account_userId_idx").on(table.userId)],
// );

// export const verification = pgTable(
//   "verification",
//   {
//     id: text("id").primaryKey(),
//     identifier: text("identifier").notNull(),
//     value: text("value").notNull(),
//     expiresAt: timestamp("expires_at").notNull(),
//     createdAt: timestamp("created_at").defaultNow().notNull(),
//     updatedAt: timestamp("updated_at")
//       .defaultNow()
//       .$onUpdate(() => /* @__PURE__ */ new Date())
//       .notNull(),
//   },
//   (table) => [index("verification_identifier_idx").on(table.identifier)],
// );

import { 
  pgTable, text, timestamp, boolean, index, pgEnum, integer, jsonb 
} from "drizzle-orm/pg-core";

// ==========================================
// 1. BETTER-AUTH CORE TABLES
// ==========================================

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()).notNull(),
});

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date()).notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_userId_idx").on(table.userId)],
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date()).notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()).notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

// ==========================================
// 2. ZEN-AI DOMAIN TABLES
// ==========================================

export const difficultyEnum = pgEnum("difficulty", ["easy", "medium", "hard"]);
export const sessionStatusEnum = pgEnum("session_status", ["in_progress", "completed", "timeout", "aborted"]);

// 2A. The Interview Catalog
export const interviewTemplate = pgTable("interview_template", {
  id: text("id").primaryKey(),
  title: text("title").notNull(), 
  description: text("description").notNull(),
  difficulty: difficultyEnum("difficulty").notNull(),
  isPremium: boolean("is_premium").default(false).notNull(),
  initialCode: text("initial_code"), 
  systemPrompt: text("system_prompt").notNull(), 
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 2B. The Active Session
export const interviewSession = pgTable(
  "interview_session",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    templateId: text("template_id").notNull().references(() => interviewTemplate.id),
    status: sessionStatusEnum("status").default("in_progress").notNull(),
    audioRecordingUrl: text("audio_recording_url"), 
    startedAt: timestamp("started_at").defaultNow().notNull(),
    endedAt: timestamp("ended_at"),
  },
  (table) => [index("session_user_idx").on(table.userId)]
);

// 2C. The Transcript (Text Fallback & State Memory)
export const interviewTranscript = pgTable(
  "interview_transcript",
  {
    id: text("id").primaryKey(),
    sessionId: text("session_id").notNull().references(() => interviewSession.id, { onDelete: "cascade" }),
    role: text("role").notNull(), 
    content: text("content").notNull(), 
    codeSnapshot: text("code_snapshot"), 
    timestamp: timestamp("timestamp").defaultNow().notNull(),
  },
  (table) => [index("transcript_session_idx").on(table.sessionId)]
);

// 2D. The Final Report (Generated Async)
export const interviewReport = pgTable(
  "interview_report",
  {
    id: text("id").primaryKey(),
    sessionId: text("session_id").notNull().references(() => interviewSession.id, { onDelete: "cascade" }).unique(),
    technicalScore: integer("technical_score").notNull(),
    communicationScore: integer("communication_score").notNull(),
    feedbackJson: jsonb("feedback_json").notNull(), 
    finalCode: text("final_code"), 
    emailSent: boolean("email_sent").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  }
);
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const links = sqliteTable("links", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  originalUrl: text("original_url").notNull(),
  shortCode: text("short_code").notNull().unique(),
  createdAt: integer("created_at", {
   mode: "timestamp"
  })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const visits = sqliteTable("visits", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  linkId: integer("link_id")
    .references(() => links. id)
    .notNull(),
  deviceType: text("device_type"),
  browserFamily: text("browser_family"),
  osFamily: text("os_family"),
  country: text("country"), 
  visitedAt: integer("visited_at", {
    mode: "timestamp"
  })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  dailyVisitorHash: text("daily_visitor_hash"),
});

export type Link = typeof links.$inferSelect;
export type NewLink = typeof links.$inferInsert;
export type Visit = typeof visits.$inferSelect;
export type NewVisit = typeof visits.$inferInsert;
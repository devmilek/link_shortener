import { eq, sql, count } from "drizzle-orm";
import { db } from "../db";
import { links, visits } from "../db/schema";
import { generateDailyVisitorHash, parseUserAgent } from "../utils/user-agent";

export interface VisitData {
  linkId: number;
  userAgent: string | null;
  country?:  string | null;
}

export interface LinkStats {
  linkId: number;
  originalUrl: string;
  shortCode: string;
  totalVisits: number;
  uniqueDailyVisitors:  number;
  deviceBreakdown: Record<string, number>;
  browserBreakdown: Record<string, number>;
  osBreakdown: Record<string, number>;
  visitsByDay: { date: string; count: number }[];
}

export class AnalyticsService {
  async recordVisit(data:  VisitData): Promise<void> {
    const deviceInfo = parseUserAgent(data.userAgent);
    const dailyHash = generateDailyVisitorHash(data.userAgent);

    await db. insert(visits).values({
      linkId: data. linkId,
      deviceType: deviceInfo. deviceType,
      browserFamily: deviceInfo.browserFamily,
      osFamily: deviceInfo.osFamily,
      country: data.country,
      dailyVisitorHash: dailyHash,
    });
  }

  async getStats(linkId: number): Promise<LinkStats | null> {
    const [link] = await db
      .select()
      .from(links)
      .where(eq(links.id, linkId))
      .limit(1);

    if (!link) return null;

    const visitsData = await db
      .select()
      .from(visits)
      .where(eq(visits.linkId, linkId));

    const deviceBreakdown:  Record<string, number> = {};
    const browserBreakdown: Record<string, number> = {};
    const osBreakdown: Record<string, number> = {};
    const visitsByDayMap:  Record<string, number> = {};
    const uniqueHashes = new Set<string>();

    for (const visit of visitsData) {
      const device = visit.deviceType || "unknown";
      deviceBreakdown[device] = (deviceBreakdown[device] || 0) + 1;

      const browser = visit.browserFamily || "unknown";
      browserBreakdown[browser] = (browserBreakdown[browser] || 0) + 1;

      const os = visit.osFamily || "unknown";
      osBreakdown[os] = (osBreakdown[os] || 0) + 1;

      const day = visit.visitedAt.toISOString().split("T")[0] || visit.visitedAt.toISOString().split(" ")[0] || "";
      visitsByDayMap[day] = (visitsByDayMap[day] || 0) + 1;

      if (visit.dailyVisitorHash) {
        uniqueHashes.add(visit.dailyVisitorHash);
      }
    }

    const visitsByDay = Object.entries(visitsByDayMap)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b. date));

    return {
      linkId: link.id,
      originalUrl: link.originalUrl,
      shortCode: link.shortCode,
      totalVisits:  visitsData.length,
      uniqueDailyVisitors: uniqueHashes.size,
      deviceBreakdown,
      browserBreakdown,
      osBreakdown,
      visitsByDay,
    };
  }
}

export const analyticsService = new AnalyticsService();
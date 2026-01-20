import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { db } from "../db";
import { links, type Link } from "../db/schema";

const SHORT_CODE_LENGTH = 7;

export class UrlService {
  async createShortUrl(originalUrl: string): Promise<Link | undefined> {
    const shortCode = nanoid(SHORT_CODE_LENGTH);

    const [link] = await db
      .insert(links)
      .values({
        originalUrl,
        shortCode,
      })
      .returning();

    return link;
  }

  async getByShortCode(shortCode: string): Promise<Link | null> {
    const [link] = await db
      .select()
      .from(links)
      .where(eq(links. shortCode, shortCode))
      .limit(1);

    return link || null;
  }

  async getById(id: number): Promise<Link | null> {
    const [link] = await db
      .select()
      .from(links)
      .where(eq(links.id, id))
      .limit(1);

    return link || null;
  }
}

export const urlService = new UrlService();
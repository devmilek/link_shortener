import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { analyticsService } from "../services/analytics.service";
import { urlService } from "../services/url.service";
import { createLinkSchema } from "../utils/validation";

const links = new Hono();

links.post("/", zValidator("json", createLinkSchema), async (c) => {
  const { url } = c.req.valid("json");

  try {
    const link = await urlService.createShortUrl(url);

    if (!link) {
      return c.json({ success: false, error: "Failed to create short URL" }, 500);
    }

    const baseUrl = new URL(c.req.url).origin;

    return c.json(
      {
        success: true,
        data: {
          id: link.id,
          originalUrl:  link.originalUrl,
          shortUrl: `${baseUrl}/${link.shortCode}`,
          shortCode: link.shortCode,
        },
      },
      201
    );
  } catch (error) {
    return c.json(
      {
        success: false,
        error: "Failed to create short URL",
      },
      500
    );
  }
});

links.get("/:id/stats", async (c) => {
  const id = parseInt(c. req.param("id"), 10);

  if (isNaN(id)) {
    return c.json({ success: false, error: "Invalid link ID" }, 400);
  }

  const stats = await analyticsService.getStats(id);

  if (!stats) {
    return c.json({ success: false, error: "Link not found" }, 404);
  }

  return c.json({
    success: true,
    data: stats,
  });
});

export { links };
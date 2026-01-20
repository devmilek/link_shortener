import { Hono } from "hono";
import { urlService } from "../services/url.service";
import { analyticsService } from "../services/analytics.service";

const redirect = new Hono();

redirect.get("/:shortCode", async (c) => {
  const shortCode = c.req.param("shortCode");

  const link = await urlService.getByShortCode(shortCode);

  if (!link) {
    return c.json({ success: false, error:  "Link not found" }, 404);
  }

  const userAgent = c.req.header("User-Agent") || null;
  const country = c.req.header("CF-IPCountry") || null; 

  analyticsService.recordVisit({
    linkId: link.id,
    userAgent,
    country,
  });

  return c.redirect(link.originalUrl, 302);
});

export { redirect };
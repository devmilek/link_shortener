import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { links } from "./routes/links";
import { redirect } from "./routes/redirect";

const app = new Hono();

app.use("*", logger());
app.use("*", cors());

app.get("/", (c) => {
  return c.json({
    name: "URL Shortener API",
    version: process.env.APP_VERSION || "1.0.0",
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
});

app.get("/health", (c) => {
  return c.json({ status: "ok" });
});

app.route("/links", links);

app.route("/", redirect);

app.notFound((c) => {
  return c.json({ success: false, error: "Not found" }, 404);
});

app.onError((err, c) => {
  console.error(err);
  return c. json({ success: false, error: "Internal server error" }, 500);
});

const port = parseInt(process.env.PORT || "3000", 10);

export default {
  port,
  fetch: app.fetch,
};
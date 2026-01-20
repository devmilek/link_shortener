import { describe, expect, it, beforeAll, afterAll } from "bun:test";
import app from "../src/index";

describe("API Endpoints", () => {
  describe("GET /", () => {
    it("should return health status", async () => {
      const res = await app.fetch(new Request("http://localhost/"));
      const data = await res.json() as { status: string, name: string };
      
      expect(res.status).toBe(200);
      expect(data.status).toBe("healthy");
      expect(data.name).toBe("URL Shortener API");
    });
  });

  describe("POST /links", () => {
    it("should create short url for valid url", async () => {
      const res = await app.fetch(
        new Request("http://localhost/links", {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: "https://przykald.com" }),
        })
      );
      const data = await res.json() as { success: boolean, data: { shortCode: string, originalUrl: string } };
      
      expect(res. status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.data.shortCode).toBeDefined();
      expect(data.data. originalUrl).toBe("https://przykald.com");
    });

    it("should reject invalid url", async () => {
      const res = await app.fetch(
        new Request("http://localhost/links", {
          method: "POST",
          headers: { "Content-Type":  "application/json" },
          body:  JSON.stringify({ url: "not-valid" }),
        })
      );
      
      expect(res. status).toBe(400);
    });

    it("should reject localhost url", async () => {
      const res = await app.fetch(
        new Request("http://localhost/links", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: "http://localhost:3000" }),
        })
      );
      
      expect(res.status).toBe(400);
    });
  });

  describe("GET /:shortCode", () => {
    it("should return 404 for non existent code", async () => {
      const res = await app.fetch(
        new Request("http://localhost/nivadihfunvdfvnjadihbn")
      );
      
      expect(res.status).toBe(404);
    });
  });

  describe("GET /links/:id/stats", () => {
    it("should return 404 for non-existent link", async () => {
      const res = await app.fetch(
        new Request("http://localhost/links/99999999/stats")
      );
      const data = await res.json() as { success: boolean };
      
      expect(res.status).toBe(404);
      expect(data.success).toBe(false);
    });

    it("should return 400 for invalid id", async () => {
      const res = await app.fetch(
        new Request("http://localhost/links/blad/stats")
      );
      
      expect(res.status).toBe(400);
    });
  });
});
import { describe, expect, it } from "bun:test";
import { createLinkSchema } from "../src/utils/validation";

describe("url validation", () => {
  describe("valid urls", () => {
    it("should accept valid http url", () => {
      const result = createLinkSchema.safeParse({ url: "http://example.com" });
      expect(result.success).toBe(true);
    });

    it("should accept valid https url", () => {
      const result = createLinkSchema.safeParse({ url: "https://example.com/path? query=1" });
      expect(result.success).toBe(true);
    });

    it("should accept url with port", () => {
      const result = createLinkSchema.safeParse({ url: "https://example.com:8080/path" });
      expect(result.success).toBe(true);
    });
  });

  describe("invalid urls", () => {
    it("should reject invalid url format", () => {
      const result = createLinkSchema.safeParse({ url: "not-a-url" });
      expect(result.success).toBe(false);
    });

    it("should reject localhost", () => {
      const result = createLinkSchema.safeParse({ url: "http://localhost:3000" });
      expect(result.success).toBe(false);
    });

    it("should reject private ip 127.x.x.x", () => {
      const result = createLinkSchema.safeParse({ url: "http://127.0.0.1" });
      expect(result.success).toBe(false);
    });

    it("should reject private ip 192.168.x. x", () => {
      const result = createLinkSchema.safeParse({ url: "http://192.168.1.1" });
      expect(result.success).toBe(false);
    });

    it("should reject private ip 10.x.x.x", () => {
      const result = createLinkSchema.safeParse({ url: "http://10.0.0.1" });
      expect(result.success).toBe(false);
    });

    it("should reject ftp protocol", () => {
      const result = createLinkSchema.safeParse({ url:  "ftp://example.com" });
      expect(result.success).toBe(false);
    });

    it("should reject empty url", () => {
      const result = createLinkSchema.safeParse({ url: "" });
      expect(result.success).toBe(false);
    });
  });
});
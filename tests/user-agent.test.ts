import { describe, expect, it } from "bun:test";
import { generateDailyVisitorHash, parseUserAgent } from "../src/utils/user-agent";

describe("user-agent parser", () => {
  describe("parseUserAgent", () => {
    it("should parse chrome on windows", () => {
      const ua = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0";
      const result = parseUserAgent(ua);
      
      expect(result. deviceType).toBe("desktop");
      expect(result.browserFamily).toBe("Chrome");
      expect(result.osFamily).toBe("Windows");
    });

    it("should parse safari on iphone", () => {
      const ua = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Safari/604.1";
      const result = parseUserAgent(ua);
      
      expect(result.deviceType).toBe("mobile");
      expect(result.browserFamily).toBe("Safari");
      expect(result.osFamily).toBe("iOS");
    });

    it("should handle null user agent", () => {
      const result = parseUserAgent(null);
      
      expect(result. deviceType).toBeNull();
      expect(result.browserFamily).toBeNull();
      expect(result.osFamily).toBeNull();
    });

    it("should not include version numbers", () => {
      const ua = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.6099.130";
      const result = parseUserAgent(ua);
      
      expect(result.browserFamily).not.toContain("120");
      expect(result.osFamily).not.toContain("10. 0");
    });
  });

  describe("generateDailyVisitorHash", () => {
    it("should generate consistent hash for same user agent and date", () => {
      const ua = "Mozilla/5.0 Chrome/120.0.0.0";
      const date = new Date("2024-01-15");
      
      const hash1 = generateDailyVisitorHash(ua, date);
      const hash2 = generateDailyVisitorHash(ua, date);
      
      expect(hash1).toBe(hash2);
    });

    it("should generate different hash for different dates", () => {
      const ua = "Mozilla/5.0 Chrome/120.0.0.0";
      
      const hash1 = generateDailyVisitorHash(ua, new Date("2024-01-15"));
      const hash2 = generateDailyVisitorHash(ua, new Date("2024-01-16"));
      
      expect(hash1).not.toBe(hash2);
    });

    it("should generate hash without storing ip", () => {
      const ua = "Mozilla/5.0 Chrome/120.0.0.0";
      const hash = generateDailyVisitorHash(ua);
      
      expect(hash).not.toContain("192.168");
      expect(hash).not.toContain("10.0");
      expect(hash. length).toBeLessThanOrEqual(32);
    });
  });
});
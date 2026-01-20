import { z } from "zod";

export const createLinkSchema = z.object({
  url: z
    .url("Invalid URL format")
    .refine(
      (url) => {
        try {
          const parsed = new URL(url);
          return ["http:", "https:"].includes(parsed.protocol);
        } catch {
          return false;
        }
      },
      { message: "URL must use HTTP or HTTPS protocol" }
    )
    .refine(
      (url) => {
        const parsed = new URL(url);
        const hostname = parsed.hostname. toLowerCase();
        const privatePatterns = [
          /^localhost$/,
          /^127\./,
          /^10\./,
          /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
          /^192\.168\./,
        ];
        return ! privatePatterns.some((p) => p.test(hostname));
      },
      { message: "Private URLs are not allowed" }
    ),
});

export type CreateLinkInput = z.infer<typeof createLinkSchema>;
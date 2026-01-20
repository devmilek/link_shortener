import {UAParser} from "ua-parser-js";

export interface DeviceInfo {
  deviceType: string | null;
  browserFamily: string | null;
  osFamily: string | null;
}

export function parseUserAgent(
  userAgent: string | null
): DeviceInfo {
  if (!userAgent) {
    return {
      deviceType: null,
      browserFamily: null,
      osFamily: null,
    };
  }

  const parser = new UAParser(userAgent);
  const result = parser.getResult();

  const deviceType = result.device.type || "desktop";
  const normalizedDeviceType = ["mobile", "tablet"].includes(deviceType)
    ? deviceType
    : "desktop";

  const browserFamily = result. browser.name || null;

  const osFamily = result.os.name || null;

  return {
    deviceType:  normalizedDeviceType,
    browserFamily,
    osFamily,
  };
}

export function generateDailyVisitorHash(
  userAgent: string | null,
  date: Date = new Date()
): string {
  const dateStr = date.toISOString().split("T")[0];
  const info = parseUserAgent(userAgent);
  const components = [
    dateStr,
    info.deviceType,
    info.browserFamily,
    info.osFamily,
  ].join("|");

  return Buffer.from(components).toString("base64").substring(0, 32);
}
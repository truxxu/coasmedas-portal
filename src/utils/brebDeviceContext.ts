import type { BrebDeviceContext } from "@/types/api/breb";
import type { User } from "@/src/types";

interface UaInfo {
  trademark: string;
  model: string;
  versionPlatform: string;
}

function parseUaInfo(ua: string): UaInfo {
  if (!ua) {
    return {
      trademark: "unknown",
      model: "unknown",
      versionPlatform: "unknown",
    };
  }

  const browsers: { name: string; regex: RegExp }[] = [
    { name: "Edge", regex: /Edg\/([\d.]+)/ },
    { name: "Chrome", regex: /Chrome\/([\d.]+)/ },
    { name: "Firefox", regex: /Firefox\/([\d.]+)/ },
    { name: "Safari", regex: /Version\/([\d.]+).*Safari/ },
  ];

  let trademark = "unknown";
  let versionPlatform = "unknown";
  for (const { name, regex } of browsers) {
    const match = ua.match(regex);
    if (match) {
      trademark = name;
      versionPlatform = match[1];
      break;
    }
  }

  let model = "unknown";
  if (/Windows NT/.test(ua)) model = "Windows";
  else if (/Mac OS X/.test(ua)) model = "macOS";
  else if (/Linux/.test(ua)) model = "Linux";
  else if (/Android/.test(ua)) model = "Android";
  else if (/iPhone|iPad|iPod/.test(ua)) model = "iOS";

  return { trademark, model, versionPlatform };
}

/**
 * Build the device context payload required by most BRE-B endpoints.
 *
 * `ip` is left empty so the backend resolves it from the request connection;
 * the rest is parsed from `navigator.userAgent` with safe fallbacks.
 */
export function buildBrebDeviceContext(user: User): BrebDeviceContext {
  if (!user.documentType || !user.documentNumber) {
    throw new Error("Sesion no valida");
  }

  const ua = typeof navigator !== "undefined" ? navigator.userAgent : "";
  const { trademark, model, versionPlatform } = parseUaInfo(ua);

  return {
    documentType: user.documentType,
    documentNumber: user.documentNumber,
    user: user.fullName ?? `${user.firstName} ${user.lastName}`.trim(),
    ip: "192.168.0.1",
    userAgentString: ua,
    trademark,
    model,
    platform: "web",
    versionPlatform,
  };
}

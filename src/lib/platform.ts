export type PlatformKind = "windows" | "macos" | "linux" | "other";
export type MacArch = "arm64" | "x64" | "unknown";
export type RecommendedDownload =
  | "windowsNsis"
  | "macArm64"
  | "macX64"
  | "linuxApt"
  | null;

export interface PlatformRecommendation {
  platform: PlatformKind;
  macArch: MacArch;
  recommendedDownload: RecommendedDownload;
}

function detectMacArch(ua: string): MacArch {
  const lower = ua.toLowerCase();

  if (/(apple\s?silicon|arm64|aarch64|m1|m2|m3|m4)/.test(lower)) {
    return "arm64";
  }

  if (/(intel|x86_64|x64|amd64|x86)/.test(lower)) {
    return "x64";
  }

  return "unknown";
}

function unsupportedMobileApplePlatform(
  userAgent: string,
  platform = "",
  maxTouchPoints = 0
) {
  const ua = userAgent.toLowerCase();
  const platformSignal = platform.toLowerCase();

  return (
    ua.includes("ipad") ||
    (ua.includes("macintosh") && ua.includes("mobile")) ||
    (platformSignal.includes("mac") && maxTouchPoints > 1)
  );
}

function unsupportedMobilePlatform(userAgent: string) {
  return /(android|iphone|ipad|ipod|mobile|tablet)/i.test(userAgent);
}

export function detectPlatformFromUserAgent(userAgent: string): PlatformRecommendation {
  const ua = userAgent.toLowerCase();

  if (unsupportedMobileApplePlatform(userAgent) || unsupportedMobilePlatform(userAgent)) {
    return {
      platform: "other",
      macArch: "unknown",
      recommendedDownload: null,
    };
  }

  if (/(windows|win32|win64)/.test(ua)) {
    return {
      platform: "windows",
      macArch: "unknown",
      recommendedDownload: "windowsNsis",
    };
  }

  if (/(macintosh|mac os x|macos)/.test(ua)) {
    const macArch = detectMacArch(ua);
    return {
      platform: "macos",
      macArch,
      recommendedDownload: macArch === "x64" ? "macX64" : "macArm64",
    };
  }

  if (/(linux|x11)/.test(ua)) {
    return {
      platform: "linux",
      macArch: "unknown",
      recommendedDownload: "linuxApt",
    };
  }

  return {
    platform: "other",
    macArch: "unknown",
    recommendedDownload: null,
  };
}

interface NavigatorWithUAData extends Navigator {
  userAgentData?: {
    platform?: string;
    architecture?: string;
  };
}

function recommendationForPlatform(
  platform: PlatformKind,
  archSignals: string
): PlatformRecommendation {
  if (platform === "windows") {
    return {
      platform: "windows",
      macArch: "unknown",
      recommendedDownload: "windowsNsis",
    };
  }

  if (platform === "macos") {
    const macArch = detectMacArch(archSignals);
    return {
      platform: "macos",
      macArch,
      recommendedDownload: macArch === "x64" ? "macX64" : "macArm64",
    };
  }

  if (platform === "linux") {
    return {
      platform: "linux",
      macArch: "unknown",
      recommendedDownload: "linuxApt",
    };
  }

  return {
    platform: "other",
    macArch: "unknown",
    recommendedDownload: null,
  };
}

export function getClientPlatformRecommendation(): PlatformRecommendation {
  if (typeof navigator === "undefined") {
    return {
      platform: "other",
      macArch: "unknown",
      recommendedDownload: null,
    };
  }

  const nav = navigator as NavigatorWithUAData;
  const uaString = navigator.userAgent ?? "";
  const uaDataPlatform = nav.userAgentData?.platform?.toLowerCase() ?? "";
  const uaDataArch = nav.userAgentData?.architecture?.toLowerCase() ?? "";
  const navPlatform = navigator.platform?.toLowerCase() ?? "";
  const maxTouchPoints = navigator.maxTouchPoints ?? 0;

  const archSignals = [uaString, uaDataArch, navPlatform]
    .filter(Boolean)
    .join(" ");

  if (
    unsupportedMobileApplePlatform(uaString, navPlatform, maxTouchPoints) ||
    unsupportedMobilePlatform(uaString)
  ) {
    return recommendationForPlatform("other", archSignals);
  }

  // Prefer explicit client hints/user-agent over navigator.platform fallback.
  if (uaDataPlatform.includes("mac")) {
    return recommendationForPlatform("macos", archSignals);
  }
  if (uaDataPlatform.includes("win")) {
    return recommendationForPlatform("windows", archSignals);
  }
  if (uaDataPlatform.includes("linux")) {
    return recommendationForPlatform("linux", archSignals);
  }

  const uaLower = uaString.toLowerCase();
  if (/(macintosh|mac os x|macos)/.test(uaLower)) {
    return recommendationForPlatform("macos", archSignals);
  }
  if (/(windows|win32|win64)/.test(uaLower)) {
    return recommendationForPlatform("windows", archSignals);
  }
  if (/(linux|x11)/.test(uaLower)) {
    return recommendationForPlatform("linux", archSignals);
  }

  if (/mac/.test(navPlatform)) {
    return recommendationForPlatform("macos", archSignals);
  }
  if (/win/.test(navPlatform)) {
    return recommendationForPlatform("windows", archSignals);
  }
  if (/linux|x11/.test(navPlatform)) {
    return recommendationForPlatform("linux", archSignals);
  }

  return recommendationForPlatform("other", archSignals);
}

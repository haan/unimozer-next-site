import downloadData from "./downloads.json";

export interface DownloadLink {
  label: string;
  url: string;
}

export interface DownloadConfig {
  windowsNsis: DownloadLink;
  windowsMsi: DownloadLink;
  macArm64: DownloadLink;
  macX64: DownloadLink;
  linuxAptKey: DownloadLink;
  linuxAptRelease: DownloadLink;
  fallbackLatest: DownloadLink;
}

export const downloads: DownloadConfig = downloadData;

export interface DownloadLink {
  label: string;
  url: string;
}

export interface DownloadConfig {
  windowsNsis: DownloadLink;
  windowsMsi: DownloadLink;
  macArm64: DownloadLink;
  macX64: DownloadLink;
  fallbackLatest: DownloadLink;
}

export const downloads: DownloadConfig = {
  windowsNsis: {
    label: "Download for Windows",
    url: "https://github.com/haan/UnimozerNext/releases/latest/download/UnimozerNext_latest_x64-setup.exe",
  },
  windowsMsi: {
    label: "Download MSI for Managed Deployment",
    url: "https://github.com/haan/UnimozerNext/releases/latest/download/UnimozerNext_latest_x64-setup.msi",
  },
  macArm64: {
    label: "Download for Apple Silicon",
    url: "https://github.com/haan/UnimozerNext/releases/latest/download/UnimozerNext_latest_arm64.dmg",
  },
  macX64: {
    label: "Download for Intel Mac",
    url: "https://github.com/haan/UnimozerNext/releases/latest/download/UnimozerNext_latest_x64.dmg",
  },
  fallbackLatest: {
    label: "Open Latest Release Page",
    url: "https://github.com/haan/UnimozerNext/releases/latest",
  },
};

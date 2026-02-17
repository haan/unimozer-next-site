export interface MacResource {
  type: "official-guide" | "video" | "article";
  title: string;
  provider: string;
  reason: string;
  url: string;
}

export const macInstallResources: MacResource[] = [
  {
    type: "official-guide",
    title: "Install and uninstall apps from the internet or a disc on Mac",
    provider: "Apple Support",
    reason:
      "Official Apple instructions for opening a DMG and dragging an app into Applications.",
    url: "https://support.apple.com/guide/mac-help/mh35835/mac",
  },
  {
    type: "official-guide",
    title: "Folders that come with your Mac",
    provider: "Apple Support",
    reason:
      "Explains your home folder, which is where ~/Applications lives.",
    url: "https://support.apple.com/guide/mac-help/folders-that-come-with-your-mac-mchlp1143/mac",
  },
  {
    type: "official-guide",
    title: "Safely open apps on your Mac",
    provider: "Apple Support",
    reason:
      "Covers Gatekeeper prompts and what to do if macOS blocks the first launch.",
    url: "https://support.apple.com/en-us/102445",
  },
  {
    type: "video",
    title: "Understanding How To Install Mac Apps Downloaded From Web Sites",
    provider: "MacMost (YouTube)",
    reason:
      "Clear walkthrough of the DMG drag-and-drop flow for apps downloaded from websites.",
    url: "https://www.youtube.com/watch?v=vHdoYbrWQiY",
  },
  {
    type: "article",
    title: "How Many Mac Third-Party App Installs Work",
    provider: "MacMost",
    reason:
      "Written guide that explains the same DMG install flow and common mistakes.",
    url: "https://macmost.com/how-many-mac-third-party-app-installs-work.html",
  },
];

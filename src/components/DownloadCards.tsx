import { useEffect, useMemo, useState } from "react";
import { downloads } from "../data/downloads";
import {
  getClientPlatformRecommendation,
} from "../lib/platform";

type DownloadTab = "windows" | "macos" | "linux";

const linuxAptCommands = `curl -fsSL https://haan.github.io/UnimozerNext/apt/unimozer-next.gpg \\
  | sudo gpg --dearmor -o /usr/share/keyrings/unimozer-next.gpg

echo "deb [arch=amd64 signed-by=/usr/share/keyrings/unimozer-next.gpg] https://haan.github.io/UnimozerNext/apt stable main" \\
  | sudo tee /etc/apt/sources.list.d/unimozer-next.list

sudo apt update
sudo apt install unimozer-next`;

function RecommendationBadge({ visible }: { visible: boolean }) {
  if (!visible) {
    return null;
  }

  return (
    <span className="rounded-full border border-[var(--accent)] bg-[var(--accent-soft)] px-2.5 py-1 text-xs font-semibold text-[var(--accent-strong)]">
      Recommended for your device
    </span>
  );
}

export function DownloadCards() {
  const recommendation = useMemo(() => getClientPlatformRecommendation(), []);
  const [activeTab, setActiveTab] = useState<DownloadTab>(() =>
    recommendation.platform === "macos"
      ? "macos"
      : recommendation.platform === "linux"
        ? "linux"
        : "windows"
  );
  const [pendingScrollTarget, setPendingScrollTarget] = useState<string | null>(
    null
  );
  const [aptCommandsCopied, setAptCommandsCopied] = useState(false);

  useEffect(() => {
    const applyHashTab = () => {
      const hash = window.location.hash.toLowerCase();

      if (hash === "#downloads-macos" || hash === "#downloads-panel-macos") {
        setActiveTab("macos");
        setPendingScrollTarget("downloads-macos");
      } else if (
        hash === "#downloads-linux" ||
        hash === "#downloads-panel-linux"
      ) {
        setActiveTab("linux");
        setPendingScrollTarget("downloads-linux");
      } else if (
        hash === "#downloads-windows" ||
        hash === "#downloads-panel-windows"
      ) {
        setActiveTab("windows");
        setPendingScrollTarget("downloads-windows");
      }
    };

    applyHashTab();
    window.addEventListener("hashchange", applyHashTab);
    return () => {
      window.removeEventListener("hashchange", applyHashTab);
    };
  }, []);

  useEffect(() => {
    if (!pendingScrollTarget) {
      return;
    }

    const animationFrame = window.requestAnimationFrame(() => {
      document.getElementById(pendingScrollTarget)?.scrollIntoView();
      setPendingScrollTarget(null);
    });

    return () => {
      window.cancelAnimationFrame(animationFrame);
    };
  }, [activeTab, pendingScrollTarget]);

  useEffect(() => {
    if (!aptCommandsCopied) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setAptCommandsCopied(false);
    }, 1800);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [aptCommandsCopied]);

  const copyLinuxAptCommands = async () => {
    await navigator.clipboard.writeText(linuxAptCommands);
    setAptCommandsCopied(true);
  };

  return (
    <section
      className="section-wrap"
      id="downloads"
    >
      <p className="section-kicker">Downloads</p>
      <h2 className="section-title mt-2">Choose Your OS</h2>

      <div
        aria-label="Operating system"
        className="mt-6 flex flex-wrap gap-2"
      >
        <button
          aria-controls="downloads-windows"
          aria-pressed={activeTab === "windows"}
          className={
            activeTab === "windows"
              ? "btn-primary"
              : "btn-secondary"
          }
          id="downloads-tab-windows"
          onClick={() => setActiveTab("windows")}
          type="button"
        >
          Windows
        </button>
        <button
          aria-controls="downloads-macos"
          aria-pressed={activeTab === "macos"}
          className={
            activeTab === "macos"
              ? "btn-primary"
              : "btn-secondary"
          }
          id="downloads-tab-macos"
          onClick={() => setActiveTab("macos")}
          type="button"
        >
          macOS
        </button>
        <button
          aria-controls="downloads-linux"
          aria-pressed={activeTab === "linux"}
          className={
            activeTab === "linux"
              ? "btn-primary"
              : "btn-secondary"
          }
          id="downloads-tab-linux"
          onClick={() => setActiveTab("linux")}
          type="button"
        >
          Linux
        </button>
      </div>

      <div
        className="mt-5"
        hidden={activeTab !== "windows"}
        id="downloads-windows"
      >
        <article className="rounded-xl border border-[var(--border-strong)] bg-[var(--bg-card)] p-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h3 className="text-xl font-semibold">Windows download</h3>
            <RecommendationBadge
              visible={recommendation.recommendedDownload === "windowsNsis"}
            />
          </div>
          <p className="text-sm text-[var(--text-secondary)]">
            Best choice for most students and teachers using Windows.
          </p>
          <div className="mt-4">
            <a
              className="btn-primary w-full sm:w-auto"
              href={downloads.windowsNsis.url}
            >
              {downloads.windowsNsis.label}
            </a>
          </div>
          <p className="mt-4 text-sm text-[var(--text-secondary)]">
            School IT teams can find MSI deployment details in the{" "}
            <a
              className="muted-link"
              href="#it-admin"
            >
              IT administrators section
            </a>
            .
          </p>
        </article>
      </div>

      <div
        className="mt-5"
        hidden={activeTab !== "macos"}
        id="downloads-macos"
      >
        <article className="rounded-xl border border-[var(--border-strong)] bg-[var(--bg-card)] p-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h3 className="text-xl font-semibold">macOS download</h3>
            <RecommendationBadge
              visible={
                recommendation.recommendedDownload === "macArm64" ||
                recommendation.recommendedDownload === "macX64"
              }
            />
          </div>
          <p className="text-sm text-[var(--text-secondary)]">
            Choose Apple Silicon for M1, M2, M3, or M4 Macs. Choose Intel for
            older Intel Macs.
          </p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <a
              className="btn-primary w-full sm:w-auto"
              href={downloads.macArm64.url}
            >
              {downloads.macArm64.label}
            </a>
            <a
              className="btn-secondary w-full sm:w-auto"
              href={downloads.macX64.url}
            >
              {downloads.macX64.label}
            </a>
          </div>

          <div className="mt-6 max-w-3xl space-y-4 text-[15px] leading-7 text-[var(--text-secondary)]">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--accent-strong)]">
              Unimozer Next on macOS
            </p>
            <p>
              For Unimozer Next, install location is important: put the app in{" "}
              <code className="inline-path">~/Applications</code> to keep
              auto-update working reliably.
            </p>
            <p>
              After opening the <code>.dmg</code>, open Finder and choose{" "}
              Go &gt; Go to Folder, enter{" "}
              <code className="inline-path">~/Applications</code>, click Go,
              then drag Unimozer Next into that folder.
            </p>
            <p>
              If Unimozer Next is already in{" "}
              <code className="inline-path">/Applications</code>, open{" "}
              <code className="inline-path">/Applications</code> and{" "}
              <code className="inline-path">~/Applications</code> in two Finder
              windows, then hold <code>Command</code> while dragging it to move
              it.
            </p>
            <div className="rounded-lg border border-[var(--border-soft)] bg-[var(--bg-card-strong)] p-4">
              <p className="font-semibold text-[var(--text-primary)]">
                Required for auto-update
              </p>
              <p className="mt-2">
                Unimozer Next auto-updates can only be guaranteed when the app
                runs from <code className="inline-path">~/Applications</code>.
                If it stays in{" "}
                <code className="inline-path">/Applications</code>, macOS
                permission prompts can block or interrupt updates.
              </p>
            </div>
          </div>
        </article>
      </div>

      <div
        className="mt-5"
        hidden={activeTab !== "linux"}
        id="downloads-linux"
      >
        <article className="rounded-xl border border-[var(--border-strong)] bg-[var(--bg-card)] p-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h3 className="text-xl font-semibold">Linux download</h3>
            <RecommendationBadge
              visible={recommendation.recommendedDownload === "linuxApt"}
            />
          </div>
          <p className="text-sm text-[var(--text-secondary)]">
            For Ubuntu, Debian, Linux Mint, and other Debian-based systems, add
            the signed APT repository once and install with apt.
          </p>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <a
              className="btn-primary w-full sm:w-auto"
              href={downloads.linuxAptKey.url}
            >
              {downloads.linuxAptKey.label}
            </a>
            <a
              className="btn-secondary w-full sm:w-auto"
              href={downloads.fallbackLatest.url}
            >
              Manual .deb downloads
            </a>
          </div>

          <div className="mt-6 max-w-3xl space-y-4 text-[15px] leading-7 text-[var(--text-secondary)]">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--accent-strong)]">
              Install with apt
            </p>
            <div className="relative">
              <button
                aria-label={
                  aptCommandsCopied
                    ? "APT install commands copied"
                    : "Copy APT install commands"
                }
                className="absolute right-2 top-2 inline-flex h-9 w-9 items-center justify-center rounded-md border border-[var(--border-soft)] bg-[var(--bg-card)] text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--text-primary)]"
                onClick={() => {
                  void copyLinuxAptCommands();
                }}
                title={
                  aptCommandsCopied
                    ? "Copied"
                    : "Copy APT install commands"
                }
                type="button"
              >
                {aptCommandsCopied ? (
                  <svg
                    aria-hidden="true"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M20 6 9 17l-5-5"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
                  </svg>
                ) : (
                  <svg
                    aria-hidden="true"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <rect
                      height="14"
                      rx="2"
                      stroke="currentColor"
                      strokeWidth="2"
                      width="10"
                      x="8"
                      y="7"
                    />
                    <path
                      d="M6 17H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v1"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
                  </svg>
                )}
              </button>
              <pre className="overflow-x-auto rounded-lg border border-[var(--border-soft)] bg-[var(--bg-card-strong)] p-4 pr-14 text-sm leading-6 text-[var(--text-primary)]"><code>{linuxAptCommands}</code></pre>
            </div>
            <p>
              Future stable releases are installed through{" "}
              <code className="inline-path">sudo apt upgrade</code>.
            </p>
            <p>
              The Linux package is built for 64-bit Intel/AMD PCs. Manual{" "}
              <code>.deb</code> files are also attached to the latest GitHub
              release.
            </p>
          </div>
        </article>
      </div>

    </section>
  );
}

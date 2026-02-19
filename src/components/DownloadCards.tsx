import { useEffect, useMemo, useState } from "react";
import { downloads } from "../data/downloads";
import {
  getClientPlatformRecommendation,
} from "../lib/platform";

type DownloadTab = "windows" | "macos";

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
    recommendation.platform === "macos" ? "macos" : "windows"
  );

  useEffect(() => {
    const applyHashTab = () => {
      const hash = window.location.hash.toLowerCase();

      if (hash === "#downloads-macos" || hash === "#downloads-panel-macos") {
        setActiveTab("macos");
      } else if (
        hash === "#downloads-windows" ||
        hash === "#downloads-panel-windows"
      ) {
        setActiveTab("windows");
      }
    };

    applyHashTab();
    window.addEventListener("hashchange", applyHashTab);
    return () => {
      window.removeEventListener("hashchange", applyHashTab);
    };
  }, []);

  return (
    <section
      className="section-wrap"
      id="downloads"
    >
      <p className="section-kicker">Downloads</p>
      <h2 className="section-title mt-2">Choose Your OS</h2>

      <div
        aria-label="Operating system tabs"
        className="mt-6 flex flex-wrap gap-2"
        role="tablist"
      >
        <button
          aria-controls="downloads-windows"
          aria-selected={activeTab === "windows"}
          className={
            activeTab === "windows"
              ? "btn-primary"
              : "btn-secondary"
          }
          id="downloads-tab-windows"
          onClick={() => setActiveTab("windows")}
          role="tab"
          type="button"
        >
          Windows
        </button>
        <button
          aria-controls="downloads-macos"
          aria-selected={activeTab === "macos"}
          className={
            activeTab === "macos"
              ? "btn-primary"
              : "btn-secondary"
          }
          id="downloads-tab-macos"
          onClick={() => setActiveTab("macos")}
          role="tab"
          type="button"
        >
          macOS
        </button>
      </div>

      <div
        aria-labelledby="downloads-tab-windows"
        className="mt-5"
        hidden={activeTab !== "windows"}
        id="downloads-windows"
        role="tabpanel"
        tabIndex={0}
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
        aria-labelledby="downloads-tab-macos"
        className="mt-5"
        hidden={activeTab !== "macos"}
        id="downloads-macos"
        role="tabpanel"
        tabIndex={0}
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

    </section>
  );
}

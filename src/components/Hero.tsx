import { useMemo } from "react";
import { downloads } from "../data/downloads";
import {
  getClientPlatformRecommendation,
} from "../lib/platform";

const navLinks = [
  { href: "#downloads", label: "Downloads" },
  { href: "#it-admin", label: "IT Admin" },
];

export function Hero() {
  const recommendation = useMemo(() => getClientPlatformRecommendation(), []);

  const heroCta =
    recommendation.platform === "windows"
      ? {
          label: "Download for Windows",
          href: downloads.windowsNsis.url,
        }
      : recommendation.platform === "macos"
        ? {
            label: "Open macOS Downloads",
            href: "#downloads-macos",
          }
        : {
            label: "Open Downloads",
            href: "#downloads",
          };

  return (
    <header className="section-wrap pt-5 sm:pt-8">
      <div className="card overflow-hidden p-6 sm:p-8">
        <div className="flex flex-col gap-4 border-b border-[var(--border-soft)] pb-5 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Unimozer Next
          </h1>
          <nav
            aria-label="Main sections"
            className="flex flex-wrap gap-2"
          >
            {navLinks.map((link) => (
              <a
                className="rounded-md border border-[var(--border-soft)] bg-[var(--bg-card)] px-3 py-1.5 text-sm text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--text-primary)]"
                href={link.href}
                key={link.href}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[var(--accent-soft)] blur-3xl" />
        <div className="relative mt-6 grid gap-8 lg:grid-cols-[1fr_300px] lg:items-center">
          <div className="max-w-2xl space-y-3">
            <p className="text-lg text-[var(--text-primary)] sm:text-xl">
              A modern visual Java learning app built for classrooms.
            </p>
            <p className="max-w-2xl text-base text-[var(--text-secondary)]">
              It combines UML class diagrams, Java source editing, compilation,
              execution, and object interaction in one workflow so students can
              move from design to running code without tool switching.
            </p>
            <p className="max-w-2xl text-base text-[var(--text-secondary)]">
              This modern rewrite keeps the original UML-first teaching
              approach created by{" "}
              <a
                className="underline decoration-[var(--accent)] underline-offset-4 hover:text-[var(--accent-strong)]"
                href="https://unimozer.fisch.lu/"
                rel="noreferrer"
                target="_blank"
              >
                Bob Fisch
              </a>.
            </p>

            <div className="mt-6">
              <a
                className="btn-primary"
                href={heroCta.href}
              >
                {heroCta.label}
              </a>
            </div>
          </div>

          <div className="mx-auto">
            <div className="relative">
              <div className="pointer-events-none absolute inset-0 scale-105 rounded-full bg-[var(--accent-soft)] blur-3xl" />
              <img
                alt="Unimozer Next turtle icon"
                className="relative h-56 w-56 object-contain drop-shadow-[0_14px_26px_rgba(0,0,0,0.45)] sm:h-64 sm:w-64"
                height={256}
                src="/icon.png"
                width={256}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

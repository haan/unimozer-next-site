import { downloads } from "../data/downloads";

export function ItAdminSection() {
  return (
    <section
      className="section-wrap"
      id="it-admin"
    >
      <div className="card border-[#5f5230] bg-[linear-gradient(180deg,rgba(43,36,21,0.62)_0%,rgba(17,14,9,0.9)_100%)]">
        <p className="section-kicker text-[var(--warn)]">Managed Deployment</p>
        <h2 className="section-title mt-2">For IT administrators</h2>
        <p className="section-subtitle">
          The MSI package is intended for school-managed deployment systems
          (for example Intune, SCCM, or Group Policy software deployment).
        </p>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
          <a
            className="btn-primary"
            href={downloads.windowsMsi.url}
          >
            {downloads.windowsMsi.label}
          </a>
          <a
            className="btn-secondary"
            href={downloads.fallbackLatest.url}
          >
            See all download files
          </a>
        </div>

        <ul className="mt-5 list-disc space-y-2 pl-5 text-sm text-[var(--text-secondary)]">
          <li>Use the MSI for standard enterprise software rollout workflows.</li>
          <li>Validate updates on a pilot device group before broad deployment.</li>
          <li>Keep the alias URL in your deployment tooling to target the latest package.</li>
        </ul>

        <div className="mt-5 rounded-lg border border-[var(--border-soft)] bg-[rgba(15,13,10,0.45)] p-4">
          <p className="text-sm font-semibold text-[var(--text-primary)]">
            Silent install example
          </p>
          <pre className="mt-2 overflow-x-auto text-sm text-[var(--text-secondary)]">
            <code>msiexec /i UnimozerNext_latest_x64-setup.msi /qn /norestart</code>
          </pre>
        </div>
      </div>
    </section>
  );
}

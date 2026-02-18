export function Footer() {
  return (
    <footer className="border-t border-[var(--border-soft)] bg-[rgba(5,12,10,0.85)]">
      <div className="section-wrap py-8">
        <div className="flex flex-col gap-3 text-sm text-[var(--text-secondary)] sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-4">
            <img
              alt="Unimozer Next icon"
              className="h-8 w-8 rounded-lg border border-[var(--border-soft)] bg-[#0d171b] p-1"
              height={32}
              src="/icon_runtime.png"
              width={32}
            />
            <a
              className="muted-link"
              href="https://github.com/haan/UnimozerNext"
            >
              Repository
            </a>
          </div>
          <p>Copyright {new Date().getFullYear()} Laurent Haan</p>
        </div>
      </div>
    </footer>
  );
}

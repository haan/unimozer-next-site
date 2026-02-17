const requiredLinks = [
  {
    name: "Windows NSIS",
    url: "https://github.com/haan/UnimozerNext/releases/latest/download/UnimozerNext_latest_x64-setup.exe",
  },
  {
    name: "Windows MSI",
    url: "https://github.com/haan/UnimozerNext/releases/latest/download/UnimozerNext_latest_x64-setup.msi",
  },
  {
    name: "macOS Intel x64",
    url: "https://github.com/haan/UnimozerNext/releases/latest/download/UnimozerNext_latest_x64.dmg",
  },
  {
    name: "macOS Apple Silicon arm64",
    url: "https://github.com/haan/UnimozerNext/releases/latest/download/UnimozerNext_latest_arm64.dmg",
  },
  {
    name: "Latest release fallback",
    url: "https://github.com/haan/UnimozerNext/releases/latest",
  },
];

const timeoutMs = 20000;

async function fetchWithTimeout(url, options) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal,
      redirect: "follow",
    });
  } finally {
    clearTimeout(timeoutId);
  }
}

async function checkUrl(target) {
  let headResponse;
  try {
    headResponse = await fetchWithTimeout(target.url, { method: "HEAD" });
    if (headResponse.ok) {
      return {
        ...target,
        ok: true,
        method: "HEAD",
        status: headResponse.status,
        finalUrl: headResponse.url,
      };
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`HEAD failed for ${target.name}: ${message}`);
  }

  try {
    const getResponse = await fetchWithTimeout(target.url, { method: "GET" });
    if (getResponse.ok) {
      return {
        ...target,
        ok: true,
        method: "GET",
        status: getResponse.status,
        finalUrl: getResponse.url,
      };
    }

    return {
      ...target,
      ok: false,
      method: "GET",
      status: getResponse.status,
      finalUrl: getResponse.url,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      ...target,
      ok: false,
      method: "GET",
      status: 0,
      finalUrl: target.url,
      error: message,
    };
  }
}

async function main() {
  console.log(`Checking ${requiredLinks.length} required URLs...`);

  const results = await Promise.all(requiredLinks.map((target) => checkUrl(target)));
  const failed = results.filter((result) => !result.ok);

  for (const result of results) {
    if (result.ok) {
      console.log(
        `[OK] ${result.name} (${result.method} ${result.status}) -> ${result.finalUrl}`
      );
      continue;
    }

    const reason = result.error ? ` error="${result.error}"` : "";
    console.error(
      `[FAIL] ${result.name} (${result.method} ${result.status}) -> ${result.finalUrl}${reason}`
    );
  }

  if (failed.length > 0) {
    console.error(`Link check failed: ${failed.length} URL(s) unreachable.`);
    process.exit(1);
  }

  console.log("All required links are reachable.");
}

main().catch((error) => {
  const message = error instanceof Error ? error.stack ?? error.message : String(error);
  console.error("Unexpected error during link check:", message);
  process.exit(1);
});

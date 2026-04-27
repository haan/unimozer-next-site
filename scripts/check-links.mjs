import { readFile } from "node:fs/promises";

const downloadsConfigUrl = new URL("../src/data/downloads.json", import.meta.url);

const timeoutMs = 20000;

function isDownloadAsset(url) {
  return new URL(url).pathname.includes("/releases/latest/download/");
}

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

async function checkWithGetFallback(target) {
  const downloadAsset = isDownloadAsset(target.url);
  const getResponse = await fetchWithTimeout(target.url, {
    method: "GET",
    headers: downloadAsset ? { Range: "bytes=0-0" } : undefined,
  });

  await getResponse.body?.cancel();

  const ok = downloadAsset
    ? getResponse.ok || getResponse.status === 206
    : getResponse.ok;

  return {
    ...target,
    ok,
    method: downloadAsset ? "GET range 0-0" : "GET",
    status: getResponse.status,
    finalUrl: getResponse.url,
  };
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
    return await checkWithGetFallback(target);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      ...target,
      ok: false,
      method: isDownloadAsset(target.url) ? "GET range 0-0" : "GET",
      status: 0,
      finalUrl: target.url,
      error: message,
    };
  }
}

async function loadRequiredLinks() {
  const configText = await readFile(downloadsConfigUrl, "utf8");
  const downloads = JSON.parse(configText);

  return Object.entries(downloads).map(([key, download]) => ({
    name: `${download.label} (${key})`,
    url: download.url,
  }));
}

async function main() {
  const requiredLinks = await loadRequiredLinks();

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

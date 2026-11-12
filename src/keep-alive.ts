const checks = [
  {
    name: "POS Frontend",
    url: "https://pos.payassure.co.ke/health",
  },
  {
    name: "PayAssure API",
    url: "https://api.payassure.co.ke/payassure/health",
  },
];

const requestTimeoutMs = 15_000;
const retryDelayMs = 10_000;

async function checkService(name: string, url: string): Promise<void> {
  while (true) {
    const startedAt = performance.now();

    try {
      const response = await fetch(url, {
        method: "GET",
        signal: AbortSignal.timeout(requestTimeoutMs),
      });
      const elapsedMs = Math.round(performance.now() - startedAt);

      if (response.ok) {
        console.log(
          `[${new Date().toISOString()}] ${name} succeeded — HTTP ${response.status} — ${elapsedMs} ms`,
        );
        await response.body?.cancel();
        return;
      }

      console.error(
        `[${new Date().toISOString()}] ${name} failed — HTTP ${response.status} — ${elapsedMs} ms`,
      );
      await response.body?.cancel();
    } catch (error) {
      const elapsedMs = Math.round(performance.now() - startedAt);
      const reason = error instanceof Error ? error.message : String(error);

      console.error(
        `[${new Date().toISOString()}] ${name} failed — ${elapsedMs} ms — ${reason}`,
      );
    }

    await new Promise((resolve) => setTimeout(resolve, retryDelayMs));
  }
}

async function runChecks(): Promise<void> {
  console.log(`[${new Date().toISOString()}] Starting scheduled health checks`);
  await Promise.all(checks.map(({ name, url }) => checkService(name, url)));
}

void runChecks();
setInterval(() => {
  void runChecks();
}, 10 * 60 * 1000);

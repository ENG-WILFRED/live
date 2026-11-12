export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 20;

const requestTimeoutMs = 15_000;
const noStoreHeaders = { "Cache-Control": "no-store" };

const services = [
  {
    name: "POS Frontend",
    url: "https://pos.payassure.co.ke/health",
  },
  {
    name: "PayAssure API",
    url: "https://api.payassure.co.ke/payassure/health",
  },
] as const;

type CheckResult = {
  service: (typeof services)[number]["name"];
  healthy: boolean;
  statusCode: number | null;
  responseTimeMs: number;
  error?: string;
};

function describeError(error: unknown) {
  if (!(error instanceof Error)) {
    return String(error);
  }

  const cause =
    error.cause instanceof Error
      ? `; cause: ${error.cause.name}: ${error.cause.message}`
      : "";
  return `${error.name}: ${error.message}${cause}`;
}

async function checkService(
  service: (typeof services)[number],
  timestamp: string,
): Promise<CheckResult> {
  const startedAt = performance.now();

  try {
    const response = await fetch(service.url, {
      method: "GET",
      cache: "no-store",
      signal: AbortSignal.timeout(requestTimeoutMs),
    });
    const responseTimeMs = Math.round(performance.now() - startedAt);
    const healthy = response.status >= 200 && response.status < 300;

    console.log(
      `[${timestamp}] ${service.name} ${healthy ? "HEALTHY" : "UNHEALTHY"} | ${service.url} | HTTP ${response.status} | ${responseTimeMs}ms`,
    );
    try {
      await response.body?.cancel();
    } catch (error) {
      console.warn(
        `[${timestamp}] ${service.name} response body cleanup failed | ${describeError(error)}`,
      );
    }

    return {
      service: service.name,
      healthy,
      statusCode: response.status,
      responseTimeMs,
      ...(!healthy && { error: `HTTP ${response.status}` }),
    };
  } catch (error) {
    const responseTimeMs = Math.round(performance.now() - startedAt);
    const errorDetails = describeError(error);

    console.error(
      `[${timestamp}] ${service.name} FAILED | ${service.url} | no HTTP status | ${responseTimeMs}ms | ${errorDetails}`,
    );

    return {
      service: service.name,
      healthy: false,
      statusCode: null,
      responseTimeMs,
      error: errorDetails,
    };
  }
}

export async function GET() {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] Starting monitoring execution`);

  const results = await Promise.all(
    services.map((service) => checkService(service, timestamp)),
  );
  const success = results.every((result) => result.healthy);

  return Response.json(
    { success, timestamp, results },
    { status: success ? 200 : 502, headers: noStoreHeaders },
  );
}

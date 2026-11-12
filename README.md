# PayAssure Service Monitor

A minimal Next.js application that sends concurrent HTTP GET requests to the
POS Frontend and PayAssure API health endpoints. Each request has its own
15-second timeout. The public endpoint is invoked by an external scheduler;
the application does not run a background worker or require environment
variables.

## Deploy on Render

1. Create a new **Blueprint Instance** in Render and select this repository.
   The included `render.yaml` deploys a free Render web service.
2. Deploy the service and copy its public URL, such as
   `https://service-keep-alive.onrender.com`.

The service is a web service, not a Render Cron Job. Render Cron Jobs require a
paid plan; an external scheduler lets the monitor run on Render's free web
service plan.

## Configure a 10-minute schedule

Create a job with [cron-job.org](https://cron-job.org/) or another external
scheduler:

- **URL:** `https://<your-render-service>.onrender.com/api/keep-alive`
- **Method:** `GET`
- **Schedule:** every 10 minutes (`*/10 * * * *`)

No application environment variables or authentication headers are required.
The endpoint is public, so anyone who knows its URL can trigger both health
checks. Calls received while a check is already running are rejected with HTTP
409.

Render's free web services can spin down after inactivity. The external
10-minute schedule keeps sending requests to the monitor; after a long pause or
the initial deployment, the first request may take longer while the service
starts.

Vercel Hobby's managed Cron Jobs do not support a 10-minute schedule. This
endpoint can still be deployed there and invoked by an external scheduler, as
long as the selected deployment's function execution limit allows at least 15
seconds.

## Test manually

Replace the URL with your deployed service URL, then run:

```sh
curl -i "https://<your-render-service>.onrender.com/api/keep-alive"
```

The endpoint returns both check results as JSON. HTTP 200 means both services
are healthy; HTTP 502 means the checks completed but at least one service was
unhealthy.

## Confirm checks and view logs

- Check cron-job.org's execution history to confirm the job ran every 10
  minutes and inspect its HTTP response.
- In Render, open the service's **Logs** to see a timestamped line for each
  service check, including its status code, response time, and any request
  error.
- To independently confirm requests reached a target, inspect that target
  service's access logs if available.

The overlap safeguard is process-local and prevents simultaneous runs on the
same application instance; it does not coordinate multiple server instances.

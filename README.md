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
paid plan, so this repository uses GitHub Actions to invoke the public endpoint
on a schedule instead.

## Automatic 10-minute schedule

The workflow at `.github/workflows/keep-alive.yml` sends a GET request to
`https://service-keep-alive.onrender.com/api/keep-alive` at minutes 3, 13, 23,
33, 43, and 53 of each hour (UTC). This is an exact 10-minute cron interval,
offset from the start of the hour to reduce scheduler congestion. It runs
independently of the Next.js application and requires no credentials or
environment variables.

This repository is public, so GitHub-hosted runner usage for this workflow is
free. Scheduled workflows run from the repository's default branch; the
workflow must be present on that branch. If the Render service's public
hostname changes, update the URL in the workflow. GitHub Actions is a
best-effort scheduler: runs may start late during periods of high load, so it
does not guarantee execution at the exact second or minute. Use an external
scheduler such as [cron-job.org](https://cron-job.org/) if tighter scheduling
is needed.

Render's free web services can spin down after inactivity. The scheduled
requests keep sending traffic to the monitor; after the initial deployment or
a prolonged pause, the first request may take longer while the service starts.

The monitor endpoint stays public and can also be called by another external
scheduler. No Render or Vercel-managed cron feature is assumed.

## Test manually

Run the same request the scheduled workflow sends:

```sh
curl -i "https://service-keep-alive.onrender.com/api/keep-alive"
```

The endpoint returns both check results as JSON. HTTP 200 means both services
are healthy; HTTP 502 means the checks completed but at least one service was
unhealthy.

## Confirm checks and view logs

- In GitHub, open the repository's **Actions** tab and select **PayAssure
  keep-alive** to view scheduled runs and their HTTP response output. Use
  **Run workflow** to trigger a manual run.
- In Render, open the service's **Logs** to see a timestamped line for each
  service check, including its status code, response time, and any request
  error.
- To independently confirm requests reached a target, inspect that target
  service's access logs if available.

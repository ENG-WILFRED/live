# Service Keep-Alive

A minimal Next.js application and scheduled worker that sends concurrent HTTP
GET requests to the PayAssure health endpoints every 10 minutes. Each request
has an independent 15-second timeout and retries every 10 seconds after a
network error, timeout, or unsuccessful HTTP status until it succeeds. Results,
HTTP status codes, elapsed time, and execution timestamps are written to the
console.

## Run locally

```sh
npm install
npm run keep-alive
```

## Deploy on Render

Deploy this repository as a Blueprint using `render.yaml`. It creates a Render
Cron Job scheduled every 10 minutes. The worker checks both services
concurrently and keeps retrying each failed check independently until it
succeeds. Render Cron Jobs require a paid instance plan.
# live

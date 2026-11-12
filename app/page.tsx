export default function Home() {
  return (
    <main className="page">
      <section className="monitor-card" aria-labelledby="page-title">
        <p className="eyebrow">PAYASSURE OPERATIONS</p>
        <h1 id="page-title">PayAssure Service Monitor</h1>
        <p className="description">
          A lightweight keep-alive monitor that checks both services every 10
          minutes to help reduce cold starts.
        </p>

        <div className="service-list">
          <div className="service">
            <span className="service-name">POS Frontend</span>
            <a href="https://pos.payassure.co.ke/health">
              https://pos.payassure.co.ke/health
            </a>
          </div>
          <div className="service">
            <span className="service-name">PayAssure API</span>
            <a href="https://api.payassure.co.ke/payassure/health">
              https://api.payassure.co.ke/payassure/health
            </a>
          </div>
        </div>

        <p className="interval">
          <span className="status-dot" aria-hidden="true" />
          Monitoring interval: <strong>10 minutes</strong>
        </p>
      </section>
    </main>
  );
}

export default function MetricCard({ icon, label, value, accent = "teal" }) {
  return (
    <article className={`metric-card accent-${accent}`}>
      <div className="metric-icon">{icon}</div>
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

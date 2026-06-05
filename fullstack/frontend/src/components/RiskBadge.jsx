export default function RiskBadge({ level = "Unknown" }) {
  const normalized = String(level).toLowerCase();
  return <span className={`risk-badge risk-${normalized}`}>{level}</span>;
}

export default function StatusBadge({ status = "unknown" }) {
  return <span className={`status-badge status-${status}`}>{status.replace("_", " ")}</span>;
}

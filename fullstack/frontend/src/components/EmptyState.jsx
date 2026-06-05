export default function EmptyState({ icon, title, description, actionLabel, onAction }) {
  return (
    <div className="empty-state">
      <div>{icon}</div>
      <strong>{title}</strong>
      <p>{description}</p>
      {actionLabel ? <button type="button" onClick={onAction}>{actionLabel}</button> : null}
    </div>
  );
}

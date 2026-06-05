export default function RecordCard({ record }) {
  return (
    <article className="record-card">
      <time>{record.date}</time>
      <div>
        <strong>{record.title}</strong>
        <span>{record.facilityName}</span>
        <p>{record.note}</p>
      </div>
    </article>
  );
}

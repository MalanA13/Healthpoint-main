import RiskBadge from "./RiskBadge.jsx";
import StatusBadge from "./StatusBadge.jsx";

function healthSummary(appointment) {
  const conditions = [];
  if (appointment.hypertension) conditions.push("Hipertensi");
  if (appointment.diabetes) conditions.push("Diabetes");
  if (appointment.alcoholism) conditions.push("Alkoholisme");
  if (Number(appointment.handicap || 0) > 0) conditions.push(`Disabilitas L${appointment.handicap}`);
  return conditions.length ? conditions.join(", ") : "Tidak ada kondisi khusus";
}

export default function AppointmentCard({ appointment, doctor, facility, compact = false, onCancel, onDelete }) {
  return (
    <article className={`appointment-card risk-line-${String(appointment.riskLevel || "unknown").toLowerCase()}`}>
      <div>
        <strong>{appointment.patientName}</strong>
        <span>{doctor?.name || "Dokter belum dipilih"} | {facility?.name || appointment.neighbourhood}</span>
        <small>{new Date(appointment.appointmentDay).toLocaleString("id-ID")} | {healthSummary(appointment)}</small>
      </div>
      <div className="appointment-meta">
        <RiskBadge level={appointment.riskLevel || "Unknown"} />
        <StatusBadge status={appointment.status} />
        {!compact && appointment.status === "scheduled" ? (
          <div className="inline-actions">
            <button className="warning-button" type="button" onClick={() => onCancel?.(appointment.id)}>
              Cancel
            </button>
            <button className="danger-button" type="button" onClick={() => onDelete?.(appointment.id)}>
              Delete
            </button>
          </div>
        ) : null}
      </div>
    </article>
  );
}

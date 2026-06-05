import { MapPin } from "lucide-react";

export default function FacilityCard({ facility, doctorCount, expanded, onToggle, doctors = [] }) {
  return (
    <article className="facility-card" onClick={onToggle}>
      <div className="facility-top">
        <div>
          <strong>{facility.name}</strong>
          <span>{facility.type} | {facility.city}</span>
        </div>
        <span className="type-badge">{facility.type}</span>
      </div>
      <div className="facility-meta">
        <span><MapPin size={14} /> {facility.distanceKm} km</span>
        <span>{doctorCount} dokter</span>
      </div>
      <div className="tag-list">
        {(facility.services || []).map((service) => <small key={service}>{service}</small>)}
      </div>
      {expanded ? (
        <div className="facility-doctors">
          {doctors.map((doctor) => (
            <span key={doctor.id}>{doctor.name} - {doctor.specialization}</span>
          ))}
        </div>
      ) : null}
    </article>
  );
}

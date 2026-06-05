import { UserRound } from "lucide-react";

export default function DoctorCard({ doctor, facility }) {
  return (
    <article className="doctor-card">
      <div className="avatar">
        <UserRound size={22} />
      </div>
      <div>
        <strong>{doctor.name}</strong>
        <span>{doctor.specialization}</span>
        <small>{facility?.name || "Fasilitas belum dipilih"}</small>
      </div>
    </article>
  );
}

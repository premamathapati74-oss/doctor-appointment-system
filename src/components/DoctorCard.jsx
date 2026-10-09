import { useLang } from "../context/LanguageContext";

// "Dr. Anil Kulkarni (Demo)" => "AK"
const initials = (n) =>
  n.replace("Dr. ", "").replace(/\(.*?\)/g, "").trim().split(" ").map((w) => w[0]).join("").slice(0, 2);

export default function DoctorCard({ doctor, hospitalName, onBook }) {
  const { t, ts } = useLang();
  return (
    <div className="dcard">
      {doctor.photo ? <img src={doctor.photo} alt={doctor.name} /> : <div className="av">{initials(doctor.name)}</div>}
      <h3>{doctor.name}</h3>
      <p>{doctor.qualification}</p>
      <p className="muted">{ts(doctor.specialty)} · {doctor.experience} {t("years")}</p>
      {hospitalName && <p className="muted">🏥 {hospitalName}</p>}
      <span className={doctor.available ? "badge ok" : "badge no"}>● {doctor.available ? t("available") : t("unavailable")}</span>
      <button className="btn" disabled={!doctor.available} onClick={() => onBook(doctor)}>{t("bookAppt")}</button>
    </div>
  );
}
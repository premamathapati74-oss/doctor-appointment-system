import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import { useLang } from "../context/LanguageContext";
import DoctorCard from "../components/DoctorCard";
import "../styles/home.css";

// /doctors, /doctors?hospital=h1, ?speciality=Cardiology, ?q=naam  (aur /book bhi yahi page hai)
export default function Doctors() {
  const [params] = useSearchParams();
  const { user } = useAuth();
  const { t, ts } = useLang();
  const navigate = useNavigate();
  const { hospitals, doctors, loading, error } = useData();

  const hid = params.get("hospital") || "";
  const sp = params.get("speciality") || "";
  const q = (params.get("q") || "").toLowerCase();
  const hospital = hospitals.find((h) => h.id === hid);

  const shown = doctors.filter((d) =>
    (!hid || d.hospitalId === hid) && (!sp || d.specialty === sp) &&
    (!q || `${d.name} ${d.specialty} ${d.qualification}`.toLowerCase().includes(q))
  );

  return (
    <section className="wrap sec">
      <h2>{t("findDoctor")}{hospital ? ` – ${hospital.name}` : ""}{sp ? ` – ${ts(sp)}` : ""}{q ? ` – "${params.get("q")}"` : ""}</h2>
      {loading && <p className="muted">{t("loading")}</p>}
      {error && <p className="err">{error}</p>}
      <div className="grid">
        {shown.map((d) => (
          <DoctorCard key={d.id} doctor={d} hospitalName={hospitals.find((h) => h.id === d.hospitalId)?.name}
            onBook={(x) => navigate(user ? `/book/${x.id}` : "/login")} />
        ))}
      </div>
      {!loading && !shown.length && <p className="muted">{t("noDoctor")}</p>}
    </section>
  );
}

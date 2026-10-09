import { useNavigate } from "react-router-dom";
import { useData } from "../context/DataContext";
import { useLang } from "../context/LanguageContext";
import "../styles/home.css";

export default function Hospitals() {
    const { hospitals, doctors, loading, error } = useData();
    const { t } = useLang();
    const navigate = useNavigate();

    return (
        <section className="wrap sec">
            <h2>{t("ourHospitals")}</h2>
            {loading && <p className="muted">{t("loading")}</p>}
            {error && <p className="err">{error}</p>}
            {!loading && !error && !hospitals.length && <p className="muted">{t("noHospital")}</p>}
            <div className="grid">
                {hospitals.map((h) => (
                    <button key={h.id} className="hcard" onClick={() => navigate(`/doctors?hospital=${h.id}`)}>
                        <h3>🏥 {h.name}</h3>
                        <p className="muted">📍 {h.address || h.city}</p>
                        <p className="muted">{doctors.filter((d) => d.hospitalId === h.id).length} {t("doctorsCount")}</p>
                    </button>
                ))}
            </div>
        </section>
    );
}

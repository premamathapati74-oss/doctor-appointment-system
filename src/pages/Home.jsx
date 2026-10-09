import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import { useLang } from "../context/LanguageContext";
import BookingCard from "../components/BookingCard";
import DoctorCard from "../components/DoctorCard";
import "../styles/home.css";

const today = () => new Date().toISOString().slice(0, 10);

export default function Home() {
  const { user } = useAuth();
  const { t } = useLang();
  const navigate = useNavigate();
  const { hospitals, doctors, loading, error } = useData();
  const [sel, setSel] = useState({ hid: "", sp: "", did: "", date: today() });

  const hospName = (id) => hospitals.find((h) => h.id === id)?.name;
  const shown = doctors.filter((d) => (!sel.hid || d.hospitalId === sel.hid) && (!sel.sp || d.specialty === sel.sp) && (!sel.did || d.id === sel.did));
  const book = (id, date = sel.date) => navigate(user ? `/book/${id}?date=${date}` : "/login");

  return (
    <>
      <section className="hero">
        <div className="wrap hero-in">
          <div>
            <h1>{t("heroTitle")}</h1>
            <ul><li>✓ {t("hero1")}</li><li>✓ {t("hero2")}</li><li>✓ {t("hero3")}</li></ul>
          </div>
          <BookingCard hospitals={hospitals} doctors={doctors} sel={sel} setSel={setSel} onSubmit={() => book(sel.did)} />
        </div>
      </section>

      <section className="wrap sec">
        <h2>{t("ourHospitals")}</h2>
        {loading && <p className="muted">{t("loading")}</p>}
        {error && <p className="err">{error}</p>}
        {!loading && !error && !hospitals.length && <p className="muted">{t("noHospital")} <Link to="/seed">{t("addDemo")}</Link></p>}
        <div className="grid">
          {hospitals.map((h) => (
            <button key={h.id} className={"hcard" + (sel.hid === h.id ? " on" : "")}
              onClick={() => setSel({ ...sel, hid: sel.hid === h.id ? "" : h.id, sp: "", did: "" })}>
              <h3>🏥 {h.name}</h3>
              <p className="muted">📍 {h.address || h.city}</p>
              <p className="muted">{doctors.filter((d) => d.hospitalId === h.id).length} {t("doctorsCount")}</p>
            </button>
          ))}
        </div>
      </section>

      <section className="wrap sec">
        <h2>{t("doctorsH")} <span className="badge ok">● {t("live")} · {shown.length}</span></h2>
        <div className="grid">
          {shown.map((d) => <DoctorCard key={d.id} doctor={d} hospitalName={hospName(d.hospitalId)} onBook={(x) => book(x.id)} />)}
        </div>
        {!loading && !shown.length && hospitals.length > 0 && <p className="muted">{t("noDoctor")}</p>}
      </section>
    </>
  );
}

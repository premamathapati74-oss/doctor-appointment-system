import { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { findPatientByPhone, addReport } from "../firebase/services";

// Real file upload ke liye Firebase Storage chahiye (Blaze/paid plan).
// Isliye abhi report ek LINK ke roop me jodi jaati hai (Google Drive/WhatsApp waala link).
// Patient ke Reports page par ye turant (real-time) dikh jaati hai, kyunki wahan onSnapshot lага hai.
export default function AdminReports() {
  const { user, isAdmin, loading } = useAuth();
  const [phone, setPhone] = useState("");
  const [patient, setPatient] = useState(null);
  const [f, setF] = useState({ title: "", date: "", url: "" });
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  if (loading) return <section className="wrap sec"><p className="muted">Loading...</p></section>;
  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin) return <section className="wrap sec"><p>Sirf admin ke liye. <Link to="/admin">Admin panel</Link></p></section>;

  const search = async () => {
    setMsg(""); setPatient(null); setBusy(true);
    try {
      const p = await findPatientByPhone(phone);
      p ? setPatient(p) : setMsg("❌ Ye number kisi patient ka nahi mila.");
    } catch (e) { console.error(e); setMsg("❌ Search nahi hui. Rules check karo."); }
    setBusy(false);
  };

  const submit = async () => {
    setBusy(true); setMsg("");
    try {
      await addReport(patient.id, { title: f.title.trim(), date: f.date, url: f.url.trim() });
      setF({ title: "", date: "", url: "" });
      setMsg("✅ Report jud gayi. Patient ko turant dikhegi.");
    } catch (e) { console.error(e); setMsg("❌ Nahi hui. Firestore rules check karo."); }
    setBusy(false);
  };

  const valid = f.title.trim().length >= 3 && f.date && f.url.trim().startsWith("http");

  return (
    <section className="wrap sec">
      <div className="box narrow">
        <h2>Report jodo (link se)</h2>
        <p className="muted">
          Yaha asli file upload nahi hoti — file kahin (Google Drive, WhatsApp, etc.) par daalke uska
          shareable link daalo. Real file-upload ke liye Firebase Storage ka paid (Blaze) plan chahiye hota hai.
        </p>
        <label>Patient ka mobile number</label>
        <div className="phone"><span>+91</span><input maxLength={10} value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))} /></div>
        <button className="btn ghost" disabled={phone.length !== 10 || busy} onClick={search}>Patient dhundo</button>

        {patient && (
          <>
            <p>👤 <b>{patient.name}</b> · {patient.phone}</p>
            <label>Report ka title</label>
            <input placeholder="jaise Blood Test Report" value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} />
            <label>Date</label>
            <input type="date" value={f.date} onChange={(e) => setF({ ...f, date: e.target.value })} />
            <label>Report ka link (Drive/WhatsApp/etc.)</label>
            <input placeholder="https://..." value={f.url} onChange={(e) => setF({ ...f, url: e.target.value })} />
            <button className="btn" disabled={!valid || busy} onClick={submit}>Report jodo</button>
          </>
        )}
        {msg && <p>{msg}</p>}
        <p><Link to="/admin">← Admin panel</Link></p>
      </div>
    </section>
  );
}

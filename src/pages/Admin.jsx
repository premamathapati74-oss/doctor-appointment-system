import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import { saveHospital, saveDoctor, removeHospital, removeDoctor, setAvailability } from "../firebase/adminServices";

const H0 = { name: "", city: "", address: "", phone: "" };
const D0 = { hospitalId: "", name: "", qualification: "", experience: "", specialty: "", photo: "", available: true };
const COMMON = ["General Physician", "Cardiology", "Orthopedics", "Gynaecology", "Paediatrics", "ENT", "Dermatology"];
const pick = (o, keys) => Object.fromEntries(keys.map((k) => [k, o[k] ?? ""]));

export default function Admin() {
  const { user, isAdmin, adminError, loading } = useAuth();
  const { hospitals, doctors } = useData();
  const [tab, setTab] = useState("hospitals");
  const [h, setH] = useState(H0); const [hid, setHid] = useState(null);
  const [d, setD] = useState(D0); const [did, setDid] = useState(null);
  const [msg, setMsg] = useState("");

  if (loading) return <section className="wrap sec"><p className="muted">Loading...</p></section>;
  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin) return (
    <section className="wrap sec">
      <div className="box narrow">
        <h2>Only Admins</h2>
        <p>Firebase Console → Firestore Database →  In Data <b>admins</b>Create a collection. In document:Enter the UID:</p>
        <input readOnly value={user.uid} onFocus={(e) => e.target.select()} />
        <p className="muted">Document me <code>role</code> = <code>admin</code> field daal kar save karein. Uske baad logout-login karke /admin refresh karein. Setup aur Firestore Rules ke exact steps README ke Firebase Setup guide me hain.</p>
        {adminError && <p className="err">Admin permission check fail hua ({adminError}). Firestore Rules me signed-in user ko apne <code>admins/{user.uid}</code> document ko read karne ki permission honi chahiye. Firebase project/config bhi check karein.</p>}
      </div>
    </section>
  );



  const run = async (fn, ok) => {
    try { await fn(); setMsg("✅ " + ok); }
    catch (e) {
      console.error("Admin operation error:", e);
      const code = e?.code ? ` (${e.code})` : "";
      const hint = e?.code === "permission-denied"
        ? "In firebase console, ensure the user has the necessary permissions."
        : e?.code === "unavailable"
          ? " Please check your internet connection and try again."
          : "";
      setMsg(`❌ not saved ${code}: ${e?.message || "Unknown error."}${hint}`);
    }
  };

  const submitH = () => run(async () => {
    await saveHospital(hid, { name: h.name.trim(), city: h.city.trim(), address: h.address.trim(), phone: h.phone.trim() });
    setH(H0); setHid(null);
  }, "Hospital save ho gaya");

  const submitD = () => run(async () => {
    await saveDoctor(did, {
      hospitalId: d.hospitalId, name: d.name.trim(), qualification: d.qualification.trim(),
      specialty: d.specialty.trim(), photo: d.photo.trim(), experience: Number(d.experience), available: !!d.available,
    });
    setD(D0); setDid(null);
  }, "Doctor save ho gaya");

  const delH = (x) => {
    if (doctors.some((y) => y.hospitalId === x.id)) return setMsg("❌ First delete doctors of this hospital");
    if (window.confirm(`"${x.name}" delete karein?`)) run(() => removeHospital(x.id), "Hospital deleted");
  };
  const delD = (x) => window.confirm(`"${x.name}" delete karein?`) && run(() => removeDoctor(x.id), "Doctor deleted");

  const validH = h.name.trim().length >= 3 && h.city.trim();
  const validD = d.hospitalId && d.name.trim().length >= 3 && d.specialty.trim() && Number(d.experience) >= 0 && d.experience !== "";
  const specs = [...new Set([...COMMON, ...doctors.map((x) => x.specialty)])];
  const setF = (setter, obj) => (k) => (e) => setter({ ...obj, [k]: e.target.value });

  return (
    <section className="wrap sec">
      <h2>Admin Panel</h2>
      <div className="tabs">
        <button className={"tab" + (tab === "hospitals" ? " on" : "")} onClick={() => { setTab("hospitals"); setMsg(""); }}>Hospitals ({hospitals.length})</button>
        <button className={"tab" + (tab === "doctors" ? " on" : "")} onClick={() => { setTab("doctors"); setMsg(""); }}>Doctors ({doctors.length})</button>
      </div>
      {msg && <p>{msg}</p>}

      {tab === "hospitals" && (
        <div className="grid">
          <div className="box">
            <h3>{hid ? "Hospital edit karo" : "Naya hospital"}</h3>
            <input placeholder="Hospital ka naam" value={h.name} onChange={setF(setH, h)("name")} />
            <input placeholder="Shehar" value={h.city} onChange={setF(setH, h)("city")} />
            <input placeholder="Address" value={h.address} onChange={setF(setH, h)("address")} />
            <input placeholder="Phone (optional)" value={h.phone} onChange={setF(setH, h)("phone")} />
            <button className="btn" disabled={!validH} onClick={submitH}>{hid ? "Update" : "Add Hospital"}</button>
            {hid && <button className="btn ghost" onClick={() => { setH(H0); setHid(null); }}>Cancel</button>}
          </div>
          {hospitals.map((x) => (
            <div className="box" key={x.id}>
              <h3>🏥 {x.name}</h3>
              <p className="muted">📍 {x.address || x.city}</p>
              <p className="muted">{doctors.filter((y) => y.hospitalId === x.id).length} doctors</p>
              <button className="btn ghost" onClick={() => { setH({ ...H0, ...pick(x, ["name", "city", "address", "phone"]) }); setHid(x.id); }}>Edit</button>
              <button className="btn ghost" onClick={() => delH(x)}>Delete</button>
            </div>
          ))}
        </div>
      )}

      {tab === "doctors" && (
        <div className="grid">
          <div className="box">
            <h3>{did ? "Doctor edit karo" : "Naya doctor"}</h3>
            <select value={d.hospitalId} onChange={setF(setD, d)("hospitalId")}>
              <option value="">Hospital chuno</option>
              {hospitals.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}
            </select>
            <input placeholder="Doctor ka naam (jaise Dr. Anil Kulkarni)" value={d.name} onChange={setF(setD, d)("name")} />
            <input placeholder="Qualification (jaise MBBS, MD)" value={d.qualification} onChange={setF(setD, d)("qualification")} />
            <input type="number" min="0" placeholder="Experience (saal)" value={d.experience} onChange={setF(setD, d)("experience")} />
            <input list="specs" placeholder="Speciality" value={d.specialty} onChange={setF(setD, d)("specialty")} />
            <datalist id="specs">{specs.map((s) => <option key={s} value={s} />)}</datalist>
            <input placeholder="Photo ka URL (optional)" value={d.photo} onChange={setF(setD, d)("photo")} />
            {d.photo && <img src={d.photo} alt="preview" style={{ width: 70, height: 70, borderRadius: "50%", objectFit: "cover" }} onError={(e) => (e.target.style.display = "none")} />}
            <label><input type="checkbox" style={{ width: "auto" }} checked={d.available} onChange={(e) => setD({ ...d, available: e.target.checked })} /> Available</label>
            <button className="btn" disabled={!validD} onClick={submitD}>{did ? "Update" : "Add Doctor"}</button>
            {did && <button className="btn ghost" onClick={() => { setD(D0); setDid(null); }}>Cancel</button>}
          </div>
          {doctors.map((x) => (
            <div className="box" key={x.id}>
              <h3>{x.name}</h3>
              <p>{x.qualification}</p>
              <p className="muted">{x.specialty} · {x.experience} saal · {hospitals.find((y) => y.id === x.hospitalId)?.name || "—"}</p>
              <span className={"badge " + (x.available ? "ok" : "no")}>{x.available ? "Available" : "Unavailable"}</span>
              <button className="btn ghost" onClick={() => run(() => setAvailability(x.id, !x.available), "Availability badal gayi")}>
                {x.available ? "Unavailable karo" : "Available karo"}
              </button>
              <button className="btn ghost" onClick={() => { setD({ ...D0, ...pick(x, ["hospitalId", "name", "qualification", "experience", "specialty", "photo"]), available: !!x.available }); setDid(x.id); window.scrollTo(0, 0); }}>Edit</button>
              <button className="btn ghost" onClick={() => delD(x)}>Delete</button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

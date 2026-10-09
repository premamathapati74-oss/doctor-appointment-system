import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProfileSetup() {
  const { user, profile, loading, saveProfile } = useAuth();
  const navigate = useNavigate();
  const [f, setF] = useState({ name: "", phone: "", age: "", gender: "Male", city: "" });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  if (loading) return <div className="center">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (profile) return <Navigate to="/" replace />;

  const valid = f.name.trim().length >= 3 && f.phone.length === 10 &&
    Number(f.age) > 0 && Number(f.age) < 121 && f.city.trim();

  const submit = async () => {
    setBusy(true); setErr("");
    try {
      await saveProfile({
        name: f.name.trim(), city: f.city.trim(), age: Number(f.age),
        gender: f.gender, phone: "+91" + f.phone, email: user.email,
      });
      navigate("/", { replace: true });
    } catch (e) { console.error(e); setErr("Profile save nahi hui, dobara try karo."); }
    setBusy(false);
  };

  return (
    <div className="center">
      <div className="card auth">
        <h2>Naye patient? Profile banayein</h2>
        <label>Email</label><input value={user.email} disabled />
        <label>Poora naam</label><input value={f.name} onChange={set("name")} />
        <label>Mobile number</label>
        <div className="phone">
          <span>+91</span>
          <input inputMode="numeric" maxLength={10} placeholder="10 digit number" value={f.phone}
            onChange={(e) => setF({ ...f, phone: e.target.value.replace(/\D/g, "") })} />
        </div>
        <label>Umar</label><input type="number" value={f.age} onChange={set("age")} />
        <label>Gender</label>
        <select value={f.gender} onChange={set("gender")}><option>Male</option><option>Female</option><option>Other</option></select>
        <label>Shehar</label><input value={f.city} onChange={set("city")} />
        <button className="btn" disabled={!valid || busy} onClick={submit}>{busy ? "Save ho raha hai..." : "Profile save karo"}</button>
        {err && <p className="err">{err}</p>}
      </div>
    </div>
  );
}

import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { seedDemoData, seedDemoDoctors, removeDemoDoctors } from "../firebase/seedData";

// Sirf testing ke liye. Sirf admin chala sakta hai.
export default function SeedData() {
  const { user, isAdmin } = useAuth();
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  const run = async (fn, ok) => {
    setBusy(true); setMsg("");
    try { await fn(); setMsg("✅ " + ok); }
    catch (e) { console.error(e); setMsg("❌ Nahi hua. Admin document aur Firestore rules check karo."); }
    setBusy(false);
  };

  return (
    <section className="wrap sec">
      <div className="box narrow">
        <h2>Data add karo (testing)</h2>
        {!user && <p>Pehle <Link to="/login">login</Link> karo.</p>}
        {user && !isAdmin && <p className="err">Ye sirf admin kar sakta hai. <Link to="/admin">/admin</Link> par UID dikhegi.</p>}
        {isAdmin && (
          <>
            <p className="muted">1) 25 hospitals (purana nakli data hat jata hai).</p>
            <button className="btn" disabled={busy} onClick={() => run(seedDemoData, "25 hospitals add ho gaye.")}>Hospitals add karo</button>
            <p className="muted">2) 30 demo doctors. Naam nakli hain aur (Demo) likha hota hai.</p>
            <button className="btn" disabled={busy} onClick={() => run(seedDemoDoctors, "30 demo doctors add ho gaye.")}>Demo doctors add karo</button>
            <p className="muted">Asli doctors add karne se pehle demo doctors hata do:</p>
            <button className="btn ghost" disabled={busy} onClick={() => run(removeDemoDoctors, "Demo doctors hat gaye.")}>Demo doctors hatao</button>
            {msg && <p>{msg}</p>}
            <p><Link to="/">← Home</Link> · <Link to="/admin">Admin panel</Link></p>
          </>
        )}
      </div>
    </section>
  );
}

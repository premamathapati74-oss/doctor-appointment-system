import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { listenMyReports } from "../firebase/services";

export default function Reports() {
  const { user } = useAuth();
  const [list, setList] = useState([]);
  const [err, setErr] = useState("");

  useEffect(() => listenMyReports(user.uid, setList, () => setErr("Reports load nahi hui. Firestore rules check karo.")), [user.uid]);

  return (
    <section className="wrap sec">
      <h2>Access Your Reports</h2>
      {err && <p className="err">{err}</p>}
      {!err && !list.length && <p className="muted">Abhi aapki koi report upload nahi hui hai.</p>}
      <div className="grid">
        {list.map((r) => (
          <div className="box" key={r.id}>
            <h3>{r.title}</h3>
            <p className="muted">{r.date}</p>
            {r.url && <a className="btn" href={r.url} target="_blank" rel="noreferrer">Report kholo</a>}
          </div>
        ))}
      </div>
    </section>
  );
}

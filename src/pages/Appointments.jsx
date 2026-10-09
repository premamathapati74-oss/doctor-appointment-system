import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { listenMyAppointments, cancelAppointment } from "../firebase/services";

export default function Appointments() {
  const { user } = useAuth();
  const [list, setList] = useState([]);
  const [err, setErr] = useState("");

  useEffect(() => listenMyAppointments(user.uid, setList, () => setErr("Appointments load nahi hui. Firestore rules check karo.")), [user.uid]);

  const sorted = [...list].sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time));

  return (
    <section className="wrap sec">
      <h2>My Appointments</h2>
      {err && <p className="err">{err}</p>}
      {!err && !sorted.length && <p className="muted">Abhi koi appointment nahi hai.</p>}
      <div className="grid">
        {sorted.map((a) => (
          <div className="box" key={a.id}>
            <h3>{a.doctorName}</h3>
            <p>{a.hospitalName}</p>
            <p>📅 {a.date} · ⏰ {a.time}</p>
            {a.reason && <p className="muted">{a.reason}</p>}
            <span className={"badge " + (a.status === "Booked" ? "ok" : "no")}>{a.status}</span>
            {a.status === "Booked" && <button className="btn ghost" onClick={() => cancelAppointment(a)}>Cancel</button>}
          </div>
        ))}
      </div>
    </section>
  );
}

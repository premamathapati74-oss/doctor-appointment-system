import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import { bookAppointment, listenBookedSlots } from "../firebase/services";

const SLOTS = ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00"];
const today = () => new Date().toISOString().slice(0, 10);

export default function BookAppointment() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { doctors, hospitals, loading } = useData();
  const [date, setDate] = useState(params.get("date") || today());
  const [time, setTime] = useState("");
  const [reason, setReason] = useState("");
  const [taken, setTaken] = useState([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const doctor = doctors.find((d) => d.id === id);
  const hospital = hospitals.find((h) => h.id === doctor?.hospitalId);

  useEffect(() => {
    setTime("");
    return listenBookedSlots(id, date, setTaken); // slots real-time
  }, [id, date]);

  if (loading) return <section className="wrap sec"><p className="muted">Loading...</p></section>;
  if (!doctor) return <section className="wrap sec"><p>Doctor nahi mila.</p></section>;

  const submit = async () => {
    setBusy(true); setErr("");
    try {
      await bookAppointment({
        doctorId: doctor.id, doctorName: doctor.name, hospitalName: hospital?.name || "",
        patientUid: user.uid, patientName: profile.name, patientPhone: profile.phone, date, time, reason: reason.trim(),
      });
      navigate("/appointments");
    } catch (e) {
      setErr(e.message === "SLOT_TAKEN" ? "Ye slot abhi kisi aur ne book kar liya. Doosra slot chuno." : "Booking nahi hui, dobara try karo.");
    }
    setBusy(false);
  };

  return (
    <section className="wrap sec">
      <div className="box narrow">
        <h2>{doctor.name}</h2>
        <p className="muted">{doctor.qualification} · {doctor.specialty}{hospital ? ` · ${hospital.name}` : ""}</p>
        {!doctor.available && <p className="err">Ye doctor abhi available nahi hai.</p>}
        <label>Patient</label>
        <input value={`${profile.name} (${profile.phone})`} disabled />
        <label>Date</label>
        <input type="date" min={today()} value={date} onChange={(e) => setDate(e.target.value)} />
        <label>Time slot</label>
        <div className="slots">
          {SLOTS.map((s) => (
            <button key={s} className={"slot" + (time === s ? " on" : "")} disabled={taken.includes(s)} onClick={() => setTime(s)}>{s}</button>
          ))}
        </div>
        <label>Reason (optional)</label>
        <textarea rows={3} value={reason} onChange={(e) => setReason(e.target.value)} />
        <button className="btn" disabled={!time || !doctor.available || busy} onClick={submit}>{busy ? "Booking..." : "Confirm Appointment"}</button>
        {err && <p className="err">{err}</p>}
      </div>
    </section>
  );
}

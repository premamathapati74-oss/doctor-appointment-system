import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { addFeedback } from "../firebase/services";

export default function Feedback() {
  const { user, profile } = useAuth();
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setBusy(true); setMsg("");
    try {
      await addFeedback({ patientUid: user.uid, name: profile.name, rating, message: message.trim() });
      setMessage(""); setMsg("✅ Feedback ke liye dhanyavaad!");
    } catch { setMsg("❌ Feedback nahi gaya, dobara try karo."); }
    setBusy(false);
  };

  return (
    <section className="wrap sec">
      <div className="box narrow">
        <h2>Feedback</h2>
        <label>Rating</label>
        <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
          {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{"★".repeat(n)} ({n})</option>)}
        </select>
        <label>Aapka feedback</label>
        <textarea rows={4} value={message} onChange={(e) => setMessage(e.target.value)} />
        <button className="btn" disabled={message.trim().length < 5 || busy} onClick={submit}>Submit</button>
        {msg && <p>{msg}</p>}
      </div>
    </section>
  );
}

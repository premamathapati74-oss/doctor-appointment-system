import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";
import { auth } from "../firebase/config";
import { useAuth } from "../context/AuthContext";

const EMAIL_KEY = "medibook_login_email";

const getError = (error) => {
  const messages = {
    "auth/invalid-email": "Email sahi format mein daalein.",
    "auth/operation-not-allowed": "Firebase Console mein Email link sign-in enable karein.",
    "auth/unauthorized-domain": "Firebase Console ke Authorized domains mein current domain add karein.",
    "auth/quota-exceeded": "Aaj ke liye email limit khatam ho gayi. Kal try karein.",
  };
  return messages[error?.code] || `Link nahi bhej paye (${error?.code || error?.message || "unknown"}).`;
};

export default function Login() {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [err, setErr] = useState("");

  // Login ke baad: purana patient => Home, naya patient => Profile setup
  useEffect(() => {
    if (!loading && user) navigate(profile ? "/" : "/profile-setup", { replace: true });
  }, [user, profile, loading, navigate]);

  // Jab patient email ke link par click karke wapas is page par aata hai
  useEffect(() => {
    if (!isSignInWithEmailLink(auth, window.location.href)) return;
    let saved = window.localStorage.getItem(EMAIL_KEY);
    if (!saved) saved = window.prompt("Confirm karne ke liye apna email daalo:");
    if (!saved) return;
    setVerifying(true);
    signInWithEmailLink(auth, saved, window.location.href)
      .then(() => {
        window.localStorage.removeItem(EMAIL_KEY);
        window.history.replaceState({}, document.title, window.location.pathname); // URL se link params hatao
      })
      .catch((e) => { console.error("Verify error:", e.code, e.message); setErr(getError(e)); })
      .finally(() => setVerifying(false));
  }, []);

  const sendLink = async () => {
    setErr(""); setBusy(true);
    try {
      await sendSignInLinkToEmail(auth, email, {
        url: window.location.origin + "/login",
        handleCodeInApp: true,
      });
      window.localStorage.setItem(EMAIL_KEY, email);
      setSent(true);
    } catch (e) {
      console.error("Send link error:", e.code, e.message);
      setErr(getError(e));
    }
    setBusy(false);
  };

  if (verifying) return <div className="center"><div className="card auth"><p>Login ho raha hai...</p></div></div>;

  return (
    <div className="center">
      <div className="card auth">
        <h1 className="logo">MEDIBOOK</h1>
        <p className="muted">Email se login karein</p>

        {!sent ? (
          <>
            <label>Email</label>
            <input type="email" placeholder="aapka@email.com" value={email}
              onChange={(e) => setEmail(e.target.value.trim())} />
            <button className="btn" disabled={!email.includes("@") || busy} onClick={sendLink}>
              {busy ? "Bhej rahe hain..." : "Login link bhejo"}
            </button>
          </>
        ) : (
          <>
            <p>✅ Login link <b>{email}</b> par bhej diya hai. Apna inbox (aur Spam/Junk folder) check karo aur usme diye link par click karo.</p>
            <button className="btn ghost" onClick={() => setSent(false)}>Email badlo</button>
          </>
        )}
        {err && <p className="err">{err}</p>}
      </div>
    </div>
  );
}

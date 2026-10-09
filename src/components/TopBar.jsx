import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLang } from "../context/LanguageContext";
import { LANGS } from "../i18n/translations";

// 👉 Apna asli mobile number yaha daalo (dono jagah, 000... ki jagah)
const PHONE_DISPLAY = "+91 9876543210";
const PHONE_TEL = "+919876543210";

export default function TopBar() {
  const { user, profile, logout } = useAuth();
  const { lang, setLang, t } = useLang();
  return (
    <div className="topbar">
      <div className="wrap topbar-in">
        <div className="tb-l">
          <a href={`tel:${PHONE_TEL}`}>📞 {PHONE_DISPLAY}</a>
          <Link to="/book">💬 {t("doctorAppointment")}</Link>
          <span>🚑 {t("emergency")} 000 000 111</span>
        </div>
        <div className="tb-r">
          <Link to="/reports">📱 {t("reports")}</Link>
          <select aria-label="Language" value={lang} onChange={(e) => setLang(e.target.value)}>
            {LANGS.map(([code, name]) => <option key={code} value={code}>{name}</option>)}
          </select>
          {user && profile ? (
            <button onClick={logout}>👤 {profile.name} ({t("logout")})</button>
          ) : (
            <Link className="pill" to="/login">{t("login")}</Link>
          )}
        </div>
      </div>
    </div>
  );
}

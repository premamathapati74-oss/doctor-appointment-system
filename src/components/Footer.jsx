import { Link } from "react-router-dom";
import { useLang } from "../context/LanguageContext";

// 👉 Yaha bhi wahi number daalo jo TopBar.jsx me daala
const PHONE_DISPLAY = "+91 9876543210";
const EMAIL = "medicare@gmail.com";

export default function Footer() {
  const { t } = useLang();
  return (
    <footer className="ftr">
      <div className="wrap ftr-grid">
        <div><h3>MEDIBOOK</h3><p>{t("footerAbout")}</p></div>
        <div>
          <h4>{t("quickLinks")}</h4>
          <Link to="/doctors">{t("findDoctor")}</Link>
          <Link to="/hospitals">{t("ourHospitals")}</Link>
          <Link to="/book">{t("bookAppt")}</Link>
          <Link to="/appointments">{t("myAppts")}</Link>
        </div>
        <div>
          <h4>{t("contact")}</h4>
          <p>📞 {PHONE_DISPLAY}</p>
          <p>🚑 {t("emergency")} 000 000 111</p>
          <p>✉️ {EMAIL}</p>
        </div>
      </div>
      <div className="copy">© {new Date().getFullYear()} MediBook. {t("rights")}</div>
    </footer>
  );
}

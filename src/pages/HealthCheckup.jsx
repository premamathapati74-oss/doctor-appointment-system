import { Link, useSearchParams } from "react-router-dom";
import { PACKAGES } from "../data/content";
import { useLang } from "../context/LanguageContext";

export default function HealthCheckup() {
  const [p] = useSearchParams();
  const { t } = useLang();
  const cur = p.get("package");
  return (
    <section className="wrap sec">
      <h2>{t("healthCheckup")}</h2>
      <div className="grid">
        {PACKAGES.map((k) => (
          <div key={k.id} className={"box" + (k.id === cur ? " sel" : "")}>
            <h3>{k.title}</h3>
            <ul>{k.tests.map((x) => <li key={x}>{x}</li>)}</ul>
            <Link className="btn" to="/book">{t("bookAppt")}</Link>
          </div>
        ))}
      </div>
    </section>
  );
}

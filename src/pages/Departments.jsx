import { Link, useSearchParams } from "react-router-dom";
import { DEPARTMENTS } from "../data/content";
import { useLang } from "../context/LanguageContext";

export default function Departments() {
  const [p] = useSearchParams();
  const { t } = useLang();
  const d = DEPARTMENTS.find((x) => x.id === p.get("name")) || DEPARTMENTS[0];
  return (
    <section className="wrap sec">
      <h2>{t("departments")}</h2>
      <div className="tabs">
        {DEPARTMENTS.map((x) => <Link key={x.id} className={"tab" + (x.id === d.id ? " on" : "")} to={`/departments?name=${x.id}`}>{x.title}</Link>)}
      </div>
      <div className="box narrow"><h3>{d.title}</h3><p>{d.desc}</p><ul>{d.services.map((s) => <li key={s}>{s}</li>)}</ul></div>
    </section>
  );
}

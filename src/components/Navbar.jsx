import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { NAV } from "../data/navMenu";
import { useData } from "../context/DataContext";
import { useLang } from "../context/LanguageContext";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const { hospitals, doctors } = useData();
  const { t, ts } = useLang();
  const close = () => setOpen(false);

  const specs = [...new Set(doctors.map((d) => d.specialty))];

  // Har dropdown item: [label, link, availability(optional)]
  const itemsOf = (n) => {
    if (n.live === "hospitals") return hospitals.map((h) => [h.name, `/doctors?hospital=${h.id}`]);
    if (n.live === "specialities") return specs.map((s) => [ts(s), `/doctors?speciality=${encodeURIComponent(s)}`]);
    if (n.live === "doctors") return doctors.map((d) => [d.name, `/doctors?q=${encodeURIComponent(d.name)}`, d.available]);
    return n.items.map(([k, to]) => [t(k), to]);
  };

  const search = (e) => {
    e.preventDefault();
    if (q.trim()) { navigate(`/doctors?q=${encodeURIComponent(q.trim())}`); close(); }
  };

  return (
    <header className="hdr">
      <div className="wrap logo-row">
        <Link to="/" className="logo" onClick={close}>MEDIBOOK<small>{t("tagline")}</small></Link>
        <form className="search" onSubmit={search}>
          <input placeholder={t("searchPh")} value={q} onChange={(e) => setQ(e.target.value)} />
          <button aria-label="Search">🔍</button>
        </form>
        <button className="burger" aria-label="Menu" onClick={() => setOpen(!open)}>{open ? "✕" : "☰"}</button>
      </div>

      <nav className={"nav" + (open ? " open" : "")}>
        <div className="wrap nav-in">
          {NAV.map((n) => {
            if (!n.live && !n.items) return <NavLink key={n.key} to={n.to} className="dd-btn" onClick={close}>{t(n.key)}</NavLink>;
            const items = itemsOf(n);
            return (
              <div className="dd" key={n.key}>
                <button className="dd-btn" type="button">{t(n.key)} ▾</button>
                <div className="menu">
                  {items.length === 0 && <span className="menu-empty">{t("noData")}</span>}
                  {items.map(([label, to, av]) => (
                    <Link key={label + to} to={to} onClick={close}>
                      {av !== undefined && <i className={"dot " + (av ? "on" : "off")} />}{label}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
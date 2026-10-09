import { useLang } from "../context/LanguageContext";

export default function BookingCard({ hospitals, doctors, sel, setSel, onSubmit }) {
  const { t, ts } = useLang();
  const inHosp = doctors.filter((d) => !sel.hid || d.hospitalId === sel.hid);
  const specialities = [...new Set(inHosp.map((d) => d.specialty))];
  const list = inHosp.filter((d) => !sel.sp || d.specialty === sel.sp);
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="bookcard">
      <h2>{t("bookTitle")}</h2>

      <label>{t("selHospital")}</label>
      <select value={sel.hid} onChange={(e) => setSel({ ...sel, hid: e.target.value, sp: "", did: "" })}>
        <option value="">—</option>
        {hospitals.map((h) => <option key={h.id} value={h.id}>{h.name} ({h.city})</option>)}
      </select>

      <label>{t("selSpeciality")}</label>
      <select value={sel.sp} onChange={(e) => setSel({ ...sel, sp: e.target.value, did: "" })}>
        <option value="">—</option>
        {specialities.map((s) => <option key={s} value={s}>{ts(s)}</option>)}
      </select>

      <label>{t("selDoctor")}</label>
      <select value={sel.did} onChange={(e) => setSel({ ...sel, did: e.target.value })}>
        <option value="">—</option>
        {list.map((d) => <option key={d.id} value={d.id}>{d.name}{d.available ? "" : ` (${t("unavailable")})`}</option>)}
      </select>

      <label>{t("selDate")}</label>
      <input type="date" min={today} value={sel.date} onChange={(e) => setSel({ ...sel, date: e.target.value })} />

      <button className="btn" disabled={!sel.did} onClick={onSubmit}>{t("bookAppt")}</button>
    </div>
  );
}

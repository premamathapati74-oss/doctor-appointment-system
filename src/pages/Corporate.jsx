export default function Corporate() {
  const items = ["Employee health checkup camps", "Corporate health packages", "On-site doctor visits", "Occupational health screening", "Priority appointments for employees"];
  return (
    <section className="wrap sec">
      <h2>Corporate</h2>
      <div className="box narrow">
        <p>Health programmes for companies and their employees.</p>
        <ul>{items.map((i) => <li key={i}>{i}</li>)}</ul>
        <p className="muted">Corporate tie-ups: care@medibook.example</p>
      </div>
    </section>
  );
}

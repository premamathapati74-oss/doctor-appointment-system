export default function International() {
  const items = ["Visa invitation letter support", "Airport pickup and local travel help", "Language interpreter", "Stay and accommodation guidance", "Online consultation before travel"];
  return (
    <section className="wrap sec">
      <h2>International Patients</h2>
      <div className="box narrow">
        <p>We help patients from other countries plan treatment smoothly, from the first enquiry to follow-up care.</p>
        <ul>{items.map((i) => <li key={i}>{i}</li>)}</ul>
        <p className="muted">Enquiry: care@medibook.example</p>
      </div>
    </section>
  );
}

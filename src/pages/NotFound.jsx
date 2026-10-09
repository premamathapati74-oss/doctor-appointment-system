import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="wrap page">
      <h1>404 – Page nahi mila</h1>
      <p className="muted">Ye page abhi bana nahi hai ya link galat hai.</p>
      <Link className="btn" to="/">Home par jao</Link>
    </section>
  );
}

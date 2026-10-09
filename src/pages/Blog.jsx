import { POSTS } from "../data/content";

export default function Blog() {
  return (
    <section className="wrap sec">
      <h2>Blog</h2>
      <div className="grid">
        {POSTS.map((p) => <article className="box" key={p.id}><h3>{p.title}</h3><p>{p.text}</p></article>)}
      </div>
    </section>
  );
}

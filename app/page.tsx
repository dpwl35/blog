import { BlogPosts } from "app/components/posts";

export default function Page() {
  return (
    <section className="main-content">
      <p className="main-content-area">
        {`I'm a Vim enthusiast and tab advocate, finding unmatched efficiency in
        Vim's keystroke commands and tabs' flexibility for personal viewing
        preferences. This extends to my support for static typing, where its
        early error detection ensures cleaner code, and my preference for dark
        mode, which eases long coding sessions by reducing eye strain.`}
      </p>
      <div>{/* <BlogPosts /> */}</div>
    </section>
  );
}

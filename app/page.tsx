import { BlogPosts } from "app/components/posts";
import Room from "lab/room";

export default function Page() {
  return (
    <section className="main-content">
      <Room />
      <p className="main-content-area">{`안녕하세요.`}</p>
      {/* <div>{<BlogPosts />}</div> */}
    </section>
  );
}

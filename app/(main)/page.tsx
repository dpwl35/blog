import { getBlogPosts, formatDate } from "app/(main)/blog/utils";
import { getLabItems } from "../lab/utils";
import Link from "next/link";

export default async function Page() {
  const posts = getBlogPosts()
    .sort(
      (a, b) =>
        new Date(b.metadata.publishedAt).getTime() -
        new Date(a.metadata.publishedAt).getTime(),
    )
    .slice(0, 3);

  const labItems = await getLabItems();

  return (
    <div className="main-content">
      <div className="main-content-area">
        <p>{`안녕하세요.`}</p>
      </div>
      <div>
        <div>
          <p>BLOG : 인사이트를 보관하는 곳</p>
          <ul>
            {posts.map((post) => (
              <li key={post.slug}>
                <Link href={`/blog/${post.slug}`}>{post.metadata.title}</Link>
                <span>{formatDate(post.metadata.publishedAt)}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p>AECHIVE : 흥미있는 것을 만드는 공간</p>
          <ul>
            {labItems.map((item) => (
              <li key={item.slug}>
                <Link
                  href={`/lab/${item.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

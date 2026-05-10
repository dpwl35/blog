import Link from "next/link";
import { formatDate, getBlogPosts } from "app/blog/utils";

export function BlogPosts() {
  let allBlogs = getBlogPosts();

  return (
    <ul className="post-list">
      {allBlogs
        .sort((a, b) => {
          if (
            new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)
          ) {
            return -1;
          }
          return 1;
        })
        .map((post) => (
          <li key={post.slug} className="post-item">
            <Link
              className="post-item_link"
              href={`/blog/${post.slug}`}
            >
              <p className="post-item_text">{post.metadata.title}</p>
              <p className="post-item_date">
                {formatDate(post.metadata.publishedAt, false)}
              </p>
            </Link>
          </li>
        ))}
    </ul>
  );
}

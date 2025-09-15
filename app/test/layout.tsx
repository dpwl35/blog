import fs from "fs";
import path from "path";
import Link from "next/link";

export default function testLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pageDir = path.join(process.cwd(), "test");
  const files = fs
    .readdirSync(pageDir)
    .filter((f) => f.endsWith(".tsx"))
    .map((file) => file.replace(/\.tsx$/, ""));

  return (
    <section className="post-section">
      <ul className="post-list">
        {files.map((slug) => (
          <li key={slug} className="post-item">
            <Link href={`/test/${slug}`} className="post-item_link">
              {slug}
            </Link>
          </li>
        ))}
      </ul>
      {children}
    </section>
  );
}

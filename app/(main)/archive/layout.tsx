import fs from "fs";
import path from "path";
import Link from "next/link";

export default async function ArchiveLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pageDir = path.join(process.cwd(), "lab");

  const dirs = fs
    .readdirSync(pageDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  const items = await Promise.all(
    dirs.map(async (slug) => {
      try {
        const mod = await import(`../../../lab/${slug}/metadata`);
        return { slug, title: mod.metadata?.title ?? slug };
      } catch {
        return { slug, title: slug };
      }
    }),
  );

  return (
    <section className="post-section">
      <ul className="post-list">
        {items.map(({ slug, title }) => (
          <li key={slug} className="post-item gallery">
            <Link
              href={`/lab/${slug}`}
              className="post-item_link"
              target="_blank"
              rel="noopener noreferrer"
            >
              {title}
            </Link>
          </li>
        ))}
      </ul>
      {children}
    </section>
  );
}

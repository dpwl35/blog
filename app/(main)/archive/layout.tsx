import fs from "fs";
import path from "path";
import Link from "next/link";
import Image from "next/image";

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
        return {
          slug,
          title: mod.metadata?.title ?? slug,
          image: mod.metadata?.image ?? null,
          tags: mod.metadata?.tags ?? [],
          postUrl: mod.metadata?.postUrl ?? null,
          year: mod.metadata?.year ?? null,
        };
      } catch {
        return {
          slug,
          title: slug,
          image: null,
          tags: [],
          postUrl: null,
          year: null,
        };
      }
    }),
  );

  return (
    <section className="post-section">
      <ul className="post-gallery">
        {items.map(({ slug, title, image, tags, postUrl, year }) => (
          <li key={slug} className="post-item gallery">
            <div className="post-item_list">
              <div className="post-item_left">
                <p className="post-item_title">{title}</p>
                <div className="post-item_description">
                  <p className="post-item_year">{year}</p>
                  <div className="post-item_link">
                    <a
                      href={`/lab/${slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Project
                    </a>
                    {postUrl && <a href={postUrl}>Read More</a>}
                  </div>
                  <div className="post-item_tags">
                    {tags.map((tag) => (
                      <span key={tag}>#{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="post-item_thumbnail">
                <div className="post-item_image">
                  {image && <img src={image} alt={title} />}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
      {children}
    </section>
  );
}

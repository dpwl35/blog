import fs from "fs";
import path from "path";
import GalleryItem from "app/components/gallery";

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
    <div className="post-section">
      <ul className="post-gallery">
        {items.map(({ slug, title, image, tags, postUrl, year }) => (
          <li key={slug} className="post-item gallery">
            <GalleryItem
              slug={slug}
              title={title}
              image={image}
              tags={tags}
              postUrl={postUrl}
              year={year}
            />
          </li>
        ))}
      </ul>
      {children}
    </div>
  );
}

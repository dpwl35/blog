import fs from "fs";
import path from "path";

export async function getLabItems() {
  const pageDir = path.join(process.cwd(), "lab");

  const dirs = fs
    .readdirSync(pageDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  return await Promise.all(
    dirs.map(async (slug) => {
      try {
        const mod = await import(`../../lab/${slug}/metadata`);
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
}

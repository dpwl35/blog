import fs from 'fs';
import path from 'path';
import type { LabMetadata } from '../../lab/types';

type LabItem = {
  slug: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  image: string | null;
  tags: string[];
  postUrl: string | null;
  year: string | null;
};

export async function getLabItems(): Promise<LabItem[]> {
  const pageDir = path.join(process.cwd(), 'lab');

  const dirs = fs
    .readdirSync(pageDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  return await Promise.all(
    dirs.map(async (slug) => {
      try {
        const mod = await import(`../../lab/${slug}/metadata`);
        const metadata = mod.metadata as LabMetadata;
        return {
          slug,
          title: metadata.title ?? slug,
          subtitle: metadata.subtitle ?? null,
          description: metadata.description ?? null,
          image: metadata.image ?? null,
          tags: metadata.tags ?? [],
          postUrl: metadata.postUrl ?? null,
          year: metadata.year ?? null,
        };
      } catch {
        return {
          slug,
          title: slug,
          subtitle: null,
          description: null,
          image: null,
          tags: [],
          postUrl: null,
          year: null,
        };
      }
    }),
  );
}

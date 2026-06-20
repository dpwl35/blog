import fs from 'fs';
import path from 'path';
import type { LabMetadata } from '../../lab/types';
import { externalLabItems } from '../../lab/external';

type LabItem = {
  slug: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  image: string | null;
  tags: string[];
  postUrl: string | null;
  year: string | null;
  date: string | null;
  externalUrl: string | null;
};

export async function getLabItems(): Promise<LabItem[]> {
  const pageDir = path.join(process.cwd(), 'lab');

  const dirs = fs
    .readdirSync(pageDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  const localItems = await Promise.all(
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
          year: metadata.date ? metadata.date.slice(0, 4) : null,
          date: metadata.date ?? null,
          externalUrl: null,
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
          date: null,
          externalUrl: null,
        };
      }
    }),
  );

  const externalItems: LabItem[] = externalLabItems.map((item) => ({
    slug: item.slug,
    title: item.title,
    subtitle: item.subtitle ?? null,
    description: item.description ?? null,
    image: item.image ?? null,
    tags: item.tags ?? [],
    postUrl: item.postUrl ?? null,
    year: item.date ? item.date.slice(0, 4) : null,
    date: item.date ?? null,
    externalUrl: item.externalUrl,
  }));

  const allItems = [...localItems, ...externalItems];

  return allItems.sort((a, b) => {
    if (!a.date) return 1;
    if (!b.date) return -1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}

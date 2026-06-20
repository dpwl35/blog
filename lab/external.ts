import type { LabMetadata } from './types';

export type ExternalLabItem = LabMetadata & {
  slug: string;
  externalUrl: string;
};

export const externalLabItems: ExternalLabItem[] = [
  {
    slug: 'unset-lab',
    title: 'Unset Lab',
    subtitle: 'Three.js·GSAP 기반 가상 스튜디오 포트폴리오',
    image: '/images/thumbnails/unset-lab.jpg',
    tags: ['Next.js', 'TypeScript'],
    date: '2026-06-20',
    externalUrl: 'https://unset-lab.vercel.app/',
  },
];

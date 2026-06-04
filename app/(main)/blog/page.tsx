// app/(main)/blog/page.tsx
import { BlogPosts } from 'app/components/posts';
import { getBlogPosts } from './utils';
import { baseUrl } from 'app/sitemap';

export const metadata = {
  title: 'Blog',
  description: 'Read my blog.',
};

export default function Page() {
  const posts = getBlogPosts();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: posts.map((post, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `${baseUrl}/blog/${post.slug}`,
      name: post.metadata.title,
    })),
  };

  return (
    <div className='post-section'>
      <script
        type='application/ld+json'
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogPosts />
    </div>
  );
}

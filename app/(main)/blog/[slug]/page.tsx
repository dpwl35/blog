import { notFound } from 'next/navigation';
import { CustomMDX } from 'app/components/mdx';
import { formatDate, getBlogPosts } from 'app/(main)/blog/utils';
import { baseUrl } from 'app/sitemap';
import { Toc } from 'app/components/toc';
import Link from 'next/link';
import ArrowIcon from 'app/components/arrowIcon';

export function generateStaticParams() {
  let posts = getBlogPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export function generateMetadata({ params }) {
  let post = getBlogPosts().find((post) => post.slug === params.slug);
  if (!post) {
    return;
  }

  let {
    title,
    publishedAt: publishedTime,
    summary: description,
    image,
  } = post.metadata;
  let ogImage = image
    ? image
    : `${baseUrl}/og?title=${encodeURIComponent(title)}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime,
      url: `${baseUrl}/blog/${post.slug}`,
      images: [
        {
          url: ogImage,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  };
}

export default function Blog({ params }) {
  const posts = getBlogPosts().sort(
    (a, b) =>
      new Date(b.metadata.publishedAt).getTime() -
      new Date(a.metadata.publishedAt).getTime(),
  );

  const currentIndex = posts.findIndex((p) => p.slug === params.slug);
  let post = posts[currentIndex];
  // const count = 100;

  const prevPost = posts[currentIndex + 1] ?? null; // 날짜 오래된 것
  const nextPost = posts[currentIndex - 1] ?? null; // 날짜 최신 것

  if (!post) notFound();

  return (
    <div className='post'>
      <script
        type='application/ld+json'
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.metadata.title,
            datePublished: post.metadata.publishedAt,
            dateModified: post.metadata.publishedAt,
            description: post.metadata.summary,
            image: post.metadata.image
              ? `${baseUrl}${post.metadata.image}`
              : `/og?title=${encodeURIComponent(post.metadata.title)}`,
            url: `${baseUrl}/blog/${post.slug}`,
            author: {
              '@type': 'Person',
              name: 'dpwl35',
            },
          }),
        }}
      />

      <Toc headings={post.headings} title={post.metadata.title} />

      <div className='post-header'>
        <h1 className='post-title'>{post.metadata.title}</h1>
        <div className='post-info'>
          <p className='post-info_date'>
            {formatDate(post.metadata.publishedAt)}
          </p>
          {/* <div className="post-info_views"> {100} views</div> */}
        </div>
      </div>

      <article className='post-body'>
        <CustomMDX source={post.content} />
      </article>

      <nav className='post-nav'>
        {prevPost ? (
          <Link href={`/blog/${prevPost.slug}`} className='post-nav-prev'>
            <span>
              <ArrowIcon />
              prev
            </span>
            <p>{prevPost.metadata.title}</p>
          </Link>
        ) : (
          <div className='post-nav-prev'>
            <span>
              <ArrowIcon />
              prev
            </span>
            <p>-</p>
          </div>
        )}
        {nextPost ? (
          <Link href={`/blog/${nextPost.slug}`} className='post-nav-next'>
            <span>
              next <ArrowIcon />
            </span>

            <p>{nextPost.metadata.title}</p>
          </Link>
        ) : (
          <div className='post-nav-next'>
            <span>
              next <ArrowIcon />
            </span>
            <p>-</p>
          </div>
        )}
      </nav>
    </div>
  );
}

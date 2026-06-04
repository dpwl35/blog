'use client';

import { useEffect, useState } from 'react';

export default function GalleryItem({
  slug,
  title,
  image,
  tags,
  postUrl,
  year,
  subtitle,
}: {
  slug: string;
  title: string;
  image: string | null;
  tags: string[];
  postUrl: string | null;
  year: string | null;
  subtitle: string | null;
}) {
  const [active, setActive] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 576);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return (
    <div
      className={`post-item-list ${!isMobile && active ? 'active' : ''}`}
      onClick={() => !isMobile && setActive((prev) => !prev)}
    >
      <div className='post-item-left'>
        <div className='post-item-title'>
          <p>{title}</p>
          <p className='ddd'>{subtitle}</p>
        </div>
        <div className='post-item-description'>
          <p className='post-item-year'>{year}</p>
          <div className='post-item-link'>
            <a href={`/lab/${slug}`} target='_blank' rel='noopener noreferrer'>
              View Project
            </a>
            {postUrl && <a href={postUrl}>Read More</a>}
          </div>
          <div className='post-item-tags'>
            {tags.map((tag) => (
              <span key={tag}>#{tag}</span>
            ))}
          </div>
        </div>
      </div>
      <div className='post-item-thumbnail'>
        <div className='post-item-image'>
          {image && <img src={image} alt={title} />}
        </div>
      </div>
    </div>
  );
}

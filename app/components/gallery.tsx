'use client';

import { useEffect, useRef, useState } from 'react';

export default function GalleryItem({
  slug,
  title,
  image,
  tags,
  postUrl,
  year,
  subtitle,
  externalUrl,
}: {
  slug: string;
  title: string;
  image: string | null;
  tags: string[];
  postUrl: string | null;
  year: string | null;
  subtitle: string | null;
  externalUrl: string | null;
}) {
  const [active, setActive] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 576);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    if (imgRef.current?.complete) {
      setImgLoaded(true);
    }
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
            <a
              href={externalUrl ?? `/lab/${slug}`}
              target='_blank'
              rel='noopener noreferrer'
            >
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
          {image && (
            <img
              ref={imgRef}
              src={image}
              alt={title}
              className={imgLoaded ? 'loaded' : ''}
              onLoad={() => setImgLoaded(true)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

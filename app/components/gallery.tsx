'use client';

import { useState } from 'react';

export default function GalleryItem({
  slug,
  title,
  image,
  tags,
  postUrl,
  year,
}: {
  slug: string;
  title: string;
  image: string | null;
  tags: string[];
  postUrl: string | null;
  year: string | null;
}) {
  const [active, setActive] = useState(false);

  return (
    <div
      className={`post-item-list ${active ? 'active' : ''}`}
      onClick={() => setActive((prev) => !prev)}
    >
      <div className='post-item-left'>
        <p className='post-item-title'>{title}</p>
        <div className='post-item-description'>
          <p className='post-item-year'>{year}</p>
          <div className='post-item-link'>
            <a href={`/lab/${slug}`} target='_blank' rel='noopener noreferrer'>
              View Project
            </a>
            {postUrl && <a href={postUrl}>Read More</a>}
          </div>
          <div className='post-item_tags'>
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

"use client";

import { useState } from "react";

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
      className={`post-item_list ${active ? "active" : ""}`}
      onClick={() => setActive((prev) => !prev)}
    >
      <div className="post-item_left">
        <p className="post-item_title">{title}</p>
        <div className="post-item_description">
          <p className="post-item_year">{year}</p>
          <div className="post-item_link">
            <a href={`/lab/${slug}`} target="_blank" rel="noopener noreferrer">
              View Project
            </a>
            {postUrl && <a href={postUrl}>Read More</a>}
          </div>
          <div className="post-item_tags">
            {tags.map((tag) => (
              <span key={tag}>#{tag}</span>
            ))}
          </div>
        </div>
      </div>
      <div className="post-item_thumbnail">
        <div className="post-item_image">
          {image && <img src={image} alt={title} />}
        </div>
      </div>
    </div>
  );
}

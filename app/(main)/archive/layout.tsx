import { getLabItems } from '../../lab/utils';
import GalleryItem from 'app/components/gallery';

export default async function ArchiveLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const items = await getLabItems();

  return (
    <div className='post-section'>
      <ul className='post-gallery'>
        {items.map(
          ({
            slug,
            title,
            image,
            tags,
            postUrl,
            year,
            subtitle,
            externalUrl,
          }) => (
            <li key={slug} className='post-item gallery'>
              <GalleryItem
                slug={slug}
                title={title}
                image={image}
                tags={tags}
                postUrl={postUrl}
                year={year}
                subtitle={subtitle}
                externalUrl={externalUrl}
              />
            </li>
          ),
        )}
      </ul>
      {children}
    </div>
  );
}

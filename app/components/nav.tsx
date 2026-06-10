import Link from 'next/link';
import ArrowIcon from './arrowIcon';

const navItems = {
  '/': {
    name: 'HOME',
  },
  '/blog': {
    name: 'BLOG',
  },
  '/archive': {
    name: 'ARCHIVE',
  },
};

export function Navbar() {
  return (
    <div className='category'>
      <nav className='category-area' id='nav'>
        {Object.entries(navItems).map(([path, { name }]) => {
          return (
            <Link key={path} href={path} className='category-item'>
              {name}
            </Link>
          );
        })}
        <Link
          className='category-item'
          href='https://dpwl35.github.io/'
          target='_blank'
          rel='noopener noreferrer'
        >
          <span>NOTES</span>
          <ArrowIcon />
        </Link>
      </nav>
    </div>
  );
}

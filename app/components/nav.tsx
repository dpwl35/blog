import Link from 'next/link';
import ArrowIcon from './arrowIcon';

const navItems = {
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
        <Link className='category-item' href='/'>
          <h1>HOME</h1>
        </Link>
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

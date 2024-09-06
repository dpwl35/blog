import Link from 'next/link';
import { ReactNode } from 'react';

interface AProps {
  children: ReactNode;
  className?: string;
  href: string;
  [key: string]: any;
}

export function A({ children, className = '', href, ...props }: AProps) {
  if (href[0] === '#') {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  } else {
    return (
      <Link href={href} {...props}>
        {children}
      </Link>
    );
  }
}

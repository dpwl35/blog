import { ReactNode } from 'react';

interface H3Props {
  children: ReactNode;
}

export function H3({ children }: H3Props) {
  const id = typeof children === 'string' ? children : '';
  const safeId = id.replace(/\s+/g, '-').toLowerCase();

  return <h3 id={safeId}>{children}</h3>;
}

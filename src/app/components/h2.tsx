import { ReactNode } from 'react';

interface H2Props {
  children: ReactNode;
}

export function H2({ children }: H2Props) {
  const id = typeof children === 'string' ? children : '';
  const safeId = id.replace(/\s+/g, '-').toLowerCase();

  return <h2 id={safeId}>{children}</h2>;
}

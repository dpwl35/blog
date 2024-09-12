import { ReactNode } from 'react';

interface H2Props {
  children: ReactNode;
  className?: string;
}

export function H2({ children, className = 'post-h2' }: H2Props) {
  const id = typeof children === 'string' ? children : '';
  const safeId = id.replace(/\s+/g, '-').toLowerCase();

  return (
    <h2 id={safeId} className={className}>
      {children}
    </h2>
  );
}

import { ReactNode } from 'react';

interface H3Props {
  children: ReactNode;
  className?: string;
}

export function H3({ children, className = 'default-class' }: H3Props) {
  const id = typeof children === 'string' ? children : '';
  const safeId = id.replace(/\s+/g, '-').toLowerCase();

  return (
    <h3 id={safeId} className={className}>
      {' '}
      {children}
    </h3>
  );
}

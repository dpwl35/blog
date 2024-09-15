import { ReactNode } from 'react';

interface H4Props {
  children: ReactNode;
  className?: string;
}

export function H4({ children, className = 'default-class' }: H4Props) {
  const id = typeof children === 'string' ? children : '';
  const safeId = id.replace(/\s+/g, '-').toLowerCase();

  return (
    <h3 id={safeId} className={className}>
      {' '}
      {children}
    </h3>
  );
}

import { ReactNode } from 'react';

interface PProps {
  children: ReactNode;
  className?: string;
}

export function P({ children, className = 'post-p' }: PProps) {
  return <p className={className}>{children}</p>;
}

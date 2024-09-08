import { ReactNode } from 'react';

interface PProps {
  children: ReactNode;
}

export function P({ children }: PProps) {
  return <p>{children}</p>;
}

import { ReactNode } from 'react';

interface H1Props {
  children: ReactNode;
  className?: string;
}

export function H1({ children, className = 'post-h1' }: H1Props) {
  // 기본값 설정
  // ReactNode를 문자열로 변환
  const id = typeof children === 'string' ? children : '';

  // 공백과 특수문자를 안전하게 변환 (필요 시)
  const safeId = id.replace(/\s+/g, '-').toLowerCase();

  return (
    <h1 id={safeId} className={className}>
      {' '}
      {/* className 적용 */}
      {children}
    </h1>
  );
}

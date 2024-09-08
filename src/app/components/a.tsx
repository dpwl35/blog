import Link from 'next/link';
import { ReactNode, AnchorHTMLAttributes } from 'react';

interface AProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children: ReactNode;
  className?: string;
  href: string;
}

export function A({ children, className = 'dddd', href, ...props }: AProps) {
  if (href[0] === '#') {
    // 앵커 링크의 경우
    return (
      <a className={`link ${className}`} href={href} {...props}>
        {children}
      </a>
    );
  } else {
    // 외부 링크의 경우
    return (
      <Link href={href} passHref>
        {/* Link 내부의 <a> 태그에 className 적용 */}
        <a className={`link ${className}`} target='_blank' rel='noopener noreferrer' {...props}>
          {children}
        </a>
      </Link>
    );
  }
}

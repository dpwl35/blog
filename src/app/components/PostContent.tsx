'use client';

import dynamic from 'next/dynamic';
import { MDXRemoteSerializeResult } from 'next-mdx-remote';
import { useMDXComponents } from '../../../mdx-components';
import { ComponentType } from 'react';

// MDXRemote를 동적으로 임포트하되, SSR을 사용하도록 설정
const MDXRemote = dynamic(() => import('next-mdx-remote').then((mod) => mod.MDXRemote), {
  ssr: true, // 서버 사이드 렌더링에서 사용할 수 있도록 설정
});

interface PostContentProps {
  content: MDXRemoteSerializeResult;
}

export default function PostContent({ content }: PostContentProps) {
  const components: { [key: string]: ComponentType<any> } = useMDXComponents({});

  return (
    <div>
      {/* MDXRemote를 사용하여 콘텐츠를 렌더링 */}
      <MDXRemote {...content} components={components} />
    </div>
  );
}

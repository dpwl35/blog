'use client';

import dynamic from 'next/dynamic';
import { MDXRemoteSerializeResult } from 'next-mdx-remote';
import { useMDXComponents } from '../../../mdx-components';
import { ComponentType } from 'react';

// MDXRemote를 동적으로 임포트
const MDXRemote = dynamic(() => import('next-mdx-remote').then((mod) => mod.MDXRemote), {
  ssr: false, // 서버 사이드 렌더링에서 제외 (클라이언트 사이드에서만 렌더링)
});

interface PostContentProps {
  content: MDXRemoteSerializeResult;
}

export default function PostContent({ content }: PostContentProps) {
  // useMDXComponents 호출
  const components: { [key: string]: ComponentType<any> } = useMDXComponents({});

  return (
    <div>
      {/* 동적으로 불러온 MDXRemote 사용 */}
      <MDXRemote {...content} components={components} />
    </div>
  );
}

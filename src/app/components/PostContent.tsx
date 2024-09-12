'use client';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import { useMDXComponents } from '../../../mdx-components';
import { ComponentType } from 'react';

interface PostContentProps {
  content: MDXRemoteSerializeResult;
}

export default function PostContent({ content }: PostContentProps) {
  // useMDXComponents 호출
  const components: { [key: string]: ComponentType<any> } = useMDXComponents({});
  return (
    <div>
      <MDXRemote {...content} components={components} />{' '}
    </div>
  );
}

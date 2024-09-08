'use client';

import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
// import { useMDXComponents } from '../../mdx-components';

interface PostContentProps {
  content: MDXRemoteSerializeResult;
}

export default function PostContent({ content }: PostContentProps) {
  //const components = useMDXComponents({});

  return (
    <div>
      <MDXRemote {...content} />{' '}
    </div>
  );
}

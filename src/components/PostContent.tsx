'use client';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
interface PostContentProps {
  content: MDXRemoteSerializeResult;
}
export default function PostContent({ content }: PostContentProps) {
  return (
    <div>
      <MDXRemote {...content} />{' '}
    </div>
  );
}

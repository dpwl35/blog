import path from 'path';
import withMDX from '@next/mdx';

// @type {import('next').NextConfig}
const __dirname = path.dirname(new URL(import.meta.url).pathname);

// MDX 설정 추가
const mdxConfig = withMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});

const nextConfig = mdxConfig({
  sassOptions: {
    includePaths: [path.join(__dirname, 'src', 'styles')],
  },
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
});

export default nextConfig;

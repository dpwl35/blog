import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemoteSerializeResult } from 'next-mdx-remote';
import fs from 'fs';
import path from 'path';
import rehypePrettyCode from 'rehype-pretty-code';
import matter from 'gray-matter';
import { getHighlighter } from 'shiki';

let highlighter: any;

// 메타데이터 인터페이스 정의
interface Metadata {
  title?: string;
  description?: string;
  date?: string;
}

async function getShikiHighlighter() {
  if (!highlighter) {
    highlighter = await getHighlighter({
      themes: ['github-light'],
      langs: ['javascript', 'typescript', 'html', 'css'],
    });
  }
  return highlighter;
}

// 모든 .mdx 파일을 찾는 재귀 함수
function getMdxFileNamesInDirectory(directoryPath: string, baseDir: string): string[] {
  let result: string[] = [];
  const items = fs.readdirSync(directoryPath);

  items.forEach((item) => {
    const itemPath = path.join(directoryPath, item);
    if (fs.statSync(itemPath).isDirectory()) {
      result = result.concat(getMdxFileNamesInDirectory(itemPath, baseDir));
    } else if (path.extname(item) === '.mdx') {
      const relativePath = path.relative(baseDir, itemPath);
      result.push(relativePath.replace(/\\/g, '/'));
    }
  });

  return result;
}

// MDX 파일의 메타데이터를 가져오는 함수
export async function getMdxFileMetadata(category: string, slug: string): Promise<Metadata> {
  const mdxFilePath = path.join(process.cwd(), 'src', 'posts', category, `${slug}.mdx`);

  if (!fs.existsSync(mdxFilePath)) {
    return {};
  }

  const fileContent = await fs.promises.readFile(mdxFilePath, 'utf8');
  const { data: metadata } = matter(fileContent);

  return metadata;
}

// MDX 파일을 읽고 변환하는 함수
export async function getMdxFileContent(
  category: string,
  slug: string,
): Promise<{ content: MDXRemoteSerializeResult | null; metadata: Metadata }> {
  const mdxFilePath = path.join(process.cwd(), 'src', 'posts', category, `${slug}.mdx`);

  if (!fs.existsSync(mdxFilePath)) {
    return { content: null, metadata: {} };
  }

  const fileContent = await fs.promises.readFile(mdxFilePath, 'utf8');
  const { content } = matter(fileContent); // 메타데이터는 가져오지 않음

  const mdxSource = await serialize(content, {
    mdxOptions: {
      rehypePlugins: [
        [
          rehypePrettyCode,
          {
            highlighter: await getShikiHighlighter(),
            keepBackground: true,
            showLineNumbers: true,
          },
        ],
      ],
    },
  });

  return { content: mdxSource, metadata: await getMdxFileMetadata(category, slug) }; // 메타데이터는 따로 가져옴
}

// mdx 파일 조회
export async function getMdxFilesWithMetadata(
  category: string,
): Promise<{ slug: string; metadata: Metadata }[]> {
  const directoryPath = path.join(process.cwd(), 'src', 'posts', category);

  if (!fs.existsSync(directoryPath)) {
    console.log('디렉토리가 존재하지 않습니다.');
    return [];
  }

  const fileNames = getMdxFileNamesInDirectory(directoryPath, directoryPath);

  const filesWithMetadata = await Promise.all(
    fileNames.map(async (fileName) => {
      const slug = fileName.replace(/\.mdx$/, '');
      const metadata = await getMdxFileMetadata(category, slug); // 메타데이터만 가져옴
      return { slug, metadata };
    }),
  );

  return filesWithMetadata;
}

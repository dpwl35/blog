import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemoteSerializeResult } from 'next-mdx-remote';
import fs from 'fs';
import path from 'path';
import rehypePrettyCode from 'rehype-pretty-code';
import matter from 'gray-matter';
import { getHighlighter } from 'shiki';

let highlighter: any;

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

  // 디렉토리에서 파일 및 하위 디렉토리 목록 읽기
  const items = fs.readdirSync(directoryPath);

  items.forEach((item) => {
    const itemPath = path.join(directoryPath, item);

    if (fs.statSync(itemPath).isDirectory()) {
      // 하위 디렉토리가 있으면 재귀 호출
      result = result.concat(getMdxFileNamesInDirectory(itemPath, baseDir));
    } else if (path.extname(item) === '.mdx') {
      // 파일 확장자를 체크하여 .mdx 파일만 추가
      const relativePath = path.relative(baseDir, itemPath);
      result.push(relativePath.replace(/\\/g, '/')); // 윈도우 경로 구분자를 슬래시로 변환
    }
  });

  return result;
}

// 메타데이터 인터페이스 정의
interface Metadata {
  title?: string;
  description?: string;
  date?: string;
}

// 메타데이터 추출 함수
function extractMetadata(fileContent: string): Metadata {
  try {
    const { data } = matter(fileContent);
    return data as Metadata;
  } catch (error) {
    console.error('Error extracting metadata:', error);
    return {};
  }
}

// MDX 파일을 읽고 변환하는 함수
export async function getMdxFileContent(
  category: string,
  slug: string,
): Promise<{ content: MDXRemoteSerializeResult | null; metadata: Metadata }> {
  const mdxFilePath = path.join(process.cwd(), 'src', 'posts', category, `${slug}.mdx`);
  const mdFilePath = path.join(process.cwd(), 'src', 'posts', category, `${slug}.md`);

  let fileContent: string | null = null;

  // 1. 파일 읽기
  try {
    if (fs.existsSync(mdxFilePath)) {
      fileContent = await fs.promises.readFile(mdxFilePath, 'utf8');
    } else if (fs.existsSync(mdFilePath)) {
      fileContent = await fs.promises.readFile(mdFilePath, 'utf8');
    }
  } catch (error) {
    console.error(`File not found: ${mdxFilePath} or ${mdFilePath}`);
    return { content: null, metadata: {} };
  }

  if (!fileContent) {
    return { content: null, metadata: {} };
  }

  // 2. gray-matter로 메타데이터와 콘텐츠 분리
  const { content } = matter(fileContent);
  const metadata = extractMetadata(fileContent);

  // 3. MDX 콘텐츠를 HTML로 변환
  const mdxSource = await serialize(content, {
    mdxOptions: {
      rehypePlugins: [
        [
          rehypePrettyCode,
          {
            highlighter: await getShikiHighlighter(), // 하이라이터 인스턴스 사용
            keepBackground: true,
            showLineNumbers: true,
          },
        ],
      ],
    },
  });

  return { content: mdxSource, metadata };
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
      const { metadata } = await getMdxFileContent(category, slug);
      return { slug, metadata };
    }),
  );

  return filesWithMetadata;
}

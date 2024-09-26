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
export async function getMdxFileMetadata(
  category: string,
  year: string,
  slug: string,
): Promise<Metadata> {
  const mdxFilePath = path.join(process.cwd(), 'src', 'posts', category, year, `${slug}.mdx`);

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
  year: string,
  slug: string,
): Promise<{ content: any; metadata: Metadata }> {
  const filePath = path.join(process.cwd(), 'src', 'posts', category, year, `${slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    return { content: null, metadata: {} };
  }

  const fileContent = await fs.promises.readFile(filePath, 'utf8');
  const { content, data: metadata } = matter(fileContent); // 메타데이터와 내용 분리

  const mdxSource = await serialize(content, {
    mdxOptions: {
      rehypePlugins: [
        [
          rehypePrettyCode,
          {
            theme: 'github-light',
            keepBackground: true,
            showLineNumbers: true,
          },
        ],
      ],
    },
  });

  return { content: mdxSource, metadata }; // MDX 콘텐츠와 메타데이터 반환
}
// 특정 카테고리의 모든 연도 폴더에서 mdx 파일 조회
export async function getMdxFilesWithMetadata(
  category: string,
): Promise<{ slug: string; year: string; metadata: Metadata }[]> {
  const categoryPath = path.join(process.cwd(), 'src', 'posts', category);

  if (!fs.existsSync(categoryPath)) {
    console.log('디렉토리가 존재하지 않습니다.');
    return [];
  }

  // 연도 폴더를 탐색
  const years = fs.readdirSync(categoryPath).filter((year) => {
    return fs.statSync(path.join(categoryPath, year)).isDirectory(); // 연도 폴더만 선택
  });

  let filesWithMetadata: { slug: string; year: string; metadata: Metadata }[] = [];

  for (const year of years) {
    const yearPath = path.join(categoryPath, year);
    const fileNames = getMdxFileNamesInDirectory(yearPath, yearPath);

    const files = await Promise.all(
      fileNames.map(async (fileName) => {
        const slug = fileName.replace(/\.mdx$/, '');
        const metadata = await getMdxFileMetadata(category, year, slug); // 메타데이터 가져오기
        return { slug, year, metadata };
      }),
    );

    filesWithMetadata = filesWithMetadata.concat(files); // 모든 연도 파일 합치기
  }

  return filesWithMetadata;
}

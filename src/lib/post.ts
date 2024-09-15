import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemoteSerializeResult } from 'next-mdx-remote';
import fs from 'fs';
import path from 'path';
import rehypePrettyCode from 'rehype-pretty-code';

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

// .mdx 및 .md 파일의 내용 읽기
interface Metadata {
  title?: string;
  description?: string;
  date?: string;
}

export async function getMdxFileContent(
  category: string,
  slug: string,
): Promise<{ content: MDXRemoteSerializeResult | null; metadata: Metadata }> {
  const mdxFilePath = path.join(process.cwd(), 'src', 'posts', category, `${slug}.mdx`);
  const mdFilePath = path.join(process.cwd(), 'src', 'posts', category, `${slug}.md`);

  let fileContent: string | null = null;
  let metadata: Metadata = {};

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

  if (fileContent === null) {
    return { content: null, metadata: {} };
  }

  try {
    // 메타데이터 추출
    const metadataMatch = fileContent.match(/export\s+const\s+metadata\s*=\s*({[^}]*})/);
    if (metadataMatch) {
      const metadataString = metadataMatch[1];
      metadata = JSON.parse(metadataString) as Metadata;
    }

    // MDX 콘텐츠를 HTML로 변환하면서 rehypePrettyCode 적용
    const mdxSource = await serialize(fileContent, {
      mdxOptions: {
        rehypePlugins: [
          [
            rehypePrettyCode,
            {
              theme: 'one-dark-pro',
              keepBackground: true,
            },
          ],
        ],
      },
    });

    return { content: mdxSource, metadata };
  } catch (error) {
    console.error('Error processing MDX content:', error);
    return { content: null, metadata: {} };
  }
}

// 특정 카테고리의 모든 .mdx 파일 목록과 메타데이터를 가져옴
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

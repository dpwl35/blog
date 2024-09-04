import fs from 'fs';
import path from 'path';

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
      // .mdx 파일의 경로를 baseDir을 기준으로 상대경로로 변환하여 추가
      const relativePath = path.relative(baseDir, itemPath);
      result.push(relativePath.replace(/\\/g, '/')); // 윈도우 경로 구분자를 슬래시로 변환
    }
  });

  return result;
}

// .mdx 및 .md 파일의 내용 읽기
export function getMdxFileContent(category: string, slug: string): string | null {
  const mdxFilePath = path.join(process.cwd(), 'src', 'posts', category, `${slug}.mdx`);
  const mdFilePath = path.join(process.cwd(), 'src', 'posts', category, `${slug}.md`);

  if (fs.existsSync(mdxFilePath)) {
    return fs.readFileSync(mdxFilePath, 'utf8');
  } else if (fs.existsSync(mdFilePath)) {
    return fs.readFileSync(mdFilePath, 'utf8');
  } else {
    console.error(`File not found: ${mdxFilePath} or ${mdFilePath}`);
    return null;
  }
}

// 특정 카테고리의 모든 .mdx 파일 목록을 가져옴
export function getMdxFiles(category: string): string[] {
  const directoryPath = path.join(process.cwd(), 'src', 'posts', category);
  console.log(`디렉토리 경로: ${directoryPath}`);

  if (!fs.existsSync(directoryPath)) {
    console.log('디렉토리가 존재하지 않습니다.');
    return [];
  }

  // .mdx 파일의 파일 이름만 찾기
  const mdxFiles = getMdxFileNamesInDirectory(directoryPath, directoryPath);
  console.log('읽어온 MDX 파일 이름 목록:', mdxFiles);
  return mdxFiles;
}

import fs from 'fs';
import path from 'path';

// .mdx 파일을 검색 파일 이름만 반환
function getMdxFileNamesInDirectory(directoryPath: string): string[] {
  let result: string[] = [];

  // 디렉토리에서 파일 및 하위 디렉토리 목록 읽기
  const items = fs.readdirSync(directoryPath);

  items.forEach((item) => {
    const itemPath = path.join(directoryPath, item);

    if (fs.statSync(itemPath).isDirectory()) {
      // 하위 디렉토리가 있으면 재귀 호출
      result = result.concat(getMdxFileNamesInDirectory(itemPath));
    } else if (item.endsWith('.mdx')) {
      // .mdx 파일의 파일 이름만 추가
      result.push(path.basename(itemPath));
    }
  });

  return result;
}

export function getMdxFiles(category: string): string[] {
  const directoryPath = path.join(process.cwd(), 'src', 'posts', category);
  console.log(`디렉토리 경로: ${directoryPath}`);

  if (!fs.existsSync(directoryPath)) {
    console.log('디렉토리가 존재하지 않습니다.');
    return [];
  }

  // .mdx 파일의 파일 이름만 찾기
  const mdxFiles = getMdxFileNamesInDirectory(directoryPath);
  console.log('읽어온 MDX 파일 이름 목록:', mdxFiles);
  return mdxFiles;
}

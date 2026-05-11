import fs from "fs";
import path from "path";

type Metadata = {
  title: string;
  publishedAt: string;
  summary: string;
  image?: string;
};

type Heading = {
  depth: number;
  text: string;
  id: string;
};

//메타 데이터 객체로 변환
function parseFrontmatter(fileContent: string) {
  let frontmatterRegex = /---\s*([\s\S]*?)\s*---/;
  let match = frontmatterRegex.exec(fileContent);
  let frontMatterBlock = match![1];
  let content = fileContent.replace(frontmatterRegex, "").trim();
  let frontMatterLines = frontMatterBlock.trim().split("\n");
  let metadata: Partial<Metadata> = {};

  frontMatterLines.forEach((line) => {
    let [key, ...valueArr] = line.split(": ");
    let value = valueArr.join(": ").trim();
    value = value.replace(/^['"](.*)['"]$/, "$1"); // Remove quotes
    metadata[key.trim() as keyof Metadata] = value;
  });

  return { metadata: metadata as Metadata, content };
}

//해당 폴더 안의 .mdx 파일 가져오기
function getMDXFiles(dir) {
  return fs.readdirSync(dir).filter((file) => path.extname(file) === ".mdx");
}

//파일을 string으로 읽어서  parseFrontmatter()로 넘겨줌
function readMDXFile(filePath) {
  let rawContent = fs.readFileSync(filePath, "utf-8");
  return parseFrontmatter(rawContent);
}

// 목차 데이처 뽑기
function getHeadingsFromContent(content: string): Heading[] {
  const headingRegex = /^(#{1,6})\s+(.*)$/gm;
  const headings: Heading[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const depth = match[1].length;
    const text = match[2].trim();

    const id = text
      .toLowerCase()
      .trim()
      .replace(/&/g, "-and-")
      .replace(/[^\w가-힣\s\-]+/g, "")
      .replace(/\s{2,}/g, " ")
      .replace(/\s+/g, "-");

    headings.push({ depth, text, id });
  }

  return headings;
}

//전체 .mdx 파일에서 slug, metadata, content를 만들고 배열로 리턴
function getMDXData(dir) {
  let mdxFiles = getMDXFiles(dir);
  return mdxFiles.map((file) => {
    let { metadata, content } = readMDXFile(path.join(dir, file));
    let slug = path.basename(file, path.extname(file));
    let headings = getHeadingsFromContent(content);

    return {
      metadata,
      slug,
      content,
      headings,
    };
  });
}

// "posts" 폴더 기준으로
type BlogPost = ReturnType<typeof getMDXData>[number];

let blogPostsCache: BlogPost[] | null = null;

export function getBlogPosts(): BlogPost[] {
  // Vercel 환경에서 서버가 여러번 호출될 때, 매 요청마다 fs sync/MDX 파싱이 반복되면 느려질 수 있어 캐싱합니다.
  if (blogPostsCache) return blogPostsCache;

  blogPostsCache = getMDXData(path.join(process.cwd(), "posts"));
  return blogPostsCache;
}

// 날짜 포맷팅
export function formatDate(date: string, includeRelative = false) {
  let currentDate = new Date();
  if (!date.includes("T")) {
    date = `${date}T00:00:00`;
  }
  let targetDate = new Date(date);

  let yearsAgo = currentDate.getFullYear() - targetDate.getFullYear();
  let monthsAgo = currentDate.getMonth() - targetDate.getMonth();
  let daysAgo = currentDate.getDate() - targetDate.getDate();

  let formattedDate = "";

  if (yearsAgo > 0) {
    formattedDate = `${yearsAgo}y ago`;
  } else if (monthsAgo > 0) {
    formattedDate = `${monthsAgo}mo ago`;
  } else if (daysAgo > 0) {
    formattedDate = `${daysAgo}d ago`;
  } else {
    formattedDate = "Today";
  }

  let fullDate = targetDate.toLocaleString("en-us", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  if (!includeRelative) {
    return fullDate;
  }

  return `${fullDate} (${formattedDate})`;
}

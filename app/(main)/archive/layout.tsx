import fs from "fs";
import path from "path";
import Link from "next/link";

export default function ArchiveLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pageDir = path.join(process.cwd(), "lab");

  // lab/ 내부의 폴더들만 가져오기
  const dirs = fs
    .readdirSync(pageDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  return (
    <section className="post-section">
      <ul className="post-list">
      <li className="post-item">
  <Link
    href="/lab/room"
    className="post-item_link"
    target="_blank"
    rel="noopener noreferrer"
  >
    room 새창
  </Link>
</li>
        {dirs.map((slug) => (
          <li key={slug} className="post-item">
            <Link href={`/archive/${slug}`} className="post-item_link" >
              {slug}
            </Link>
          </li>
        ))}
      </ul>
      {children}
    </section>
  );
}

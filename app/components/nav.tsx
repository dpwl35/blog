import Link from "next/link";
import ArrowIcon from "./arrowIcon";

const navItems = {
  "/blog": {
    name: "blog",
  },
  "/archive": {
    name: "archive",
  },
};

export function Navbar() {
  return (
    <div className="category">
      <nav className="category-area" id="nav">
        <Link className="category-item" href="/">
          <h1>*</h1>
        </Link>
        {Object.entries(navItems).map(([path, { name }]) => {
          return (
            <Link key={path} href={path} className="category-item">
              {name}
            </Link>
          );
        })}
        <Link
          className="category-item"
          href="https://dpwl35.github.io/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span>Notes</span>
          <ArrowIcon />
        </Link>
      </nav>
    </div>
  );
}

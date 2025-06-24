import Link from "next/link";

const navItems = {
  "/blog": {
    name: "Note",
  },
  "/archive": {
    name: "archive",
  },
};

export function Navbar() {
  return (
    <div className="category">
      <nav className="category-area" id="nav">
        <Link className="category-item active" href="/">
          *
        </Link>
        {Object.entries(navItems).map(([path, { name }]) => {
          return (
            <Link key={path} href={path} className="category-item">
              {name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

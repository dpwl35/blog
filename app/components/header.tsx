import Link from "next/link";
import { ThemeSwitcher } from "./theme-switcher";

const navList = [
  { name: "Home", href: "/" },
  { name: "Post", href: "/Post" },
];

export function Header() {
  return (
    <header className="header">
      <Link href="/">
        <h1>Blog</h1>
      </Link>
      <nav className="header-nav">
        <ThemeSwitcher />
        <Link className="header-nav-link" href="/about">
          about
        </Link>
      </nav>
    </header>
  );
}

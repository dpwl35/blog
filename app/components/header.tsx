import Link from "next/link";
import { ThemeSwitcher } from "./theme-switcher";
import { Navbar } from "./nav";

const navList = [
  { name: "Home", href: "/" },
  { name: "Post", href: "/Post" },
];

export function Header() {
  return (
    <header className="header">
      <Navbar />
      <nav className="header-nav">
        <ThemeSwitcher />
        <Link className="header-nav-link" href="/about">
          about
        </Link>
      </nav>
    </header>
  );
}

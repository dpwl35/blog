import ArrowIcon from "./arrowIcon";

export default function Footer() {
  return (
    <footer>
      <ul>
        <li>
          <a
            rel="noopener noreferrer"
            target="_blank"
            href="https://github.com/dpwl35/blog"
          >
            <p>github</p>
            <ArrowIcon />
          </a>
        </li>
      </ul>
      <p>© {new Date().getFullYear()} dpwl35</p>
    </footer>
  );
}

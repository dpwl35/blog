type Heading = {
  depth: number;
  text: string;
  id: string;
};

type TocProps = {
  headings: Heading[];
};

export function Toc({ headings }: TocProps) {
  return (
    <nav className="toc">
      <ul className="toc-container">
        {headings.map(({ depth, text, id }) => (
          <li key={id} className="toc-list">
            <a href={`#${id}`} className="toc-link" data-depth={depth}>
              {text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

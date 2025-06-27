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
      <ul>
        {headings.map(({ depth, text, id }) => (
          <li key={id} style={{ marginLeft: (depth - 2) * 16 }}>
            <a
              href={`#${id}`}
              className="text-sm text-blue-600 hover:underline"
            >
              {text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

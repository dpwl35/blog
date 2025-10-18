import Link from "next/link";
import Image from "next/image";
import { MDXRemote } from "next-mdx-remote/rsc";
import { highlight } from "sugar-high";
import React from "react";

function Table({ data }) {
  let headers = data.headers.map((header, index) => (
    <th key={index}>{header}</th>
  ));
  let rows = data.rows.map((row, index) => (
    <tr key={index}>
      {row.map((cell, cellIndex) => (
        <td key={cellIndex}>{cell}</td>
      ))}
    </tr>
  ));

  return (
    <table>
      <thead>
        <tr>{headers}</tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

function CustomLink(props) {
  let href = props.href;

  if (href.startsWith("/")) {
    return (
      <Link href={href} {...props}>
        {props.children}
      </Link>
    );
  }

  if (href.startsWith("#")) {
    return <a {...props} />;
  }

  return (
    <a
      className="external-link"
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    />
  );
}

function RoundedImage(props) {
  return <Image alt={props.alt} className="rounded-lg" {...props} />;
}

function Code({ children, className, ...props }) {
  // 인라인 코드 처리
  if (!className) {
    return <code {...props}>{children}</code>;
  }

  // 코드 블록 처리
  const codeHTML = highlight(children);
  return (
    <code
      className={className}
      dangerouslySetInnerHTML={{ __html: codeHTML }}
      {...props}
    />
  );
}

function Pre(props) {
  return <pre className="post-code">{props.children}</pre>;
}

function slugify(str: string) {
  return str
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\./g, "")
    .replace(/\s+/g, "-")
    .replace(/&/g, "-and-")
    .replace(/[^\w\-]/g, "");
}

function createHeading(level) {
  const Heading = ({ children }) => {
    const slug = slugify(children);
    return React.createElement(`h${level}`, { id: slug }, children);
  };

  Heading.displayName = `Heading${level}`;
  return Heading;
}

let components = {
  h1: createHeading(1),
  h2: createHeading(2),
  h3: createHeading(3),
  h4: createHeading(4),
  h5: createHeading(5),
  h6: createHeading(6),
  Image: RoundedImage,
  a: CustomLink,
  code: Code,
  pre: Pre,
  Table,
};

export function CustomMDX(props) {
  return (
    <MDXRemote
      {...props}
      components={{ ...components, ...(props.components || {}) }}
    />
  );
}

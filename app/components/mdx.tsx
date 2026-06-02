import Link from 'next/link';
import Image from 'next/image';
import { MDXRemote } from 'next-mdx-remote/rsc';
import rehypePrettyCode from 'rehype-pretty-code';
import React from 'react';
import {
  ButtonScaleDemo,
  EasingDemo,
  SpeedDemo,
  BlurDemo,
  ListHoverDemo,
} from '../components/animationDemos';

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

  if (href.startsWith('/')) {
    return (
      <Link href={href} {...props}>
        {props.children}
      </Link>
    );
  }

  if (href.startsWith('#')) {
    return <a {...props} />;
  }

  return (
    <a
      className='external-link'
      target='_blank'
      rel='noopener noreferrer'
      {...props}
    />
  );
}

function RoundedImage(props) {
  return <Image alt={props.alt} className='rounded-lg' {...props} />;
}

function slugify(str: unknown): string {
  let text = '';

  if (typeof str === 'string') {
    text = str;
  } else if (Array.isArray(str)) {
    text = str
      .map((s) =>
        typeof s === 'string' ? s : (s as any)?.props?.children || '',
      )
      .join('');
  } else if (str && typeof str === 'object') {
    text = (str as any)?.props?.children || '';
  }

  return text
    .toLowerCase()
    .trim()
    .replace(/\./g, '')
    .replace(/\s+/g, '-')
    .replace(/&/g, '-and-')
    .replace(/[^\w가-힣\-]/g, '');
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
  Table,
  ButtonScaleDemo,
  EasingDemo,
  SpeedDemo,
  BlurDemo,
  ListHoverDemo,
};
export function CustomMDX(props) {
  return (
    <MDXRemote
      {...props}
      components={{ ...components, ...(props.components || {}) }}
      options={{
        mdxOptions: {
          rehypePlugins: [
            [
              rehypePrettyCode,
              {
                theme: {
                  dark: 'github-dark-default',
                  light: 'github-light',
                },
              },
            ],
          ],
        },
      }}
    />
  );
}

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
  ScrollAnimationDemo,
} from '../components/animationDemos';
import ArrowIcon from './arrowIcon';
import { slugify } from 'app/(main)/blog/utils';

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
    >
      <span>{props.children}</span>
      <ArrowIcon />
    </a>
  );
}

function RoundedImage(props) {
  return <Image alt={props.alt} className='rounded-lg' {...props} />;
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
  ScrollAnimationDemo,
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

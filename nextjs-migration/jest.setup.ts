import '@testing-library/jest-dom';
import React from 'react';

global.React = React;

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
  })),
  usePathname: jest.fn(() => '/'),
  useSearchParams: jest.fn(() => new URLSearchParams()),
  redirect: jest.fn(),
  notFound: jest.fn(),
}));

jest.mock('next/image', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: function NextImage({ src, alt, ...props }: { src: string, alt: string, [key: string]: any }) {
      return React.createElement('img', { src, alt, ...props });
    }
  };
});

jest.mock('marked', () => ({
  marked: {
    parse: jest.fn().mockImplementation((markdown) => {
      let html = markdown;
      if (markdown.startsWith('# ')) {
        const headerText = markdown.substring(2).split('\n')[0];
        html = `<h1>${headerText}</h1>\n${markdown.substring(2 + headerText.length)}`;
      }
      
      html = html.replace(/\n\n(.*?)(?=\n\n|$)/g, (_: string, p1: string) => `<p>${p1}</p>`);
      
      return Promise.resolve(html);
    }),
  },
}));

jest.mock('isomorphic-dompurify', () => ({
  __esModule: true,
  default: {
    sanitize: jest.fn((html: string) => html),
  },
}));

export interface WithContext<T = any> {
  '@context': string;
  '@type': string;
}

export interface Blog extends WithContext {
  '@type': 'Blog';
  name: string;
  description: string;
  url: string;
}

export interface JsonLdProps {
  children: WithContext;
}

import React from 'react';

export function JsonLd({ children }: JsonLdProps) {
  return React.createElement('script', {
    type: 'application/ld+json',
    dangerouslySetInnerHTML: { __html: JSON.stringify(children) }
  });
}
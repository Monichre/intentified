import type { Metadata } from 'next';

export interface MetadataOptions {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  noIndex?: boolean;
}

export function createMetadata(options: MetadataOptions = {}): Metadata {
  const {
    title = 'Intentified',
    description = 'AI-powered business intelligence platform',
    image = '/opengraph-image.png',
    url = '/',
    noIndex = false,
  } = options;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [image],
      url,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
    robots: noIndex ? 'noindex,nofollow' : 'index,follow',
  };
}
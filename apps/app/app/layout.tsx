
import './styles.css';
import { DesignSystemProvider } from '@repo/design-system';
import { fonts } from '@repo/design-system/lib/fonts';

import type { ReactNode } from 'react';

type RootLayoutProperties = {
  readonly children: ReactNode;
};

const RootLayout = ({ children }: RootLayoutProperties) => (
  <html lang="en" className={fonts} suppressHydrationWarning>
    <body>
      <DesignSystemProvider
        privacyUrl={new URL(
              '/legal/privacy',
              process.env.NEXT_PUBLIC_WEB_URL
            ).toString()}
            termsUrl={new URL('/legal/terms', process.env.NEXT_PUBLIC_WEB_URL).toString()}
            helpUrl={process.env.NEXT_PUBLIC_DOCS_URL}
      >
        {children}
      </DesignSystemProvider>
      
    </body>
  </html>
);

export default RootLayout;

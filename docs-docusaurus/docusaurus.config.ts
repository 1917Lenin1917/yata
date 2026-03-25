import type { Config } from '@docusaurus/types';

const config: Config = {
  title: 'YATA Backend Docs',
  tagline: 'Notion-like tree architecture',
  favicon: 'img/favicon.ico',
  url: 'http://localhost',
  baseUrl: '/',
  organizationName: 'yata',
  projectName: 'yata',
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',
  i18n: {
    defaultLocale: 'ru',
    locales: ['ru'],
  },
  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: '/',
          sidebarPath: './sidebars.ts',
        },
        blog: false,
        pages: false,
      },
    ],
  ],
};

export default config;

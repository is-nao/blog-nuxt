import { logo, ui } from './constants/icon'
import * as component from './utils/tv'

export default defineAppConfig({
  title: 'Nuxt Blog',
  description: 'A Nuxt template to build your full-stack application on the edge.',
  header: {
    links: [
      {
        label: 'Github',
        tooltip: 'Open on GitHub',
        to: 'https://github.com/is-nao',
        icon: 'i-simple-icons-github',
      },
      {
        label: 'X',
        tooltip: 'Open on X',
        to: 'https://x.com/_is_nao',
        icon: 'i-simple-icons-x',
      },
    ],
  },
  template: {
    readingTime: 'この記事は約 {readingTime} 分で読めます',
  },
  ui: {
    colors: {
      primary: 'teal',
    },
    icons: ui,
    prose: {
      codeIcon: logo,
      pre: {
        variants: {
          mermaid: {
            true: {
              base: 'mermaid',
            },
          },
        },
      },
    },
  },
  component,
})

module.exports = {
  title: 'Ethan Anderson',
  description: 'Ethan Anderson\'s Résumé (Software Engineer) and Blog',
  themeConfig: {
    lastUpdated: 'Last Updated',
    logo: '/eanderson.jpg',
    displayAllHeaders: true,
    nav: [
      { text: 'About', link: '/#about-me' },
      { text: 'Résumé', link: '/#resume' },
      { text: 'Contact', link: '/#contact' },
      { text: 'Blog', link: '/blog/' },
      { text: 'Archive', link: '/archive/' }
    ],
    smoothScroll: true,
    algolia: {
      apiKey: '692c0488f1e443e078cfb2511ab8c996',
      appId: '2SM2BJK0PC',
      indexName: 'ethanaa'
    },
    pageSize: 5,
	  startPage: 0
  },
  plugins: [
    [
      '@vuepress/google-analytics',
      {
        'ga': 'UA-137350132-2' // UA-00000000-0
      }
    ],
    ['vuepress-plugin-code-copy', {
      'color': '#E37372'
    }],
    ['vuepress-plugin-reading-time'],
    ['@vuepress/back-to-top'],
    ['@vuepress/medium-zoom'],
    ['seo',
     {
       'author': (_, $site) => 'Ethan Anderson',
       'image': ($page, $site) => 'https://ethanaa.com/eanderson.jpg',
       'description': $page => $page.frontmatter.description || $page.frontmatter.excerpt
     }
    ],
    ['disqus']
  ],
  markdown: {
    linkify: true,
    extendMarkdown: md => {
      md.use(require('markdown-it-imsize'));
    },
  }
}

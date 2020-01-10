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
      { text: 'Blog', link: '/blog/' }
    ],
    sidebar: [
      ['/blog/', 'Blog'],
      ['/', 'Résumé']
    ],
    smoothScroll: true,
    algolia: {
      apiKey: '692c0488f1e443e078cfb2511ab8c996',
      appId: '2SM2BJK0PC',
      indexName: 'ethanaa'
    }
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
    ['@vuepress/back-to-top'],
    ['@vuepress/medium-zoom'],
    ['seo',
     {
       'author': (_, $site) => 'Ethan Anderson',
       'tags': $page => ['Spring', 'Spring Boot', 'Java', 'AWS',
                         'Software Engineer', 'MN', 'Minnesota',
                         'Resume', 'Vue.js', 'REST', 'Postgres',
                         'Consultant', 'JavaScript', 'S3', 'Vivial'],
       'image': ($page, $site) => 'https://ethanaa.com/eanderson.jpg'
     }
    ]
  ],
  markdown: {
    linkify: true,
    extendMarkdown: md => {
      md.use(require('markdown-it-imsize'));
    },
  }
}

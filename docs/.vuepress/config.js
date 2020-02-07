const extendsNetworks = {
  linkedin: {
    sharer:
      'https://www.linkedin.com/shareArticle?mini=true&url=@url&title=@title&summary=@description',
    type: 'popup',
    color: '#1786b1',
    icon:
      '<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M910.336 0H113.664A114.005333 114.005333 0 0 0 0 113.664v796.672A114.005333 114.005333 0 0 0 113.664 1024h796.672A114.005333 114.005333 0 0 0 1024 910.336V113.664A114.005333 114.005333 0 0 0 910.336 0zM352.256 796.330667H207.189333V375.466667h145.066667z m-72.021333-477.866667a77.824 77.824 0 0 1-81.237334-74.069333A77.824 77.824 0 0 1 280.234667 170.666667a77.824 77.824 0 0 1 81.237333 73.728 77.824 77.824 0 0 1-81.237333 73.386666z m582.314666 477.866667H716.8v-227.669334c0-46.762667-18.432-93.525333-73.045333-93.525333a84.992 84.992 0 0 0-81.237334 94.549333v226.304h-140.629333V375.466667h141.653333v60.757333a155.989333 155.989333 0 0 1 136.533334-71.338667c60.416 0 163.498667 30.378667 163.498666 194.901334z" /></svg>',
  }
}

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
    [
      'vuepress-plugin-container',
      {
          type: 'right',
          defaultTitle: '',
      },
    ],
    [
      'vuepress-plugin-container',
      {
          type: 'quote',
          before: info => `<div class="quote"><p class="title">${info}</p>`,
          after: '</div>',
      },
    ],
    [
      'vuepress-plugin-container',
      {
          type: 'quote-warn',
          before: info => `<div class="quote-warn"><p class="title">${info}</p>`,
          after: '</div>',
      },
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
    ['disqus'],
    ['social-share',
     {
       'networks': ['twitter', 'linkedin', 'reddit'],
       extendsNetworks
     }
    ],
    ['reading-progress']
  ],
  markdown: {
    linkify: true,
    lineNumbers: true,
    extendMarkdown: md => {
      md.use(require('markdown-it-imsize'));
    },
  }
}

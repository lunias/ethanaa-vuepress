module.exports = {
  title: 'Ethan Anderson',
  description: 'Personal Website of Ethan Anderson',
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
    smoothScroll: true
  }
}

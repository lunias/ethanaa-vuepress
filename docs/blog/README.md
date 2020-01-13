---
image: /eanderson.jpg
footer: MIT Licensed | Copyright © 2019-present Ethan Anderson
title: Blog
pageClass: custom-page-class
description: |
  Personal blog of Ethan Anderson. I'm a Software Engineer living in Minnesota. 
  I write about my projects which span a variety of technologies including; Java, JavaScript, Spring Boot, JavaFX, AWS, etc.
noGlobalSocialShare: true
---

<BlogPostList 
  :pages="$site.pages" 
  :page-size="$site.themeConfig.pageSize" 
  :start-page="$site.themeConfig.startPage" 
/>

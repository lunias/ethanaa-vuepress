---
home: false
heroImage: /eanderson.jpg
heroText: Ethan Anderson
tagline: Software Engineer
actionText: View Resume →
actionLink: /#resume
features:
- title: Experienced
  details: Over a decade of experience building and maintaining applications for small and large clients alike.
- title: Effective
  details: Full stack engineer capable of working on any subsystem involved in the delivery of the application.
- title: Excited
  details: Continual learner with a standout history of producing high quality deliverables.
footer: MIT Licensed | Copyright © 2019-present Ethan Anderson
pageClass: custom-page-class
---

# 1/8/2020

## Conversion to a Static Site with VuePress and AWS S3

I've been working a lot lately with AWS and I figured it was high time that I
leveraged some of that newfound kowledge to improve my own website. I set out
with 3 goals in mind:

1. Reduce my monthly AWS bill
2. Improve performance
3. Create a better experience for both the user as well as the developer (me :smile:)

First is to address my current cost of operating a site which is quite simple in
scope. As of last November, I'm clearly paying too much considering other
hosting options for a personal résumé and blog.

![Cost Reports November](./img/cost_reports_november.png)

I had originally chosen to implement
[ethanaa.com](https://github.com/lunias/ethanaa) as a [Spring
Boot](https://spring.io/projects/spring-boot) /
[Angular.js](https://angular.io/) application and serve it using [AWS Elastic
Beanstalk](https://aws.amazon.com/elasticbeanstalk/). This suited my needs
because I had initially planned on adding more interesting server side code
(users, authentication, apis, etc.) to the app, but alas I never did. So it's
time to bring the site into better alignment with its newly solidified purpose:
**an easy to maintain and performance optimized personal web profile**.

With the cost benefits in mind, I decided to try my hand at a static site
conversion so that I could serve the whole website out of an S3 bucket.

[According to
Amazon](https://aws.amazon.com/getting-started/projects/host-static-website/)
the total cost of hosting your site in this fashion will be $1-3/month. Looking
at the S3 pricing seems to confirm that assertion for my case.

- GET Requests cost $0.004 per 10,000 requests
- Data Transfer Out costs $0.090 per GB (up to 10 TB / month)

Sounds good to me :ok_hand:. Let's get started!

### VuePress

![VuePress](./img/vuepress.png =170x170)

Of all the modern JavaScript frameworks available, I am most experienced with
[Vue.js](https://vuejs.org/). I looked at some options and ultimately chose
[VuePress](https://vuepress.vuejs.org/) as my static site generator.

VuePress allows me to theme the site using the familiar Vue.js and generate
pre-rendered static HTML which is performant and SEO friendly. It also provides
a number of excellent plugins, which means less code for me to write in order to
deliver the experience that I'm after.

Including...

- [Back-to-top plugin](https://v1.vuepress.vuejs.org/plugin/official/plugin-back-to-top.html)
- [medium-zoom plugin](https://v1.vuepress.vuejs.org/plugin/official/plugin-medium-zoom.html)
- [Vuepress Plugin SEO](https://github.com/lorisleiva/vuepress-plugin-seo)
- [Google analytics plugin](https://v1.vuepress.vuejs.org/plugin/official/plugin-google-analytics.html)

Editing content on the site is greatly simplified by a build step which compiles
Markdown files (which allow embedded Vue usage) into HTML.

Building is as simple as `yarn docs:build`

### Amazon S3

![S3](./img/aws-s3.svg =170x120)

The first step to using S3 is to create a bucket. I named it after my domain
name (with the www subdomain) specifically to make DNS resolution work properly
with GoDaddy, but since migrating to using CloudFront and Route53 I no longer
believe this to be a requirement.

![S3 Bucket](./img/bucket.png)

The root of the bucket will contain the files output by `yarn docs:build`. They
can be found in the `docs/.vuepress/dist` directory.

Next is to enable static website hosting. The index document should be
`index.html` and the error document can be set if you have one.

![S3 Static Website Hosting](./img/static_website_hosting.png)

Now turn off "Block all public access" in the Permissions tab and add the below
Bucket Policy and CORS Configuration.

![S3 Public Access](./img/public_access.png)

#### Bucket Policy

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::www.ethanaa.com/*"
        }
    ]
}
```

#### CORS Configuration

```xml
<?xml version="1.0" encoding="UTF-8"?>
<CORSConfiguration xmlns="http://s3.amazonaws.com/doc/2006-03-01/">
<CORSRule>
    <AllowedOrigin>*</AllowedOrigin>
    <AllowedMethod>GET</AllowedMethod>
    <AllowedMethod>HEAD</AllowedMethod>
    <MaxAgeSeconds>3000</MaxAgeSeconds>
    <AllowedHeader>Content-Length</AllowedHeader>
</CORSRule>
</CORSConfiguration>
```

*This CORS config exists primarily to allow the `Content-Length` header to be
passed to CloudFront so that it will perform compression.*

### Amazon Certificate Manager

![Certificate Manager](./img/aws-certificate-manager.svg =170x120)

[ACM](https://aws.amazon.com/certificate-manager/) will provide us a free public
certificate for our domain name so that we can use HTTPS.

Make sure to request a certificate which covers all required subdomains i.e.
`ethanaa.com` as well as `www.ethanaa.com`.

I used DNS validation and the process of adding the CNAME records was straight
forward with both GoDaddy and subsequently, Route53.

### Amazon CloudFront

![CloudFront](./img/aws-cloudfront.svg =170x120)

[CloudFront](https://aws.amazon.com/cloudfront/) acts as the content delivery
network (CDN) so that the site retains performance no matter where in the world
its being accessed from. It also has the added benefit of DDoS mitigation.

Create a distribution. The "Origin Domain Name" should be copied from the S3
bucket's static website hosting configuration. The desired URL is labeled
"Endpoint".

Redirect HTTP to HTTPS, configure TTL, "Compress Objects Automatically", choose
"Custom SSL Certificate" and select the previously created public certificate.

### Amazon Route53

![Route53](./img/aws-route53.svg =170x120)

[Route53](https://aws.amazon.com/route53/) is used as the Domain Name System
(DNS). Domain name subscriptions often come with DNS capabilities, but due to
the limitations I experienced with GoDaddy (can only point an A record at an IP
address) Route53 was the obvious choice. It's integrated into AWS and you can
point an A record to a CloudFront distribution.

- Create an A record with an alias targeting the CloudFront domain name.
- Create a CNAME record with the name `www` and value `ethanaa.com`.

Given some time for all of changes to propogate, the new static site is now
available over HTTPS with a valid certificate (both at the naked domain and the
www subdomain) and HTTP requests are automatically upgraded to HTTPS.

![Mobile Google PageSpeed Insights](./img/page_speed_mobile.png)

[Google PageSpeed
Insights](https://developers.google.com/speed/pagespeed/insights/) confirms
excellent mobile and desktop performance with consistent scores in the high 90s
for mobile and often 100 for desktop.

![Desktop Google PageSpeed Insights](./img/page_speed_desktop.png)

Updates to come when I find out how much it's costing me! :dollar:

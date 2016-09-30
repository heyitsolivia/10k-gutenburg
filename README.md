Gutenburg Collection in 10 K
============================
A https://a-k-apart.com/ project that provides a progressively enhanced
reading experience for select Gutenburg classics.

![Alt text](/screenshot3.jpg?raw=true "Gutenburg Collection preview")

Deployment on Azure
-------------------
Simply clone the repo and push to your azure git branch.
```
git clone git@github.com:heyitsolivia/10k-gutenburg.git
cd 10k-gutenburg
git remote add azure <your azure git url>
git push azure master
```

Or see it live: https://10k-gutenberg.azurewebsites.net/

Project Details
---------------
#### Books
In order to deliver pages of books under 10 KB in a performant manner:
* Download raw book text from https://github.com/GITenberg
* Run through an HTML cleaner and some regex replacements to remove extraneous elements
* Process using a custom script to partition the book into ~6 KB uncompressed chunks
  * Partition boundaries use paragraph start/end

#### Performance
* Assets are gziped and minified hosted on Amazon S3 and delivered through Amazon CloudFront
* JS file is asynchronously loaded
* Webfont lazy loaded
* Images are optimized and lazy loaded 

#### Progressive Enhancements
* Designed and usable with no js, no css in mind (plain semantic html)
  * Simple responsive grid makes book selection easy on various width sizes
* Server side book marking (using sessions) allows all clients to retain their page in a book
* Infinite scrolling - Enhanced reading experience using JS
  * compatible with server side book marking
* Turbolinks - increased client experience through <body> replacement

Dependencies
------------
#### Install
* `npm install`

Development
-----------
Start server and watchers:
* `npm run dev`

To deploy to https://10k-gutenberg.azurewebsites.net/, you need to have
the correct permissions setup on your machine. This is needed since
assets are published to S3 and served by Cloudfront.

```
npm run build
git commit -m 'Building for release'
git push azure master
```

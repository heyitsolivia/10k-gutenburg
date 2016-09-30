Gutenburg Collection in 10 K
============================
A https://a-k-apart.com/ project that provides a progressively enhanced
reading experience for select Gutenburg classics.

![Alt text](/screenshot.png?raw=true "Gutenburg Screenshot")

Deployment on Azure
-------------------
Simply clone the repo and push to your azure git branch.
* `git clone git@github.com:heyitsolivia/10k-gutenburg.git`
* `cd 10k-gutenburg`
* `git remote add azure <your azure git url>`
* `git push azure master`

Details
-------
#### Performance
* Gzip/minified assets
* Source books have been processed offline to ensure each page is below 6k without gzip compression.
* Lazy loading of JS and CSS

#### Progressive Enhancements
* Designed with no js, no css in mind (plain semantic html)
* Bookmarking (saving last viewed page) supported by the backend 
* Infinite scrolling provided by JS

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

* `npm run build`
* `git commit -m 'Building for release'`
* `git push azure master`

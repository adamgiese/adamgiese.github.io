---
  title: Using "Web Font Loader" to Load Fonts Asynchronously
  summary: By using the "Web Font Loader", a library developed by Google and Typekit, you can improve your page's perceived load time - resulting in a smoother user experience.
  layout: post
  category:
    -javascript
    -performance
    -css
    -sass
---

### Why Load Fonts Asynchronously?

When a Web Font is being requested by the browser, any text that uses the font will remain invisible until the request is completed. Although the browser will eventually give up if the Web Font is taking too long, iOS Safari will try for as long as _30 seconds_ before throwing in the towel. If somebody is browsing on their iPhone with a poor connection, they will likely bounce rather than waiting for your Web Font to load. 

Luckily, there is a better way.

### Including the "Web Font Loader" On Your Site

First, add the "Web Font Loader" to your site by adding this script to your project, at the end of the `body` tag:

``` html
<script src="https://ajax.googleapis.com/ajax/libs/webfont/1.6.16/webfont.js"></script>
```

Next, choose the fonts that you would like to add. The "Web Font Loader" library comes with a variety of modules. For example, here is the loading of a Google font.

``` javascript
WebFont.load({
  google: {
    families: ["Roboto:400,700", "Merriweather:400,700"]
  }
});
```

This will load the _Roboto_ and _Merriweather_ fonts with both the normal and bold weights. When all of the fonts are finished loading, the library will add a `wf-active` class to the HTML element.

To include the Web Fonts for those who have JavaScript disabled, be sure to include the Google fonts link wrapped in a `noscript` tag. 

``` html
<noscript>
  <link href='https://fonts.googleapis.com/css?family=Roboto' rel='stylesheet' type='text/css'>
</noscript>
```

To read more about how to use the "Web Font Loader" and its associated modules, you can find their documentation in the suggested reading at the end of the article.

### Defining Your Styles

To asynchronously set the fonts, we need to define it twice: once as either a descendant of the `wf-active` or `no-js` class, and once without a parent selector. 

For example, 

``` css
.post-title {
  font-family: sans-serif;
}

.no-js .post-title,
.wf-active .post-title {
  font-family: "Roboto", sans-serif;
}
```

This will load the "sans-serif" font by default. As soon as the `wf-active` class is added by the "Web Font Loader" to the `html` element, the "Roboto" font is applied. 

If you are using SASS, you can write a mixin to make this much less verbose.

``` scss
//mixin definition
@mixin async-font($font, $fallback: sans-serif) {
  font-family: $fallback;

  .no-js & {
    font-family: $font $fallback;
  }

  .wf-active & {
    font-family: $font $fallback;
  }
}

//including the mixin
.post-title {
  @include async-font("Roboto"); //will fallback on default
}
```

This will result in the browser `sans-serif` font being displayed until `Roboto` has been loaded. 

### More Reading

- ['Web Font Loader' Documentation](https://github.com/typekit/webfontloader)

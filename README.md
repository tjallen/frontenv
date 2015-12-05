#tja's exquisite build system

remaking my front end build system from scratch, the old one was pretty atrocious.

started from the bottom now we became a slight variation on the google web starter kit, oh well!

Stuff it has:
- the usual gulp + browsersync things
- sass, cssminify + autoprefixr
- uglify
- imagemin
- bourbon & neat, normalize.css
- inject svgs into sprite sheets (gulp serve -> move svg icons into app/icons, they'll be svgmin'd and stored in a sprite sheet, then you can use em: `<use xlink:href="#youricon" />`)
- inject styles and scripts with `gulp inj` - scripts/vendor/* will be injected before scripts/*

---

Setup:
- clone
- npm install

---

Commands:

- serve (default, typical gulp serve/watch task)
- build (prod build -> dist dir)
- icons (inject svg icons into sprite sheet)
- inj (inject css, scripts/vendor/*, scripts/* -> html)

---

Stuff to add soon maybe get hype adfgerhyth
- svg png fallback stuff (gulp-svg2png / gulp-svgfallback)
- rem px fallback (postCSS pixrem, gulp-pixrem)
- queries (gulp-merge-media-queries)
- gulp inj watch alternative
- babel
- browserify
- move more stuff to postCSS plugins

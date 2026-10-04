# Khang & Thuy wedding site

The source is organized for editing, while GitHub Pages serves a single root
`index.html`. A small Python build script assembles the page and inlines its
CSS and JavaScript. Photos and illustrations in `assets/` stay as separate
static files.

## Source layout

- `src/index.template.html` - page metadata and markup, with markers for the
  inlined stylesheet and script.
- `src/styles.css` - site styles.
- `src/app.js` - wedding details, copy, and page behavior.
- `assets/` - photos and illustrations used by the page.
- `index.html` - generated GitHub Pages entry point. Edit `src/`, not this file.
- `build.py` - deterministic assembler; it uses only Python 3's standard
  library and needs no install step.

## Make and deploy a change

1. Edit the relevant file in `src/` (or an image in `assets/`).
2. From the repository root, run `python3 build.py`.
3. Check that the generated file matches its sources with `python3 build.py
   --check`, then review the page at mobile and desktop widths.
4. Commit the source and generated `index.html` together, then push to `main`.
   GitHub Pages serves the root file directly; visitors do not run the build.

The build only joins the template, CSS, and JavaScript into one HTML document.
It does not alter the content, behavior, asset paths, or external service URLs.
The same command run twice with unchanged inputs produces identical output.

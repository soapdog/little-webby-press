## package.opf handling
* [x] change IDs on package.opf to contain prefix (so they don't clash between chapter and images with the same name).
* [x] make sure no ID is a number.
* [x] discover what <guide> means.
* [x] generate toc.ncx or remove it.
* [ ] figure out which other metadata is interesting to support.
* [x] make sure cover don't appear twice on the manifest.
* [x] date format appears to be wrong. Create handlebars helpers to fix it.

## sourcefiles
* [ ] Add support for textile

# themes
* [ ] find themes to use for epub

# website
* [ ] add simple website generator
* [ ] themes? Maybe just base16?

# layout
* [x] fix the control bars.
* [ ] add footer.
* [x] maybe change spectre theme to base16 compatible?
* [x] investigate if we really need spectre.

# Monetization
* [ ] Add webmonetization endpoint
* [ ] Create kofi

# future (uncertain)
* [ ] add menu support
* [ ] add support for importing new themes from online/disk zips
* [ ] export to network disks
  * [ ] Dropbox
  * [ ] OneDrive
  * [ ] Google Drive
  * [ ] Webdav
  * [ ] Git
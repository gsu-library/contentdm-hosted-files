# CONTENTdm Hosted Scripts, Pages, and CSS
Code Repository: https://github.com/gsu-library/contentdm-hosted-files  
Author: Matt Brooks <mbrooks34@gsu.edu>  
Date Created: 2019-06-27  
License: none  
Version: 1.1.0  

## Description
This script replaces Ohms, Youtube, Vimeo, and MediaSpace link items with iframed content, adds links to georeferenced items, and adds links to the collections atlphdata and planATLpubs. Also displays IIIF metedata on item pages along with a mirador button.

## Installation
Log into the CONTENTdm website configuration tool. Expand the custom menu on the left side navigation and select custom scripts. Click browse next to the input box, click add file(s), and then click start upload (for scripts.min.js). Once the upload is finished click the save button on the top of the page followed by the publish button. Do the same except select custom CSS for our cutsom css file (styles.min.css).

To upload template, image, additional CSS, and additional JavaScript files expand the custom menu on the left side navigation and select custom pages. Click the manage file button and upload the files you need to via the file manager.

## Debugging
Add the following URL parameters to a page to enable debugging:
- *debugCss* - Removes the custom CSS file from the page and attaches the style found at https://static.library.gsu.edu/contentdm/styles.css.
- *removeCss* - Removes the custom CSS file from the page.
- *removeJs* - Removes the custom JavaScript from the page (halts the processing of it).

These parameters can be used in any combination and do not have to contain a value (e.g., `?debugCss&removeJs` will both remove the custom JavaScript and replace the custom CSS with the CSS file from the static server). The removeCss parameter trumps the debugCSS parameter so if both are present only the CSS will be removed from the page.

## Dependencies
- [Mirador](https://github.com/mirador/mirador), v2.7

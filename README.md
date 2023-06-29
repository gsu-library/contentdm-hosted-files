# CONTENTdm Hosted Scripts, Pages, and CSS
Code Repository: https://github.com/gsu-library/contentdm-hosted-files  
Author: Matt Brooks <mbrooks34@gsu.edu>  
Date Created: 2019-06-27  
License: none  
Version: 1.10.0

## Description
This repostiory performs the following:

- implements a custom stylesheet, custom pages, and custom images
- replaces Ohms, Youtube, Vimeo, and MediaSpace link items with iframed content
- adds links to georeferenced items
- adds links to the collections atlphdata and planATLpubs
- adds an offensive content popup warning
- implements the [cookbook recipes](#cookbook) below

## Usage
Make edits to the files located in the src folder. After running `npm install` run `npm run build` - this will process the files in the src directory and put the finished files in the dist directory.

## CONTENTdm Upload
Log into the [CONTENTdm website configuration tool](https://cdm16905.contentdm.oclc.org/login/configtool). Expand the custom menu on the left side navigation. The main custom CSS file can be uploaded through the custom CSS menu item and the custom script can be uploaded through the custom scripts menu item. All other files (custom pages, images, and additional scripts) must be uploaded by going to the custom pages menu item and clicking on manage files. The custom pages are uploaded directly to the root of the file explorer, images are uploaded to the images folder, extra JavaScript is uploaded to the js folder, and the Mirador files are currently uploaded to the mirador folder.

Once changes have been made and want to be saved, the save button at the top of the page must be clicked, followed by clicking the publish button. The preview button can be clicked after save and before publishing to preview the changes.

## Debugging
Add the following URL parameters to a page to enable debugging:
- *debugCss* - Removes the custom CSS file from the page and attaches the style found at https://static.library.gsu.edu/contentdm/styles.css.
- *removeCss* - Removes the custom CSS file from the page.
- *removeJs* - ~~Removes the custom JavaScript from the page (halts the processing of it).~~ This feature currently does not work.

These parameters can be used in any combination and do not have to contain a value (e.g., `?debugCss&removeJs` will both remove the custom JavaScript and replace the custom CSS with the CSS file from the static server). The removeCss parameter trumps the debugCSS parameter so if both are present only the CSS will be removed from the page.

## CONTENTdm Cookbook Recipes<a name="cookbook"></a>
The following recipes used are from the [CONTENTdm cookbook recipe portal](https://cdmdemo.contentdm.oclc.org/digital/custom/recipedownloads):

- [Rights & Licenses Badges](https://help.oclc.org/Metadata_Services/CONTENTdm/Advanced_website_customization/Customization_cookbook/Rights_and_licenses_badges), v1.0
- [Mirador 2 Integration](https://help.oclc.org/Metadata_Services/CONTENTdm/Advanced_website_customization/Customization_cookbook/Mirador_viewer_integration), v2
- [Insert IIIF Links as Metadata](https://help.oclc.org/Metadata_Services/CONTENTdm/Advanced_website_customization/Customization_cookbook/insert_iiif_manifest_link_as_metadata), v1.0

## Dependencies
- [Mirador](https://github.com/mirador/mirador), v2.7

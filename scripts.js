/***************************************************************************************************
*
* CONTENTdm Hosted Script - <https://github.com/gsu-library/css-js-toolbox-code-blocks>
* File Author: Matt Brooks <mbrooks34@gsu.edu>
* License: none
* Description: See https://help.oclc.org/Metadata_Services/CONTENTdm/Advanced_website_customization
*   /JavaScript_customizations/List_of_JavaScript_lifecycle_events and https://help.oclc.org/Metadat
*   a_Services/CONTENTdm/Advanced_website_customization/JavaScript_customizations/JavaScript_events
*   for more information on custom scripts in CDM.
* Dependencies: none
*
***************************************************************************************************/

// "cdm-app:ready" fires off first, followed by enter events then ready events.

// .Header-logoHolder contains logo
// #headerNameDiv contains the title
// .SimpleSearch-searchBox contains the searchbox in another location
// all three should probably be in .Header-logoNameContainer
// .Header-hambuergerHolder is in .Header-controls and will need attention at some point (move to menu?)

// Global to halt JS.
// TODO: have better debugging logic.
// TODO: add debug url parameters to all anchor tags
// TODO: use strict
var removeJs = false

// Various fixes.
function gsuFixes() {
   var debugCss = false, removeCss = false;
   var params = document.location.search.slice(1).split('&');

   // Find out what kind of debugging we are doing.
   for(i = 0; i < params.length; i++) {
      if(params[i].startsWith('debugCss')) {
         debugCss = true;
      }
      else if(params[i].startsWith('removeCss')) {
         removeCss = true;
      }
      else if(params[i].startsWith('removeJs')) {
         removeJs = true;
      }
   }

   if(debugCss || removeCss) {
      links = document.getElementsByTagName('link');

      for(var i = 0; i < links.length; i++) {
         if(links[i].getAttribute('href') == '/customizations/global//styles.min.css') {
            console.log('Removing local CSS.');
            links[i].parentNode.removeChild(links[i]);

            if(removeCss) { break; }

            console.log('Adding CSS from static.');
            var styleId = 'gsuStyle';

            if(!document.getElementById(styleId)) {
               var link = document.createElement('link');
               link.id = styleId;
               link.rel = 'stylesheet';
               link.href = 'https://static.library.gsu.edu/contentdm/styles.css';
               document.head.appendChild(link);
            }

            break;
         }
      }
   }

   if(removeJs) {
      return;
   }


   // Add lato font to pages.
   var fontId = "gsuFont";

   if(!document.getElementById(fontId)) {
      var link = document.createElement("link");
      link.id = fontId;
      link.rel = "stylesheet";
      link.href = "https://fonts.googleapis.com/css?family=Lato&display=swap";
      document.head.appendChild(link);
   }


   // Lose focus on search box for mobile.
   var searchBox = document.getElementById("search-input");

   if(searchBox) {
      searchBox.addEventListener("keydown", function(e){
         if(e.keyCode === 13) {
            searchBox.blur();
            document.body.focus();
         }
      });
   }


   // Wrap content in container.
   var wrapperId = "gsuWrapper";

   if(!document.getElementById(wrapperId)) {
      // Wrap content in a container.
      var toWrap = document.querySelector(".CoreLayout-mainWrapperContainer");
      var parent = toWrap.parentNode;
      var wrapper = document.createElement("div");

      wrapper.className = "container";
      wrapper.setAttribute("id", wrapperId);
      // Add wrapper to DOM before toWrap.
      parent.insertBefore(wrapper, toWrap);
      // Put content in wrapper.
      wrapper.appendChild(toWrap);
   }


   // Title tweaks.
   var titleId = "gsuTitle";

   if(!document.getElementById(titleId)) {
      var titleDiv = document.getElementById("headerNameDiv");

      if(titleDiv) {
         var newTitle = document.createElement("h2");
         newTitle.innerHTML = '<a href="https://digitalcollections.library.gsu.edu">Digital Collections</a>';
         var newSubTitle = document.createElement('h3');
         newSubTitle.innerHTML = '<a href="https://library.gsu.edu/">Georgia State University Library</a>';
         var div = document.createElement("div");
         div.setAttribute("id", titleId);
         div.innerHTML = newTitle.outerHTML + newSubTitle.outerHTML;
         titleDiv.innerHTML = div.outerHTML;
      }
   }


   // Header tweaks
   var headerId = "gsuHeader";

   if(!document.getElementById(headerId)) {
      var headerParent = document.querySelector(".Header-logoNameContainer");
      var logo = document.querySelector(".Header-logoHolder");
      var title = document.getElementById("headerNameDiv");
      var search = document.querySelector(".SimpleSearch-searchBox");

      if(headerParent && logo && title && search) {
         logo.classList.add("col-sm-3");
         title.classList.add("col-sm-6");
         search.classList.add("col-sm-3");
         var wrapper = document.createElement("div");
         wrapper.setAttribute("id", headerId);
         wrapper.className = "row";
         headerParent.insertBefore(wrapper, logo);
         wrapper.appendChild(logo);
         wrapper.appendChild(title);
         wrapper.appendChild(search);
      }

      let logoImage;
      if(logoImage = document.querySelector(".Header-logoImage")) {
         logoImage.parentNode.href = "https://library.gsu.edu/";
      }
   }
}


// Home page ready
function gsuHomePageReady() {
   // Change cards to col-sm-3s.
   var cards = document.querySelectorAll(".Card-cardcontainer.col-sm-6");

   // Can't use forEach because IE.
   for(i = 0; i < cards.length; i++) {
      cards[i].classList.remove("col-sm-6");
      cards[i].classList.add("col-sm-3");
   }
}


// For the item page.
function gsuItemPageReady() {
   var collection = window.location.href.match(/collection\/([a-zA-Z0-9-_]+)\//i)[1];

   var id = document.querySelector('.field-identi .field-value span');
   id = id ? id.innerHTML : null;
   id = id.replace(/<[^>]*>?/gm, ''); // Remove any tags that may be in here.

   var geo = document.querySelector('.field-georef .field-value span');
   geo = geo ? geo.innerHTML.toLowerCase().replace(/<[^>]*>?/gm, '') : null;
   geo = geo == "yes" ? true : false;

   let itemLink = document.querySelector('.ItemUrl-itemUrlLink a');
   itemLink = itemLink ? itemLink.href.replace(/^http:\/\//i, 'https://') : null;


   // Check to see if there is an item link and embed it if there is a video match.
   if(itemLink) {
      console.log("This is an item link page.");

      let embeds = [
         {
            'urlMatch': 'https://webapps.library.gsu.edu/ohms-viewer/viewer.php',
            'idMatch': /cachefile=(.+)$/,
            'embedUrl': 'https://webapps.library.gsu.edu/ohms-viewer/viewer.php?cachefile=',
            'iframeAttributes': 'width="100%" height="700"'
         },
         {
            'urlMatch': 'https://www.youtube.com/embed/',
            'idMatch': /\/embed\/(.+)$/,
            'embedUrl': 'https://www.youtube.com/embed/',
            'iframeAttributes': 'width="700" height="400" style="margin:0 auto;" frameborder="0" allowfullscreen'
         },
         {
            'urlMatch': 'https://youtu.be/',
            'idMatch': /\.be\/(.+)$/,
            'embedUrl': 'https://www.youtube.com/embed/',
            'iframeAttributes': 'width="700" height="400" style="margin:0 auto;" frameborder="0" allowfullscreen'
         },
         {
            'urlMatch': 'https://www.youtube.com/watch',
            'idMatch': /v=(.+)&|v=(.+)$/,
            'embedUrl': 'https://www.youtube.com/embed/',
            'iframeAttributes': 'width="700" height="400" style="margin:0 auto;" frameborder="0" allowfullscreen'
         },
         {
            'urlMatch': 'https://mediaspace.gsu.edu/media',
            'idMatch': /\/([\w\d_-]+)$/,
            // 'embedUrl': 'https://cdnapisec.kaltura.com/p/1959611/sp/195961100/embedIframeJs/uiconf_id/31355121/partner_id/1959611?iframeembed=true&playerId=kaltura_player&flashvars[streamerType]=auto&amp;flashvars[localizationCode]=en&amp;flashvars[leadWithHTML5]=true&amp;flashvars[sideBarContainer.plugin]=true&amp;flashvars[sideBarContainer.position]=left&amp;flashvars[sideBarContainer.clickToClose]=true&amp;flashvars[chapters.plugin]=true&amp;flashvars[chapters.layout]=vertical&amp;flashvars[chapters.thumbnailRotator]=false&amp;flashvars[streamSelector.plugin]=true&amp;flashvars[EmbedPlayer.SpinnerTarget]=videoHolder&amp;flashvars[dualScreen.plugin]=true&amp;flashvars[hotspots.plugin]=1&amp;flashvars[Kaltura.addCrossoriginToIframe]=true&amp;&entry_id=',
            'embedUrl': 'https://mediaspace.gsu.edu/embed/secure/iframe/entryId/',
            'iframeAttributes': 'width="700" height="400" style="margin:0 auto;" frameborder="0" allowfullscreen'
         },
         {
            'urlMatch': 'https://mediaspace.gsu.edu/embed',
            'idMatch': /entryId\/([\w\d_-]+)/,
            'embedUrl': 'https://mediaspace.gsu.edu/embed/secure/iframe/entryId/',
            'iframeAttributes': 'width="700" height="400" style="margin:0 auto;" frameborder="0" allowfullscreen'
         },
         {
            'urlMatch': 'https://vimeo.com/',
            'idMatch': /vimeo.com\/(.+)$/,
            'embedUrl': 'https://player.vimeo.com/video/',
            'iframeAttributes': 'width="700" height="400" style="margin:0 auto;" frameborder="0" allowfullscreen'
         },
         // {
         //    'urlMatch': '',
         //    'idMatch': //,
         //    'embedUrl': '',
         //    'iframeAttributes': ''
         // },
      ];
      let container = document.querySelector('.ItemPreview-container');
      let iframe = null;
      let matches = null;


      for(let i = 0; i < embeds.length; i++) {
         if(itemLink.startsWith(embeds[i].urlMatch)) {
            matches = itemLink.match(embeds[i].idMatch);

            // If we find a valid identifier match.
            // Looks for first match beyond group 0.
            for(let j = 1; j < matches.length; j++) {
               if(typeof matches[j] != 'undefined' && matches[j]) {
                  iframe = '<iframe src="' + embeds[i].embedUrl + matches[j] + '" ' + embeds[i].iframeAttributes + '></iframe>';
                  break;
               }
            }

            break;
         }
      }

      if(iframe && container) { container.innerHTML = iframe; }
   }


   // If the item on the page is georeferenced, has an ID, and a collection.
   if(id && collection && geo) {
      console.log("This item is georeferenced with a collection of " + collection + "and an id of " + id + ".");
      //var googleMapsLink = "https://geo.library.gsu.edu/mapoverlay.php?collection=" + collection + "&map=" + id;
      var googleMapsLink = "https://geo.library.gsu.edu/overlay/" + collection + "/" + id + "/";
      var googleEarthLink = "https://geo.library.gsu.edu/geoserver/wms/kml?layers=" + id;
      var geoTiffLink = "https://geo.library.gsu.edu/geotiffs/" + collection + "/" + id + "_geo.tif";
      var fragment = document.createDocumentFragment();

      var element = document.createElement('div');
      element.className = "btn-group btn-group-default";
      element.innerHTML = '<a class="cdm-btn btn btn-primary gsu-button" target="_blank" href="'+googleMapsLink+'"><span class="fa fa-map"></span> Map Overlay</a>';
      fragment.appendChild(element);
      element = document.createElement('div');
      element.className = "btn-group btn-group-default";
      element.innerHTML = '<a class="cdm-btn btn btn-primary gsu-button" href="'+googleEarthLink+'"><span class="fa fa-globe"></span> Google Earth</a>';
      fragment.appendChild(element);
      element = document.createElement('div');
      element.className = "btn-group btn-group-default";
      element.innerHTML = '<a class="cdm-btn btn btn-primary gsu-button" href="'+geoTiffLink+'"><span class="fa fa-download"></span> GeoTiff</a>';
      fragment.appendChild(element);

      var toolbars = document.querySelectorAll(".btn-toolbar");

      for(i = 0; i < toolbars.length; i++) {
         toolbars[i].appendChild(fragment.cloneNode(true));
      }
   }


   // atlphdata
   if(id && collection && collection == "atlphdata") {
      console.log("ATL Population and Housing Data.");
      var excelLink = "https://static.library.gsu.edu/contentdm/atlphdata/excel/" + id + ".xls";
      var csvLink = "https://static.library.gsu.edu/contentdm/atlphdata/csv/" + id + ".zip";
      var fragment = document.createDocumentFragment();

      var element = document.createElement('div');
      element.className = "btn-group btn-group-default";
      element.innerHTML = '<a class="cdm-btn btn btn-primary gsu-button" href="'+excelLink+'"><span class="fa fa-file"></span> Excel</a>';
      fragment.appendChild(element);
      element = document.createElement('div');
      element.className = "btn-group btn-group-default";
      element.innerHTML = '<a class="cdm-btn btn btn-primary gsu-button" href="'+csvLink+'"><span class="fa fa-file"></span> CSV</a>';
      fragment.appendChild(element);


      var toolbars = document.querySelectorAll(".btn-toolbar");

      for(i = 0; i < toolbars.length; i++) {
         toolbars[i].appendChild(fragment.cloneNode(true));
      }
   }


   // planATLpubs | atlphdata section.
   if(id && collection && (collection == "planATLpubs" || collection == "atlphdata")) {
      console.log("Adding search link to planATLpubs and atlphdata.");
      var searchLink = "/digital/search/collection/atlmaps/searchterm/" + id;

      var element = document.createElement('div');
      element.className = "btn-group btn-group-default";
      element.innerHTML = '<a class="cdm-btn btn btn-primary gsu-button" href="'+searchLink+'"><span class="fa fa-search"></span> View Item\'s Maps</a>';

      var toolbars = document.querySelectorAll(".btn-toolbar");

      for(i = 0; i < toolbars.length; i++) {
         toolbars[i].appendChild(element.cloneNode(true));
      }
   }
}


// For the home page.
document.addEventListener("cdm-home-page:ready", function() {
   gsuFixes();
   if(!removeJs) { gsuHomePageReady(); }
});


// For the browse/search page.
document.addEventListener("cdm-search-page:ready", function() {
   gsuFixes();
});


// For the advanced search page.
document.addEventListener("cdm-advanced-search-page:ready", function() {
   gsuFixes();
});


// For collection pages.
document.addEventListener("cdm-collection-page:ready", function() {
   gsuFixes();
});


// For collection landing pages.
document.addEventListener("cdm-collection-landing-page:ready", function() {
   gsuFixes();
});


// For collection search pages.
document.addEventListener("cdm-collection-search-page:ready", function() {
   gsuFixes();
});


// Custom CDM call for an item page ready state.
document.addEventListener('cdm-item-page:ready', function(){
   gsuFixes();
   if(!removeJs) { gsuItemPageReady(); }
});


// For custom pages.
document.addEventListener("cdm-custom-page:ready", function() {
   gsuFixes();
});


// For the about page.
document.addEventListener("cdm-about-page:ready", function() {
   gsuFixes();
});


// For the login page.
document.addEventListener("cdm-login-page:ready", function() {
   gsuFixes();
});


// For the not found page.
document.addEventListener("cdm-notfound-page:ready", function() {
   gsuFixes();
});


/*****************************************************

   Name: Show IIIF links as metadata
   Version: 1.0 - 2019 Dec - initial implementation

*****************************************************/
(function () {
   'use strict';

   const currentUrl = window.location.origin ?
       window.location.origin + '/' :
       window.location.protocol + '//' + window.location.host;

   const logoSvgIIIF = '<svg height="2em" width="2em" style="margin-bottom:-5px;" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:cc="http://creativecommons.org/ns#" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" style="enable-background:new" version="1.1" id="svg2" xml:space="preserve" width="586.95789" height="534.94623" viewBox="0 0 586.95789 534.94622"> <metadata id="metadata8"><rdf:RDF><cc:Work rdf:about=""><dc:format>image/svg+xml</dc:format><dc:type rdf:resource="http://purl.org/dc/dcmitype/StillImage" /><dc:title></dc:title></cc:Work></rdf:RDF></metadata><defs id="defs6" /><g style="display:inline" id="g10" transform="matrix(1.3333333,0,0,-1.3333333,42.08939,487.43895)"> <g style="display:inline;" id="layer4"><rect ry="56.48138" transform="scale(1,-1)" y="-354.32922" x="-20.317043" height="378.70969" width="417.71841" id="rect2281" style="opacity:1;fill:#ffffff;fill-opacity:1;stroke:#ffffff;stroke-width:22.5;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" /> </g><g id="g12" transform="scale(0.1)"><path d="M 65.2422,2178.75 775.242,1915 773.992,15 65.2422,276.25 v 1902.5" style="fill:#2873ab;fill-opacity:1;fill-rule:nonzero;stroke:none" id="path14" /><path d="m 804.145,2640.09 c 81.441,-240.91 -26.473,-436.2 -241.04,-436.2 -214.558,0 -454.511,195.29 -535.9527,436.2 -81.4335,240.89 26.4805,436.18 241.0387,436.18 214.567,0 454.512,-195.29 535.954,-436.18" style="fill:#2873ab;fill-opacity:1;fill-rule:nonzero;stroke:none" id="path16" /><path d="M 1678.58,2178.75 968.578,1915 969.828,15 1678.58,276.25 v 1902.5" style="fill:#ed1d33;fill-opacity:1;fill-rule:nonzero;stroke:none" id="path18" /><path d="m 935.082,2640.09 c -81.437,-240.91 26.477,-436.2 241.038,-436.2 214.56,0 454.51,195.29 535.96,436.2 81.43,240.89 -26.48,436.18 -241.04,436.18 -214.57,0 -454.52,-195.29 -535.958,-436.18" style="fill:#ed1d33;fill-opacity:1;fill-rule:nonzero;stroke:none" id="path20" /><path d="m 1860.24,2178.75 710,-263.75 -1.25,-1900 -708.75,261.25 v 1902.5" style="fill:#2873ab;fill-opacity:1;fill-rule:nonzero;stroke:none" id="path22" /><path d="m 2603.74,2640.09 c 81.45,-240.91 -26.47,-436.2 -241.03,-436.2 -214.58,0 -454.52,195.29 -535.96,436.2 -81.44,240.89 26.48,436.18 241.03,436.18 214.57,0 454.51,-195.29 535.96,-436.18" style="fill:#2873ab;fill-opacity:1;fill-rule:nonzero;stroke:none" id="path24" /><path d="m 3700.24,3310 v -652.5 c 0,0 -230,90 -257.5,-142.5 -2.5,-247.5 0,-336.25 0,-336.25 l 257.5,83.75 V 1690 l -258.61,-92.5 V 262.5 L 2735.24,0 v 2360 c 0,0 -15,850 965,950" style="fill:#ed1d33;fill-opacity:1;fill-rule:nonzero;stroke:none" id="path26" /></g></g></svg>';

   // Determine if current item has a parent
   function getParent(item, collection) {
       let ids = {parent: null};
       return fetch(`/digital/bl/dmwebservices/index.php?q=GetParent/${collection}/${item}/json`)
       .then(function(response) {
           return response.json();
       })
       .then(function(json) {
           // parse JSON for 'parent' value; -1 indicates parent ID is the same as item ID
           if (json.parent === -1) {
               ids.parent = item;
           } else {
               ids.parent = json.parent;
           }
           return ids;
       })
       .catch(function(error) {
           console.log('Parent request failed: ' + error);
           return false;
       })
   }

   // Determine if IIIF manifest exists. If it does, parse the first child from the first canvas
   function checkManifest(ids, collection) {
       return fetch(`/iiif/info/${collection}/${ids.parent}/manifest.json`)
       .then(function(response) {
           if (response.status == 404) {
               console.info(`No IIIF manifest exists for this record (id=${ids.parent}).`);
               // if no manifest exists, return is 'false' so that IIIF button is not inserted
               return false;
           } else {
               return response.json();
           }
       })
       .then(function(json) {
           let manifestData = json
           let hasFirstChild = !!manifestData.sequences[0].canvases[0]['@id']
           if(hasFirstChild) {
               let canvases = manifestData.sequences[0].canvases
               let allChildren = []
               for (let n=0; n < canvases.length; n++) {
                   let nthChildCanvas = canvases[n]['@id']
                   let collStartIndex = nthChildCanvas.indexOf(collection)
                   let itemStartIndex = collStartIndex + collection.length + 1
                   let itemEndIndex = nthChildCanvas.indexOf('/canvas/')
                   let nthChildId = nthChildCanvas.slice(itemStartIndex, itemEndIndex)
                   if( n === 0) {
                       ids.child = nthChildId
                   }
                   allChildren.push(nthChildId)
               }
               ids = {...ids, allChildren: allChildren}

           } else {
               ids.child = null
               ids.allChildren = null
           }

           return ids;
       })
       .catch(function(error) {
           console.log('Manifest request failed: ' + error);
           return false;
       })
   }

   function newMetadataRow(rowClass, labelText, valueContents) {
       //helper function to build HTML for new row of metadata with field label and contents
       let rowContainer = document.createDocumentFragment();
       let fieldRow = document.createElement('tr');
       fieldRow.classList.add('ItemMetadata-metadatarow', rowClass);
       let fieldLabel = document.createElement('td');
       fieldLabel.classList.add('ItemMetadata-key','field-label');
       fieldLabel.style.verticalAlign = 'bottom';
       fieldLabel.innerHTML = labelText;
       let fieldValue = document.createElement('td');
       fieldValue.classList.add('field-value');
       let fieldValueSpan = document.createElement('span');
       fieldValueSpan.classList.add('field-value-span');
       fieldValueSpan.appendChild(valueContents);
       fieldValue.appendChild(fieldValueSpan);
       fieldRow.appendChild(fieldLabel);
       fieldRow.appendChild(fieldValue);
       rowContainer.appendChild(fieldRow);
       return rowContainer;
   }

   const fieldIiifManifest = {
       insertManifestLink: function(item,parent,child,allChildren,collection) {

           const objectDescriptionTable = document.querySelector('div#compoundObjectDescription>div>table>tbody');
           const itemDescriptionTable = document.querySelector('div#compoundItemDescription>div>table>tbody');
           const singleItemDescriptionTable = document.querySelector('div#singleItemDescription>div>table>tbody');

           function buildLinkIIIF(item,parent,child,allChildren,collection,type) {
               //helper function to account for IIIF Prezi vs Image API link references
               let linkContainer = document.createElement('a');
               linkContainer.target = '_blank';
               let linkTarget, rowLabel, rowClass;
               let manifestId, imageId;
               let imgIdStart, slicedString, postIdSlashIndex, actualId;

               // Make sure we don't display the first canvased item if it's not the item that matches the parent
               let img = document.querySelector('.CompoundItemView-thumbnail')

               if(img) {
                   let imgSrc = img.getAttribute('src')
                   //Parse the id from the img's src
                   imgIdStart = imgSrc.indexOf('/id/') + 4
                   slicedString = imgSrc.slice(imgIdStart)
                   postIdSlashIndex = slicedString.indexOf('/')
                   actualId = slicedString.slice(0, postIdSlashIndex)
               } else {
                   // If no cpd item viewer, item is single image.
                   actualId === child
               }

               if (!child) {
                   console.log('no child');
                   manifestId = item;
                   imageId = item;
               } else if (item === parent && actualId === child) {
                   manifestId = item;
                   imageId = child;
               } else {
                   manifestId = parent;
                   imageId = item;
               }

               let shouldCreateLink = false
               if (type === 'manifest') {
                   shouldCreateLink = true
                   linkTarget = `${currentUrl}iiif/info/${collection}/${manifestId}/manifest.json`;
                   linkContainer.title = 'View IIIF Manifest';
                   rowLabel = 'IIIF Manifest';
                   rowClass = 'iiif-manifest-link';
               } else if (type === 'image' && allChildren.includes(imageId)) {
                   shouldCreateLink = true
                   linkTarget = `${currentUrl}digital/iiif/${collection}/${imageId}/full/full/0/default.jpg`;
                   linkContainer.title = 'View IIIF Image';
                   rowLabel = 'IIIF Image';
                   rowClass = 'iiif-image-link';
               }

               if(shouldCreateLink) {
                   linkContainer.href = linkTarget;
                   linkContainer.setAttribute('aria-label',linkContainer.title);
                   linkContainer.innerHTML = logoSvgIIIF + ' ' + linkTarget;
                   let newRow = newMetadataRow(rowClass,rowLabel,linkContainer);
                   return newRow;
               } else {
                   return
               }
           }

           if (!objectDescriptionTable) {
               let singleManifest = buildLinkIIIF(item,parent,child,allChildren,collection,'manifest');
               singleItemDescriptionTable.appendChild(singleManifest);
               let singleImage = buildLinkIIIF(item,parent,child,allChildren,collection,'image');
               singleItemDescriptionTable.appendChild(singleImage);
           }

           if (objectDescriptionTable) {
               let objectManifest = buildLinkIIIF(item,parent,child,allChildren,collection,'manifest');
               objectDescriptionTable.appendChild(objectManifest);
               let objectImage = buildLinkIIIF(item,parent,child,allChildren,collection,'image');
               itemDescriptionTable.appendChild(objectImage);
           }
       },
       removeLink: function() {
           Array.from(document.querySelectorAll('.iiif-manifest-link')).forEach(function(el) {
               if (el && el.parentElement) {
                   el.parentElement.removeChild(el);
               }
           });
           Array.from(document.querySelectorAll('.iiif-image-link')).forEach(function(el) {
               if (el && el.parentElement) {
                   el.parentElement.removeChild(el);
               }
           });
       }
   };

   let globalScope = false;
   let collectionScope = [
      'afpl',
      'atlaerial',
      'atlmaps',
      'atlpoh',
      'atlphotos',
      'planATLpubs',
      'atlphdata'
   ];
   let creatorScope = [
      'Atlanta Journal-Constitution'
   ];

   /*
   SCOPING
      For non-global scoping the globalScope variable must be false.

   Original
      if (globalScope || collectionScope.includes(collection)) {

   Collection Deny List
      if (globalScope || !(collectionScope.includes(collection))) {

   Collection and Creator Deny Lists
      if (globalScope || !(collectionScope.includes(collection)) && !(creatorScope.includes(creator))) {
   */


   document.addEventListener('cdm-item-page:ready', function(e){
       let item = e.detail.itemId;
       let collection = e.detail.collectionId;
       let creator = document.querySelector('.field-creato .field-value a');
       creator = creator ? creator.text : null;

       if (globalScope || !(collectionScope.includes(collection)) && !(creatorScope.includes(creator))) {
           getParent(item, collection)
           .then(function(response) {
               if (response) {
                   checkManifest(response, collection)
                   .then(function(response) {
                       if (response) {
                           fieldIiifManifest.insertManifestLink(item, response.parent, response.child, response.allChildren, collection);
                       } else {
                           return;
                       }
                   })
               }
           });
       }
   });

   document.addEventListener('cdm-item-page:update', function(e){
       let item = e.detail.itemId;
       let collection = e.detail.collectionId;
       let creator = document.querySelector('.field-creato .field-value a');
       creator = creator ? creator.text : null;
       fieldIiifManifest.removeLink();

       if (globalScope || !(collectionScope.includes(collection)) && !(creatorScope.includes(creator))) {
           getParent(item, collection)
           .then(function(response) {
               if (response) {
                   checkManifest(response, collection)
                   .then(function(response) {
                       if (response) {
                           fieldIiifManifest.insertManifestLink(item, response.parent, response.child, response.allChildren, collection);
                       } else {
                           return;
                       }
                   })
               }
           });
       }
   });

   document.addEventListener('cdm-item-page:leave', function(e){
       let collection = e.detail.collectionId;
       let creator = document.querySelector('.field-creato .field-value a');
       creator = creator ? creator.text : null;

       if (globalScope || !(collectionScope.includes(collection)) && !(creatorScope.includes(creator))) {
           fieldIiifManifest.removeLink();
       }
   });

})();


/********************************************************************************

   Name: Mirador 2.7 Integration
   Version: 1.5 - 2020 Jan 19 - consolidate js to one file and rename main file

********************************************************************************/
(function() {
   'use strict';

   // helper function to load js file and insert into DOM
   // @param {string} src link to a js file
   // @returns Promise

   function loadScript(src) {
   return new Promise(function(resolve, reject) {
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
   });
   }

  const currentUrl = window.location.origin
    ? `${window.location.origin}/`
    : `${window.location.protocol}//${window.location.host}/`;

  // helper function to determine parent record ID of current item
	function getParent(item, collection) {
    return fetch(`/digital/bl/dmwebservices/index.php?q=GetParent/${collection}/${item}/json`)
    .then((response) => response.json())
		// make GetParent API call and return as JSON
    .then((json) => {
      let parent = false;
      // parse JSON for 'parent' value; -1 indicates parent ID is the same as item ID
      if (json.parent === -1) {
        parent = item;
      } else {
        parent = json.parent;
      }
      return parent;
    })
    .then((parent) => {
    // once parent is known, check if IIIF Pres manifest exists
      return fetch(`/iiif/info/${collection}/${parent}/manifest.json`)
      .then((response) => {
        if (response.status != 200) {
          console.log('No IIIF manifest exists for this record.');
          parent = false;
          // if no manifest exists, return is 'false' so that IIIF button is not inserted
          return parent;
        } else {
          // check if manifest is for single-item PDF
          return fetch(`/digital/api/collections/${collection}/items/${parent}/false`)
          .then((response) => response.json())
          .then((json) => {
            if (json.filename.split('.').pop() === 'pdf' ) {
            // if item format is pdf return is false so that IIIF button is not inserted
              console.log('pdf?',json.filename.split('.').pop());
              parent = false;
              return parent;
            } else {
              return parent;
            }
          })
          .catch((error) => console.log('Item API request failed.', error));
        }
      })
      .catch((error) => {
        console.log('Manifest request failed.', error);
        parent = false;
        return parent;
      });
    })
    .catch(function(error) {
      console.log('GetParent request failed.', error);
      parent = false;
      return parent;
		});
	}

  const mirador_button = {
    getMiradorUrl: function(item, collection) {
      const manifestUrl = `${currentUrl}/iiif/info/${collection}/${item}/manifest.json`;
      return `/digital/custom/mirador?manifest=${manifestUrl}`;
    },
    add: function(item, collection) {
      const div = document.createElement('div')
      div.className = 'btn-group btn-group-default mirador-button';

      const buttonAnchor = document.createElement('a');
      buttonAnchor.title = "View this item in Mirador";
      buttonAnchor.className = 'cdm-btn btn btn-primary';
      buttonAnchor.href = mirador_button.getMiradorUrl(item, collection);
      buttonAnchor.style.paddingTop = '5px';
      buttonAnchor.style.paddingBottom = '2px';
      buttonAnchor.target = '_blank';
      buttonAnchor.innerHTML = ' <svg xmlns="http://www.w3.org/2000/svg" height="1.8em" viewBox="0 0 60 55" style="fill: currentColor;"><rect width="18" height="55" /><rect width="18" height="55" transform="translate(42)" /><rect width="18" height="34" transform="translate(21)" /></svg> ';

      div.appendChild(buttonAnchor);

      Array.from(document.querySelectorAll('.ItemOptions-itemOptions>.btn-toolbar'))
      .forEach(el => {
        el.appendChild(div.cloneNode(true));
      });
    },
    remove: function() {
      Array.from(document.querySelectorAll('.mirador-button'))
      .forEach(el => {
        if (el && el.parentElement) {
          el.parentElement.removeChild(el);
        }
      });
    }
  }

  const addMiradorCss = function () {
    const cssId = 'mirador'; // you could encode the css path itself to generate id
    if (!document.getElementById(cssId)) {
      const link = document.createElement('link');
      link.id = cssId;
      link.rel = 'stylesheet';
      link.type = 'text/css';
      link.href = '/customizations/global/pages/mirador/css/mirador-combined.css';
      link.media = 'all';
      document.head.appendChild(link);
    }
  }

  const initMirador = function () {
    let query = {};
    location.search.split(/\&|\?/g).forEach(function(it) {
      if (it) {
        const parts = it.split('=');
        const key = parts[0];
        const value = parts[1];
        query[key] = value;
      }
    });

    let options = {
      id: 'viewer',
      data: [],
      buildPath: '/customizations/global/pages/mirador/'
    };
    if (query['manifest']) {
      options.data.push({
        manifestUri: query['manifest'],
        location: query['collection'] || ''
      });

      options.windowObjects = [{
        loadedManifest: query['manifest'],
        canvasID: query['canvas'] || ''
      }];
    }

    Mirador(options);
  }

  let globalScope = false;
  let collectionScope = [
     'afpl',
     'atlaerial',
     'atlmaps',
     'atlpoh',
     'atlphotos',
     'planATLpubs',
     'atlphdata'
  ];
  let creatorScope = [
     'Atlanta Journal-Constitution'
  ];

  document.addEventListener('cdm-item-page:ready', function(e) {
      const item = e.detail.itemId;
		const collection = e.detail.collectionId;
      let creator = document.querySelector('.field-creato .field-value a');
      creator = creator ? creator.text : null;

    if (globalScope || !(collectionScope.includes(collection)) && !(creatorScope.includes(creator))) {
    	getParent(item, collection).then(function(response) {
    		if (response === false) { return; } else {
          mirador_button.add(response, collection);
        }
      });
    }
  });

  document.addEventListener('cdm-item-page:update', function(e) {
    const item = e.detail.itemId;
    const collection = e.detail.collectionId;
    let creator = document.querySelector('.field-creato .field-value a');
    creator = creator ? creator.text : null;

    if (globalScope || !(collectionScope.includes(collection)) && !(creatorScope.includes(creator))) {
      getParent(item, collection).then(function(response) {
        if (response === false) {
          mirador_button.remove();
          return;
        } else {
          mirador_button.remove();
          mirador_button.add(response, collection);
        }
      });
    }
  });

  document.addEventListener('cdm-item-page:leave', function(e) {
    const collection = e.detail.collectionId;
    let creator = document.querySelector('.field-creato .field-value a');
    creator = creator ? creator.text : null;

    if (globalScope || !(collectionScope.includes(collection)) && !(creatorScope.includes(creator))) {
      mirador_button.remove();
    }
  });

  document.addEventListener('cdm-custom-page:enter', function(e) {
    if (e.detail.filename == 'mirador') {
      loadScript('/customizations/global/pages/js/mirador-cp.js')
      .then(function() {
        addMiradorCss();
      });
    }
  });

  document.addEventListener('cdm-custom-page:ready', function(e) {
    if (e.detail.filename == 'mirador') {
      loadScript('/customizations/global/pages/mirador/mirador.js')
      .then(function() {
        initMirador();
      });
    }
  });
})();

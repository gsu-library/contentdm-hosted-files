export { insert_iiif_links };


/**
 * Inserts IIIF manifest and image links on item pages.
 *
 * @version 1.0
 * @url https://help.oclc.org/Metadata_Services/CONTENTdm/Advanced_website_customization/Customization_cookbook/insert_iiif_manifest_link_as_metadata
 */
function insert_iiif_links() {
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
                   linkTarget = `${currentUrl}iiif/2/${collection}:${manifestId}/manifest.json`;
                   linkContainer.title = 'View IIIF Manifest';
                   rowLabel = 'IIIF Manifest';
                   rowClass = 'iiif-manifest-link';
               } else if (type === 'image' && allChildren.includes(imageId)) {
                   shouldCreateLink = true
                   linkTarget = `${currentUrl}iiif/2/${collection}:${imageId}/full/full/0/default.jpg`;
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
      'afpl'
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

   Colletion and Creator Allow Lists
      if (globalScope || (collectionScope.includes(collection) || creatorScope.includes(creator))) {
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

};

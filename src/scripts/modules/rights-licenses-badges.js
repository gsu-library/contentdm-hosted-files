export { rights_licenses_badges };


/**
 * Adds a rights and licenses badge next to relevant URIs.
 *
 * @version 1.0
 * @url https://help.oclc.org/Metadata_Services/CONTENTdm/Advanced_website_customization/Customization_cookbook/Rights_and_licenses_badges
 */
function rights_licenses_badges() {
   'use strict';

   // detects specific values in metadata and inserts the corresponding rights statement ui

   const imagesBaseURL = 'https://cdmdemo.contentdm.oclc.org/customizations/global/pages/img/';
   // badge images served from OCLC servers rather than
   // RightsStatements.org or Creative Commons to respect their bandwidth

   function getValueFromStorage(key) {
     let storedValue = localStorage.getItem(key)
     return storedValue;
   }

   function allRightsArray(){
     //helper function to convert json to array
     return fetch('/customizations/global/pages/js/rights.json')
     .then(response => response.json())
     .then(data => {
       let rightsObject = data;
       return rightsObject;
     })
     .catch(error => {
       console.log('Rights JSON request failed:', error);
       return false;
     });
   }

   function detectRights(rights){
     let hasRight = false;
     if (rights) {
       const allMetadataFields = document.querySelectorAll('tr.ItemMetadata-metadatarow > td.field-value > span');
       Array.from(allMetadataFields)
       .forEach(el => {
         if (el.innerText) {
           rights.right.forEach(rightProperties => {
             if (rightProperties.uri === el.innerText) {
               hasRight = rightProperties;
             }
           });
         }
       });
     }
     return hasRight;
   }

   function insertRight(rights) {
     if (rights) {
       const allMetadataFields = document.querySelectorAll('tr.ItemMetadata-metadatarow > td.field-value > span');
       Array.from(allMetadataFields)
       .forEach(el => {
         if (el.innerText) {
           rights.right.forEach(rightProperties => {
             if (rightProperties.uri === el.textContent) { // changed from el.innerText
               let rightContainer = document.createElement('div');
                 rightContainer.id = 'right-badge-ui';
               let rightBadgeDiv = document.createElement('div');
                 rightBadgeDiv.style.margin = '0.5em 0';
                 rightBadgeDiv.innerHTML = `<img style="height: 2.2em;" src="${imagesBaseURL}${rightProperties.button_url.file}"/>`;
               let rightNameDiv = document.createElement('div');
                 rightNameDiv.style.margin = '0.5em 0';
                 rightNameDiv.innerHTML = `${rightProperties.name}`;
               let rightTextDiv = document.createElement('div');
                 rightTextDiv.style.wordBreak = 'normal';
                 rightTextDiv.innerHTML = `${rightProperties.text_en}`;
               rightContainer.append(rightBadgeDiv,rightNameDiv,rightTextDiv);
               el.append(rightContainer);
             }
           });
         }
       })
     }
   }

   let globalScope = true;
   let collectionScope = [
   //    'rights',
   ];

   ['cdm-item-page:ready','cdm-item-page:update'].forEach(function(e){
     document.addEventListener(e, function(e){
       let item = e.detail.itemId;
       let collection = e.detail.collectionId;
       if (globalScope || collectionScope.includes(collection)) {
         if ( document.getElementById('right-badge-ui') ) {
           document.getElementById('right-badge-ui').remove();
         }
         allRightsArray()
         .then(response => {
           insertRight(response);
         })
       }
     });
   });

   document.addEventListener('cdm-item-page:leave', function(e){
       let collection = e.detail.collectionId;
       if (globalScope || collectionScope.includes(collection)) {
         if ( document.getElementById('right-badge-ui') ) {
           document.getElementById('right-badge-ui').remove();
         }
       }
   });
 }

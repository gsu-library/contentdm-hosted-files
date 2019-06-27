/***************************************************************************************************
*
* CONTENTdm Hosted Script - <https://bitbucket.org/gsulibwebmaster/cdm-hosted-script/>
* File Author: Matt Brooks <mbrooks34@gsu.edu>
* License: none 
* Description: See https://help.oclc.org/Metadata_Services/CONTENTdm/Advanced_website_customization
*   /JavaScript_customizations/List_of_JavaScript_lifecycle_events and https://help.oclc.org/Metadat
*   a_Services/CONTENTdm/Advanced_website_customization/JavaScript_customizations/JavaScript_events
*   for more information on custom scripts in CDM.
* Dependencies: none
*
***************************************************************************************************/


// Custom CDM call for an item page ready state.
document.addEventListener('cdm-item-page:ready', function(){
   var id = document.querySelector('.field-identi .field-value span');
   id = id ? id.innerHTML : null;

   var geo = document.querySelector('.field-georef .field-value span');
   geo = geo ? (geo.innerHTML.toLowerCase() == "yes" ? true : false) : false;

   var itemLink = document.querySelector('.ItemUrl-itemUrlLink a');
   itemLink = itemLink ? itemLink.href.replace(/^http:\/\//i, 'https://') : null;

   var collection = window.location.href.match(/collection\/([a-zA-Z0-1-_]+)\//i)[1];


   // Check to see if there is an item link and if it is Ohms or Youtube.
   if(itemLink) {
      console.log("This is an item link page.");
      var ohmsBase = "https://webapps.library.gsu.edu/ohms-viewer/viewer.php";
      var youTubeBase = "https://www.youtube.com";
      var container = document.querySelector(".ItemPreview-container");
      var iframe = null;

      // If link to Ohms Viewer.
      if(itemLink.substring(0, ohmsBase.length) == ohmsBase) {
         iframe = '<iframe src="' + itemLink + '" width="100%" height="700"></iframe>';
      }
      // If link to YouTube.
      else if(itemLink.substring(0, youTubeBase.length) == youTubeBase) {
         iframe = '<iframe src="' + itemLink + '" width="700" height="400" style="margin:0 auto;" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
      }

      if(iframe && container) { container.innerHTML = iframe; }
   }
   

   // If the item on the page is georeferenced, has an ID, and a collection.
   if(id && collection && geo) {
      console.log("This item is georeferenced with a collection of " + collection + "and an id of " + id + ".");
      var googleMapsLink = "https://geo.library.gsu.edu/mapoverlay.php?collection=" + collection + "&map=" + id;
      var googleEarthLink = "https://geo.library.gsu.edu/geoserver/wms/kml?layers=" + id;
      var geoTiffLink = "https://geo.library.gsu.edu/geotiffs/" + collection + "/" + id + "_geo.tif";
      var element = document.createElement('tr');
      var description = document.querySelector('.item-description');
      var fragment = document.createDocumentFragment();

      element.innerHTML = '<td>Google Maps</td><td><a href="' + googleMapsLink + '">Link</a></td>';
      fragment.appendChild(element);
      element = document.createElement('tr');
      element.innerHTML = '<td>Google Earth</td><td><a href="' + googleEarthLink + '">Link</a></td>';
      fragment.appendChild(element);
      element = document.createElement('tr');
      element.innerHTML = '<td>Download GeoTiff</td><td><a href="' + geoTiffLink + '">Link</a></td>';
      fragment.appendChild(element);
      description.appendChild(fragment);
   }


   // atlphdata | atlpp section.
   if(id && collection && collection == "atlphdata") {
      console.log("ATL Population and Housing Data.");
      var excelLink = "https://static.library.gsu.edu/atlphdata/excel/" + id + ".xls";
      var csvLink = "https://static.library.gsu.edu/atlphdata/csv/" + id + ".zip";
      var element = document.createElement('tr');
      var description = document.querySelector('.item-description');
      var fragment = document.createDocumentFragment();

      element.innerHTML = '<td>Excel Tables</td><td><a href="' + excelLink + '">Link</a></td>';
      fragment.appendChild(element);
      element = document.createElement('tr');
      element.innerHTML = '<td>CSV Tables</td><td><a href="' + csvLink + '">Link</a></td>';
      fragment.appendChild(element);
      element = document.createElement('tr');
      description.appendChild(fragment);
   }


   // planATLpubs | atlpp section.
   if(id && collection && (collection == "planATLpubs" || collection == "atlphdata")) {
      console.log("Adding search link to planATLpubs and atlphdata.");
      var searchLink = window.location.origin + "/digital/search/collection/atlmaps/searchterm/" + id;
      var element = document.createElement('tr');
      var description = document.querySelector('.item-description');

      element.innerHTML = '<td>View Maps from this Publication</td><td><a href="' + searchLink + '">Link</a></td>';
      description.appendChild(element);
   }
});

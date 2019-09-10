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

// "cdm-app:ready" fires off first, followed by enter events then ready events.

// .Header-logoHolder contains logo
// #headerNameDiv contains the title
// .SimpleSearch-searchBox contains the searchbox in another location
// all three should probably be in .Header-logoNameContainer
// .Header-hambuergerHolder is in .Header-controls and will need attention at some point (move to menu?)



// Various fixes.
function gsuFixes() {
   var styleId = "gsuStyle";
   // Add our CSS to the page for easy editing.
   if(!document.getElementById(styleId)) {
      var link = document.createElement("link");
      link.id = styleId;
      link.rel = "stylesheet";
      link.href = "https://static.library.gsu.edu/contentdm/styles.css";
      document.head.appendChild(link);
   }


   var fontId = "gsuFont";

   // Add lato font to pages.
   if(!document.getElementById(fontId)) {
      var link = document.createElement("link");
      link.id = fontId;
      link.rel = "stylesheet";
      link.href = "https://fonts.googleapis.com/css?family=Lato&display=swap";
      document.head.appendChild(link);
   }


   var wrapperId = "gsuWrapper";

   // Wrap content in container.
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
      var newTitle = document.createElement("h2");
      newTitle.innerHTML = '<a href="https://digital.library.gsu.edu">Digital Collections</a>';
      var newSubTitle = document.createElement('h3');
      newSubTitle.innerHTML = '<a href="https://library.gsu.edu/">Georgia State University Library</a>';
      var div = document.createElement("div");
      div.setAttribute("id", titleId);
      div.innerHTML = newTitle.outerHTML + newSubTitle.outerHTML;
      titleDiv.innerHTML = div.outerHTML;
   }


   // Header tweaks
   var headerId = "gsuHeader";

   if(!document.getElementById(headerId)) {
      var headerParent = document.querySelector(".Header-logoNameContainer");
      var logo = document.querySelector(".Header-logoHolder");
      logo.classList.add("col-sm-3");
      var title = document.getElementById("headerNameDiv");
      title.classList.add("col-sm-6");
      var search = document.querySelector(".SimpleSearch-searchBox");
      search.classList.add("col-sm-3");
      var wrapper = document.createElement("div");
      wrapper.setAttribute("id", headerId);
      wrapper.className = "row";
      headerParent.insertBefore(wrapper, logo);
      wrapper.appendChild(logo);
      wrapper.appendChild(title);
      wrapper.appendChild(search);
   }
}


// Home page ready
function gsuHomePageReady() {
   // Change cards to col-sm-3s.
   var cards = document.querySelectorAll(".Card-cardcontainer.col-sm-6");

   cards.forEach(function(card) {
      card.classList.remove("col-sm-6");
      card.classList.add("col-sm-3");
   });
}


// For the item Page
function gsuItemPageReady() {
   var id = document.querySelector('.field-identi .field-value span');
   id = id ? id.innerHTML : null;

   var geo = document.querySelector('.field-georef .field-value span');
   geo = geo ? (geo.innerHTML.toLowerCase() == "yes" ? true : false) : false;

   var itemLink = document.querySelector('.ItemUrl-itemUrlLink a');
   itemLink = itemLink ? itemLink.href.replace(/^http:\/\//i, 'https://') : null;

   var collection = window.location.href.match(/collection\/([a-zA-Z0-9-_]+)\//i)[1];


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
      var fragment = document.createDocumentFragment();

      var element = document.createElement('div');
      element.className = "btn-group btn-group-default";
      element.innerHTML = '<button class="cdm-btn btn btn-primary"><a target="_blank" href="'+googleMapsLink+'"><span class="fa fa-2x fa-map"> Maps</span></a></button>';
      fragment.appendChild(element);
      element = document.createElement('div');
      element.className = "btn-group btn-group-default";
      element.innerHTML = '<button class="cdm-btn btn btn-primary"><a href="'+googleEarthLink+'"><span class="fa fa-2x fa-globe"> Google Earth</span></a></button>';
      fragment.appendChild(element);
      element = document.createElement('div');
      element.className = "btn-group btn-group-default";
      element.innerHTML = '<button class="cdm-btn btn btn-primary"><a href="'+geoTiffLink+'"><span class="fa fa-2x fa-download"> GeoTiff</span></a></button>';
      fragment.appendChild(element);

      var toolbars = document.querySelectorAll(".btn-toolbar");
      toolbars.forEach(function(bar) {
         bar.appendChild(fragment.cloneNode(true));
      });
   }


   // atlphdata
   if(id && collection && collection == "atlphdata") {
      console.log("ATL Population and Housing Data.");
      var excelLink = "https://static.library.gsu.edu/atlphdata/excel/" + id + ".xls";
      var csvLink = "https://static.library.gsu.edu/atlphdata/csv/" + id + ".zip";
      var fragment = document.createDocumentFragment();

      var element = document.createElement('div');
      element.className = "btn-group btn-group-default";
      element.innerHTML = '<button class="cdm-btn btn btn-primary"><a href="'+excelLink+'"><span class="fa fa-2x fa-file"> Excel</span></a></button>';
      fragment.appendChild(element);
      element = document.createElement('div');
      element.className = "btn-group btn-group-default";
      element.innerHTML = '<button class="cdm-btn btn btn-primary"><a href="'+csvLink+'"><span class="fa fa-2x fa-file"> CSV</span></a></button>';
      fragment.appendChild(element);


      var toolbars = document.querySelectorAll(".btn-toolbar");
      toolbars.forEach(function(bar) {
         bar.appendChild(fragment.cloneNode(true));
      });
   }


   // planATLpubs | atlphdata section.
   if(id && collection && (collection == "planATLpubs" || collection == "atlphdata")) {
      console.log("Adding search link to planATLpubs and atlphdata.");
      var searchLink = "/digital/search/collection/atlmaps/searchterm/" + id;

      var element = document.createElement('div');
      element.className = "btn-group btn-group-default";
      element.innerHTML = '<button class="cdm-btn btn btn-primary"><a href="'+searchLink+'"><span class="fa fa-2x fa-search"> View Maps</span></a></button>';

      var toolbars = document.querySelectorAll(".btn-toolbar");
      toolbars.forEach(function(bar) {
         bar.appendChild(element.cloneNode(true));
      });
   }
}


// For the home page.
document.addEventListener("cdm-home-page:ready", function() {
   gsuFixes();
   gsuHomePageReady();
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
   gsuItemPageReady();
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

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

// Global to halt JS.
var debugJs = false

// Various fixes.
function gsuFixes() {
   var debugCss = false;
   var params = document.location.search.slice(1).split('&');

   // Find out what kind of debugging we are doing.
   for(i = 0; i < params.length; i++) {
      if(params[i].startsWith('debugCss')) {
         debugCss = true;
      }
      else if(params[i].startsWith('debugJs')) {
         debugJs = true;
      }
   }

   if(debugCss) {
      links = document.getElementsByTagName('link');

      for(var i = 0; i < links.length; i++) {
         if(links[i].getAttribute('href') == '/customizations/global//styles.min.css') {
            console.log('Removing local CSS.');
            links[i].parentNode.removeChild(links[i]);

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

   if(debugJs) {
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
      var newTitle = document.createElement("h2");
      newTitle.innerHTML = '<a href="https://digitalcollections.library.gsu.edu">Digital Collections</a>';
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

      document.querySelector(".Header-logoImage").parentNode.href = "https://library.gsu.edu";
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


// For the item Page
function gsuItemPageReady() {
   var id = document.querySelector('.field-identi .field-value span');
   id = id ? id.innerHTML : null;
   id = id.replace(/<[^>]*>?/gm, ''); // Remove any tags that may be in here.

   var geo = document.querySelector('.field-georef .field-value span');
   geo = geo ? geo.innerHTML.toLowerCase().replace(/<[^>]*>?/gm, '') : null;
   geo = geo == "yes" ? true : false;

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
   if(!debugJs) { gsuHomePageReady(); }
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
   if(!debugJs) { gsuItemPageReady(); }
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

export { item_page_tweaks };


// For the item page.
function item_page_tweaks() {
   var collection = window.location.href.match(/collection\/([a-zA-Z0-9-_]+)\//i)[1];
   var collectionText = document.querySelector('.field-digcol .field-value');

   var collToSlug = [
      {
         name: 'Planning Atlanta, A New City in the Making, 1930s-1990s - City Planning Maps',
         slug: 'atlmaps'
      }, {
         name: 'Planning Atlanta, A New City in the Making, 1930s-1990s - Oral Histories',
         slug: 'atlpoh'
      }, {
         name: 'Planning Atlanta, A New City in the Making, 1949 - Aerial Mosaic and Photographs',
         slug: 'atlaerial'
      }, {
         name: 'Planning Atlanta, A New City in the Making, 1930s-1990s - Photographs',
         slug: 'atlphotos'
      }, {
         name: 'Planning Atlanta, A New City in the Making, 1930s-1990s - Planning Publications',
         slug: 'planATLpubs'
      }, {
         name: 'Planning Atlanta, A New City in the Making, 1930s-1990s - Population-Housing Data',
         slug: 'atlphdata'
      }
   ];

   // If the collectionText is one of the collToSlug items, use the slug in the array instead of the URL.
   if(collectionText && (collectionText = collectionText.textContent)) {
      var collection2 = collToSlug.find((collection) => (collection.name === collectionText));

      if(typeof(collection2) !== 'undefined') {
         collection = collection2.slug;
      }
   }

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
      console.log("This item is georeferenced with a collection of " + collection + " and an id of " + id + ".");
      //var googleMapsLink = "https://geo.library.gsu.edu/mapoverlay.php?collection=" + collection + "&map=" + id;
      var googleMapsLink = "https://webapps.library.gsu.edu/overlay/" + collection + "/" + id + "/";
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
      var searchLink = "/digital/search/collection/PlanATL/searchterm/" + id;

      var element = document.createElement('div');
      element.className = "btn-group btn-group-default";
      element.innerHTML = '<a class="cdm-btn btn btn-primary gsu-button" href="'+searchLink+'"><span class="fa fa-search"></span> View Item\'s Maps</a>';

      var toolbars = document.querySelectorAll(".btn-toolbar");

      for(i = 0; i < toolbars.length; i++) {
         toolbars[i].appendChild(element.cloneNode(true));
      }
   }
}

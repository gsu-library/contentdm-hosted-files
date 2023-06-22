export { mirador_integration };


/**
 * Mirador 2 Integration
 *
 * @version 2.7?
 * @url https://help.oclc.org/Metadata_Services/CONTENTdm/Advanced_website_customization/Customization_cookbook/Mirador_2_integration
 */
function mirador_integration() {
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
     'afpl'
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
};

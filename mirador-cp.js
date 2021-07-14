var addMiradorCss = function () {
   var cssId = 'mirador'; // you could encode the css path itself to generate id..
   if (!document.getElementById(cssId)) {
     var link = document.createElement('link');
     link.id = cssId;
     link.rel = 'stylesheet';
     link.type = 'text/css';
     link.href = '/customizations/global/pages/mirador/css/mirador-combined.css';
     link.media = 'all';
     document.head.appendChild(link);
   }
 }

 var initMirador = function () {
   var query = {};
   location.search.split(/\&|\?/g).forEach(function(it) {
     if (it) {
       var parts = it.split('=');
       var key = parts[0];
       var value = parts[1];
       query[key] = value;
     }
   });

   var options = {
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
       canvasID: query['canvas'] || '',
       annotationLayer: false
     }];
   }

   Mirador(options);
 }

 /*
 2020-04-27 disable annotation view
 */

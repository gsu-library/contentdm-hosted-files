var addMiradorCss=function(){var a="mirador";if(!document.getElementById(a)){var i=document.createElement("link");i.id=a,i.rel="stylesheet",i.type="text/css",i.href="/customizations/global/pages/mirador/css/mirador-combined.css",i.media="all",document.head.appendChild(i)}},initMirador=function(){var a={};location.search.split(/\&|\?/g).forEach((function(i){if(i){var t=i.split("="),e=t[0],n=t[1];a[e]=n}}));var i={id:"viewer",data:[],buildPath:"/customizations/global/pages/mirador/"};a.manifest&&(i.data.push({manifestUri:a.manifest,location:a.collection||""}),i.windowObjects=[{loadedManifest:a.manifest,canvasID:a.canvas||"",annotationLayer:!1}]),Mirador(i)};

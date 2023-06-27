export { all_pages_tweaks };


// TODO: move harmful content to this file?
// Various fixes.
function all_pages_tweaks() {
   var debugCss = false, removeCss = false;
   var removeJs = false;
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


  // Move access note and disclaimer to top of metadata table.
  let table, access, discl;

  if(table = document.querySelector('.ItemView-itemMetadata')) {
    if(discl = document.querySelector('.field-discl')) {
      table.prepend(discl);
    }
    if(access = document.querySelector('.field-access')) {
      table.prepend(access);
    }
  }
}

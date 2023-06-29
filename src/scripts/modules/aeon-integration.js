export { aeon_button };


/**
 * Adds an Aeon request item button to item pages.
 */
function aeon_button() {
   // CONTENTdm Aeon request button javascript
   // Version 2018.10.24

   // CONFIGURE THE baseURL THAT POINTS TO YOUR AEON SERVER
   var baseUrl = 'https://gsu.aeon.atlas-sys.com/logon';

   // CONFIGURE THE TEXT DISPLAYED ON THE AEON REQUEST BUTTON
   var buttonText = 'Request Item';

   // CONFIGURE THE TEXT DISPLAY ON THE BUTTON FOR REQUESTING FOR READING ROOM (LOAN) USE
   var loanButtonText = 'Request in Reading Room';

   // CONFIGURE THE TEXT DISPLAY ON THE BUTTON FOR REQUESTING FOR PHOTODUPLICATION (COPY) USE
   var copyButtonText = 'Digital Copy/Licensing';

   // CONFIGURE WHETHER TO USE DEFAULT OR GENERIC REQUEST FORMS FOR READING ROOM (LOAN) REQUESTS
   var loanUseDefaultForms = false;
   // IF loanUseDefaultForms IS false THEN CONFIGURE THE GENERIC REQUEST FORM TO USE FOR READING ROOM (LOAN) REQUESTS
   // SEE https://support.atlas-sys.com/hc/en-us/articles/360011920173-Creating-New-Request-Forms FOR MORE INFORMATION
   var loanGenericRequestForm = 'GenericRequestManuscript';

   // CONFIGURE WHETHER TO USE DEFAULT OR GENERIC REQUEST FORMS FOR PHOTODUPLICATION (COPY) REQUESTS
   var copyUseDefaultForms = false;
   // IF copyUseDefaultForms IS false THEN CONFIGURE THE GENERIC REQUEST FORM TO USE FOR PHOTODUPLICATION (COPY) REQUESTS
   // SEE https://support.atlas-sys.com/hc/en-us/articles/360011920173-Creating-New-Request-Forms FOR MORE INFORMATION
   var copyGenericRequestForm = 'GenericRequestManuscriptPhotodup';

   // FIELD MAPPINGS
   // Item Info fields corresponding to Aeon fields
   // Format:
   // Aeon field name: 'ContentDM identifier'
   var fieldMappings = {
       ItemTitle: 'collec',
       ItemSubTitle: 'title',
       ItemDate: 'date',
       DocumentType: '',
       ItemAuthor: 'creato',
       ItemAuthor2: 'interv',
       ItemAuthor3: 'photog',
       ItemPlace: '',
       ItemPublisher: '',
       ItemEdition: '',
       ItemVolume: 'box',
       ItemIssue: 'folder',
       ItemIssue2: 'file',
       ItemPages: '',
       Location: 'curato',
       SubLocation: '',
       PageCount: '',
       ItemISxN: '',
       ItemCitation: '',
       ItemNumber: 'identi',
       ItemNumber2: 'arrang',
       EADNumber: '',
       ReferenceNumber: '',
       CallNumber: 'call',
       Format: 'sourca',
       ServiceLevel: '',
       ShippingOption: '',
       ForPublication: '',
       ItemInfo1: 'righth',
       ItemInfo2: 'note',
       ItemInfo3: '',
       ItemInfo4: '',
       ItemInfo5: ''
   }

   // OTHER SETTINGS - PLEASE DO NOT MODIFY
   var aeonButtonOptionOpen = false;
   var view = null;
   var itemInfo = null;
   var objectInfo = null;
   var parent = null;
   var parentItemInfo = null;
   var childItemInfo = null;

   document.addEventListener('cdm-item-page:ready', function (e) {
      if (document.getElementById('singleItemDescription')) {
         view = 'single item';
      } else if (document.getElementById('compoundItemDescription')) {
         view = 'compound object'
      }
      getItemInfo(e.detail.collectionId, e.detail.itemId).then(response => itemInfo = response);
      getObjectInfo(e.detail.collectionId, e.detail.itemId).then(response => objectInfo = response);
      getParent(e.detail.collectionId, e.detail.itemId).then(response => parent = response);
      getParentItemInfo(e.detail.collectionId, e.detail.itemId).then(response => parentItemInfo = response);
      getChildItemInfo(e.detail.collectionId, e.detail.itemId).then(response => parentItemInfo = response);

      if (view && ((view === 'single item') || (view === 'compound object'))) {
         if (document.getElementsByClassName('btn-toolbar')) {
               var btnToolbar = document.getElementsByClassName('btn-toolbar');

               var buttonMobileHTML = '<button title="Aeon Request" aria-label="Aeon Request" data-metrics-event-name="event" data-metrics-merge-pagedefaults="true" data-metrics-event-category="' + view + '" data-metrics-event-action="click" data-metrics-event-label="Aeon request menu" id="aeon-dropdown-mobile" role="button" aria-haspopup="true" aria-expanded="false" type="button" class="cdm-btn dropdown-toggle btn btn-primary" style="height: 36px;"><span style="display: none;width: 24px;height: 24px;background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAk1BMVEX////15uT48O789/b47+389/b89/b15uT47+389/b89/bKW0PZlYvGSCfkuLHdopnKW0PowrzKXEXry8fy3tvObVvObFndoZjSfG3ry8bViHzv1dHViX357+768vHXj4TnwbzZlovqyMTdpJzfqKDszsrsz8rfqqLv1tLx2tfhrqb15+Xhrqfjta/+/f347ez37OqPABpgAAAADXRSTlMAPz8/R0djeHiDk+/vTVNvBAAAAIdJREFUeF6Nz8UOw1AQQ9FiinceB6HM+P9fVyVRu+4sj2TZ0/vvxneNscngC/2FSdkoJOtgGEOR4hE9auGgLNanLgjLFvLSmGCrqzHQgobgil1VC0wbiKGh9/MI8wYeIuK8f9UK3UYyIJjb5QxJ17tShSuVgI46iE4gCuLJb3u23et8Pfvv0Q8/FQoOmpKY8QAAAABJRU5ErkJggg==);background-size: 24px;"></span><span id="aeon_button_text_mobile" class="menu_button_text" style="font-size: 15px;padding: 10px;vertical-align: super;">Aeon Request</span><span class="caret" style="margin-top: -15px;"></span></button><ul id="aeonrequestmenu-side-bar-mobile" role="menu" class="dropdown-menu" aria-labelledby="aeon-dropdown"><li role="presentation"><a id="aeon_button_option_loan_mobile" class="aeon_button_option spacePad5" iopt="Loan">Request for Reading Room</a></li><li role="presentation"><a id="aeon_button_option_copy_mobile" class="aeon_button_option spacePad5" iopt="Copy">Request Copy</a></li></ul>';
               var aeonButtonMobile = document.createElement("div");
               aeonButtonMobile.setAttribute("class", "ItemDownloadImage-itemDownloadDropdown dropdown btn-group");
               aeonButtonMobile.setAttribute("id", "aeon_button_container_mobile");
               aeonButtonMobile.innerHTML = buttonMobileHTML;
               btnToolbar[0].appendChild(aeonButtonMobile);

               var buttonHTML = '<button title="Aeon Request" aria-label="Aeon Request" data-metrics-event-name="event" data-metrics-merge-pagedefaults="true" data-metrics-event-category="' + view + '" data-metrics-event-action="click" data-metrics-event-label="Aeon request menu" id="aeon-dropdown" role="button" aria-haspopup="true" aria-expanded="false" type="button" class="cdm-btn dropdown-toggle btn btn-primary" style="height: 36px;"><span style="display: none;width: 24px;height: 24px;background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAk1BMVEX////15uT48O789/b47+389/b89/b15uT47+389/b89/bKW0PZlYvGSCfkuLHdopnKW0PowrzKXEXry8fy3tvObVvObFndoZjSfG3ry8bViHzv1dHViX357+768vHXj4TnwbzZlovqyMTdpJzfqKDszsrsz8rfqqLv1tLx2tfhrqb15+Xhrqfjta/+/f347ez37OqPABpgAAAADXRSTlMAPz8/R0djeHiDk+/vTVNvBAAAAIdJREFUeF6Nz8UOw1AQQ9FiinceB6HM+P9fVyVRu+4sj2TZ0/vvxneNscngC/2FSdkoJOtgGEOR4hE9auGgLNanLgjLFvLSmGCrqzHQgobgil1VC0wbiKGh9/MI8wYeIuK8f9UK3UYyIJjb5QxJ17tShSuVgI46iE4gCuLJb3u23et8Pfvv0Q8/FQoOmpKY8QAAAABJRU5ErkJggg==);background-size: 24px;"></span><span id="aeon_button_text" class="menu_button_text" style="font-size: 15px;padding: 10px;vertical-align: super;">Aeon Request</span><span class="caret" style="margin-top: -15px;"></span></button><ul id="aeonrequestmenu-side-bar" role="menu" class="dropdown-menu" aria-labelledby="aeon-dropdown"><li role="presentation"><a id="aeon_button_option_loan" class="aeon_button_option spacePad5" iopt="Loan" style="cursor:pointer">Request for Reading Room</a></li><li role="presentation"><a id="aeon_button_option_copy" class="aeon_button_option spacePad5" iopt="Copy" style="cursor:pointer">Request Copy</a></li></ul>';
               var aeonButton = document.createElement("div");
               aeonButton.setAttribute("class", "ItemDownloadImage-itemDownloadDropdown dropdown btn-group");
               aeonButton.setAttribute("id", "aeon_button_container");
               aeonButton.innerHTML = buttonHTML;
               btnToolbar[1].appendChild(aeonButton);

               aeonButtonInit();

               window.addEventListener('click', function (e) {
                if (!(document.getElementById('aeon-dropdown').contains(e.target))) {
                    document.getElementById("aeonrequestmenu-side-bar").classList.remove("show");
                    document.getElementById("aeon_button_container").classList.remove("open");
                    document.getElementById("aeon-dropdown").setAttribute("aria-expanded", "false");
                }
                if (!(document.getElementById('aeon-dropdown-mobile').contains(e.target))) {
                    document.getElementById("aeonrequestmenu-side-bar-mobile").classList.remove("show");
                    document.getElementById("aeon_button_container_mobile").classList.remove("open");
                    document.getElementById("aeon-dropdown-mobile").setAttribute("aria-expanded", "false");
                }
               });
         }
      } else {
         console.log("Cannot find view element");
      }

   });

   document.addEventListener('cdm-item-page:update', function (e) {
      getItemInfo(e.detail.collectionId, e.detail.itemId).then(response => itemInfo = response);
      getObjectInfo(e.detail.collectionId, e.detail.itemId).then(response => objectInfo = response);
      getParent(e.detail.collectionId, e.detail.itemId).then(response => parent = response);
      getParentItemInfo(e.detail.collectionId, e.detail.itemId).then(response => parentItemInfo = response);
      getChildItemInfo(e.detail.collectionId, e.detail.itemId).then(response => childItemInfo = response);
   });

   function getItemInfo(collection, item) {
       return fetch('/digital/bl/dmwebservices/index.php?q=dmGetItemInfo/' + collection + '/' + item + '/json')
       .then((response) => response.json())
       .then((responseData) => {
           console.log('Item Info');
           console.log(responseData);
           return responseData;
       })
       .catch(error => console.warn(error));
   }

   function getObjectInfo(collection, item) {
       return fetch('/digital/bl/dmwebservices/index.php?q=dmGetCompoundObjectInfo/' + collection + '/' + item + '/json')
       .then((response) => response.json())
       .then((responseData) => {
           console.log('Object Info');
           console.log(responseData);
           return responseData;
       })
       .catch(error => console.warn(error));
   }

   function getParent(collection, item) {
       return fetch('/digital/bl/dmwebservices/index.php?q=GetParent/' + collection + '/' + item + '/json')
       .then((response) => response.json())
       .then((responseData) => {
           return responseData;
       })
       .catch(error => console.warn(error));
   }

   function getParentItemInfo(collection, item) {
       return fetch('/digital/bl/dmwebservices/index.php?q=GetParent/' + collection + '/' + item + '/json')
       .then((response) => response.json())
       .then((responseData) => {
           return fetch('/digital/bl/dmwebservices/index.php?q=dmGetItemInfo/' + collection + '/' + responseData['parent'] + '/json')
           .then((response) => response.json())
           .then((responseData) => {
               console.log('Parent Item Info');
               console.log(responseData);
               return responseData;
           })
           .catch(error => console.warn(error));
       })
       .catch(error => console.warn(error));
   }

   function getChildItemInfo(collection, item) {
       return fetch('/digital/bl/dmwebservices/index.php?q=dmGetCompoundObjectInfo/' + collection + '/' + item + '/json')
       .then((response) => response.json())
       .then((responseData) => {
           return fetch('/digital/bl/dmwebservices/index.php?q=dmGetItemInfo/' + collection + '/' + responseData['page'][0]['pageptr'] + '/json')
           .then((response) => response.json())
           .then((responseData) => {
               console.log('Child Item Info');
               console.log(responseData);
               return responseData;
           })
           .catch(error => console.warn(error));
       })
       .catch(error => console.warn(error));
   }

   // Constructs base Aeon request
   function createRequest(requestType) {
       var request = {};

       // Default mappings for Aeon Requests
       // Will copy Item Description Info for Single Items
       // Will copy Object Description Info for Compound Items
       request['ItemTitle'] = itemInfo[fieldMappings.ItemTitle];
       request['ItemSubTitle'] = itemInfo[fieldMappings.ItemSubTitle];
       request['ItemDate'] = itemInfo[fieldMappings.ItemDate];
       request['DocumentType'] = itemInfo[fieldMappings.DocumentType];
       request['ItemAuthor'] = itemInfo[fieldMappings.ItemAuthor] + ', ' + itemInfo[fieldMappings.ItemAuthor2] + ', ' + itemInfo[fieldMappings.ItemAuthor3];
       request['ItemPlace'] = itemInfo[fieldMappings.ItemPlace];
       request['ItemPublisher'] = itemInfo[fieldMappings.ItemPublisher];
       request['ItemEdition'] = itemInfo[fieldMappings.ItemEdition];
       request['ItemVolume'] = itemInfo[fieldMappings.ItemVolume];
       request['ItemIssue'] = itemInfo[fieldMappings.ItemIssue] + ', ' + itemInfo[fieldMappings.ItemIssue2];
       request['ItemPages'] = itemInfo[fieldMappings.ItemPages];
       request['Location'] = itemInfo[fieldMappings.Location];
       request['SubLocation'] = itemInfo[fieldMappings.SubLocation];
       request['PageCount'] = itemInfo[fieldMappings.PageCount];
       request['ItemISxN'] = itemInfo[fieldMappings.ItemISxN];
       request['ItemCitation'] = window.location.href;
      //  request['ItemCitation'] = itemInfo[fieldMappings.ItemCitation];
       request['ItemNumber'] = itemInfo[fieldMappings.ItemNumber] + ', ' + itemInfo[fieldMappings.ItemNumber2];
       request['EADNumber'] = itemInfo[fieldMappings.EADNumber];
       request['ReferenceNumber'] = itemInfo[fieldMappings.ReferenceNumber];
       request['CallNumber'] = itemInfo[fieldMappings.CallNumber];
       request['Format'] = itemInfo[fieldMappings.Format];
       request['ServiceLevel'] = itemInfo[fieldMappings.ServiceLevel];
       request['ShippingOption'] = itemInfo[fieldMappings.ShippingOption];
       request['ForPublication'] = itemInfo[fieldMappings.ForPublication];
       request['ItemInfo1'] = itemInfo[fieldMappings.ItemInfo1];
       request['ItemInfo2'] = itemInfo[fieldMappings.ItemInfo2];
       request['ItemInfo3'] = itemInfo[fieldMappings.ItemInfo3];
       request['ItemInfo4'] = itemInfo[fieldMappings.ItemInfo4];
       request['ItemInfo5'] = itemInfo[fieldMappings.ItemInfo5];

       if (parent['parent'] == -1 && objectInfo['code'] != -2 && childItemInfo !== null) {
           // Field Mappings for the "Main Page" of compound items
           // itemInfo contains the fields inside the "Object Description"
           // childItemInfo contains the fields inside the "Item Description" of the first page

           // By default, this will copy the Object's data, not the Item's
           // You only need to include any mappings in this block if you want the Item's data

           // For example, if you want the request to copy the Item's "ItemTitle" field
           // (mapped at the beginning of the file), you would have:
           // request['ItemTitle'] = childItemInfo[fieldMappings.ItemTitle];
           request['ItemSubTitle'] = childItemInfo[fieldMappings.ItemSubTitle];

           // NOTE: Any changes made here should be mirrored in the below section

       }
       else if (parent['parent'] != -1) {
           // Field Mappings for the individual pages of compound items
           // itemInfo contains the fields inside the "Item Description" of the current page
           // parentItemInfo contains the fields inside the "Object Description"

           // By default, this will copy the Object's data, not the Item's
           // If you want the Item's data, you can remove one of the mappings here

           // For example, if you want the request to copy the Item's "ItemTitle" field
           // (mapped at the beginning of the file), you would remove:
           // request['ItemTitle'] = parentItemInfo[fieldMappings.ItemTitle];

           // NOTE: Any changes made here should be mirrored in the above section

           request['ItemTitle'] = parentItemInfo[fieldMappings.ItemTitle];
           //  request['ItemSubTitle'] = parentItemInfo[fieldMappings.ItemSubTitle];
           request['ItemDate'] = parentItemInfo[fieldMappings.ItemDate];
           request['DocumentType'] = parentItemInfo[fieldMappings.DocumentType];
           request['ItemAuthor'] = parentItemInfo[fieldMappings.ItemAuthor] + ', ' + parentItemInfo[fieldMappings.ItemAuthor2] + ', ' + parentItemInfo[fieldMappings.ItemAuthor3];
           request['ItemPlace'] = parentItemInfo[fieldMappings.ItemPlace];
           request['ItemPublisher'] = parentItemInfo[fieldMappings.ItemPublisher];
           request['ItemEdition'] = parentItemInfo[fieldMappings.ItemEdition];
           request['ItemVolume'] = parentItemInfo[fieldMappings.ItemVolume];
           request['ItemIssue'] = parentItemInfo[fieldMappings.ItemIssue] + ', ' + parentItemInfo[fieldMappings.ItemIssue2];
           request['ItemPages'] = parentItemInfo[fieldMappings.ItemPages];
           request['Location'] = parentItemInfo[fieldMappings.Location];
           request['SubLocation'] = parentItemInfo[fieldMappings.SubLocation];
           request['PageCount'] = parentItemInfo[fieldMappings.PageCount];
           request['ItemISxN'] = parentItemInfo[fieldMappings.ItemISxN];
           request['ItemCitation'] = parentItemInfo[fieldMappings.ItemCitation];
           request['ItemNumber'] = parentItemInfo[fieldMappings.ItemNumber] + ', ' + parentItemInfo[fieldMappings.ItemNumber2];
           request['EADNumber'] = parentItemInfo[fieldMappings.EADNumber];
           request['ReferenceNumber'] = parentItemInfo[fieldMappings.ReferenceNumber];
           request['CallNumber'] = parentItemInfo[fieldMappings.CallNumber];
           request['Format'] = parentItemInfo[fieldMappings.Format];
           request['ServiceLevel'] = parentItemInfo[fieldMappings.ServiceLevel];
           request['ShippingOption'] = parentItemInfo[fieldMappings.ShippingOption];
           request['ForPublication'] = parentItemInfo[fieldMappings.ForPublication];
           request['ItemInfo1'] = parentItemInfo[fieldMappings.ItemInfo1];
           request['ItemInfo2'] = parentItemInfo[fieldMappings.ItemInfo2];
           request['ItemInfo3'] = parentItemInfo[fieldMappings.ItemInfo3];
           request['ItemInfo4'] = parentItemInfo[fieldMappings.ItemInfo4];
           request['ItemInfo5'] = parentItemInfo[fieldMappings.ItemInfo5];
       }

       // Do Not Modify: Request Type is set by clicking the dropdown menu
       request['RequestType'] = requestType;
       console.log('Request');
       console.dir(request);
       return request;
   }

   // Constructs URL for Aeon request submission and opens in a new window
   function sendToAeon(request) {
       var url = baseUrl;

       if (request['RequestType'] === 'Loan') {
           if (loanUseDefaultForms) {
               url = url + '?Action=10&Form=21'
           }
           else {
               url = url + '?Action=10&Form=20&Value=' + loanGenericRequestForm;
           }
       }
       else {
           if (copyUseDefaultForms) {
               url = url + '?Action=10&Form=23';
           }
           else {
               url = url + '?Action=10&Form=20&Value=' + copyGenericRequestForm;
           }
       }

   // Build query parameters from request

       var query = [];

       for (var i in request) {
           if (request[i] && (request[i] !== '')) {
               query.push(i + '=' + encodeURIComponent(request[i]));
           }
       }

   // Construct URL

       url = url + '&' + query.join('&');

       console.log('Aeon Request -> ' + url);
       window.open(url);
   }

   function aeonButtonInit() {

       var aeonButton = document.getElementById('aeon-dropdown');
       var aeonButtonText = document.getElementById('aeon_button_text');
       var aeonLoanButton = document.getElementById('aeon_button_option_loan');
       var aeonCopyButton = document.getElementById('aeon_button_option_copy');
       aeonButtonText.innerHTML = buttonText;
       aeonButton.onclick = function () { showDropdown(false) };
       aeonLoanButton.innerHTML = loanButtonText;
       aeonLoanButton.onclick = function () { aeonButtonClick("Loan") };
       aeonCopyButton.innerHTML = copyButtonText;
       aeonCopyButton.onclick = function () { aeonButtonClick("Copy") };

       var aeonButtonMobile = document.getElementById('aeon-dropdown-mobile');
       var aeonButtonMobileText = document.getElementById('aeon_button_text_mobile');
       var aeonLoanButtonMobile = document.getElementById('aeon_button_option_loan_mobile');
       var aeonCopyButtonMobile = document.getElementById('aeon_button_option_copy_mobile');
       aeonButtonMobileText.innerHTML = buttonText;
       aeonButtonMobile.onclick = function () { showDropdown(true) };
       aeonLoanButtonMobile.innerHTML = loanButtonText;
       aeonLoanButtonMobile.onclick = function () { aeonButtonClick("Loan") };
       aeonCopyButtonMobile.innerHTML = copyButtonText;
       aeonCopyButtonMobile.onclick = function () { aeonButtonClick("Copy") };
   }

   function aeonButtonClick(selectedOption) {
       var request = createRequest(selectedOption);
       sendToAeon(request);
   }

   function showDropdown(mobile) {
       if (mobile) {
           document.getElementById("aeonrequestmenu-side-bar-mobile").classList.toggle("show");
           document.getElementById("aeon_button_container_mobile").classList.toggle("open");
           document.getElementById("aeon-dropdown-mobile").setAttribute("aria-expanded", "true");
       } else {
           document.getElementById("aeonrequestmenu-side-bar").classList.toggle("show");
           document.getElementById("aeon_button_container").classList.toggle("open");
           document.getElementById("aeon-dropdown").setAttribute("aria-expanded", "true");
       }
   }
}

/***************************************************************************************************
*
* CONTENTdm Hosted Script - <https://github.com/gsu-library/css-js-toolbox-code-blocks>
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
// TODO: have better debugging logic.
// TODO: add debug url parameters to all anchor tags
// TODO: use strict
// TODO: do something with var removeJs
// TODO: create arrays for events and map them

import { all_pages_tweaks } from "./modules/gsu-all-pages";
import { home_page_tweaks } from "./modules/gsu-home-page";
import { item_page_tweaks } from "./modules/gsu-item-page";
import { offensive_content_popup } from "./modules/gsu-offensive-content";
import { aeon_button } from "./modules/aeon-integration";
import { rights_licenses_badges } from "./modules/rights-licenses-badges";
import { mirador_integration } from "./modules/mirador-integration";
import { insert_iiif_links } from "./modules/insert-iiif-links";


// var removeJs = false


// For the home page.
document.addEventListener("cdm-home-page:ready", function() {
   all_pages_tweaks();
   // if(!removeJs) { home_page_tweaks(); }
   home_page_tweaks();
   offensive_content_popup();
});


// For the browse/search page.
document.addEventListener("cdm-search-page:ready", function() {
   all_pages_tweaks();
   offensive_content_popup();
});


// For the collection search page.
document.addEventListener("cdm-collection-search-page:ready", function() {
   all_pages_tweaks();
   offensive_content_popup();
});


// For the advanced search page.
document.addEventListener("cdm-advanced-search-page:ready", function() {
   all_pages_tweaks();
   offensive_content_popup();
});


// For collection landing pages.
document.addEventListener("cdm-collection-landing-page:ready", function() {
   all_pages_tweaks();
   offensive_content_popup();
});


// Custom CDM call for an item page ready state.
document.addEventListener('cdm-item-page:ready', function(){
   all_pages_tweaks();
   // if(!removeJs) { item_page_tweaks(); }
   item_page_tweaks();
   offensive_content_popup();
});


// For custom pages.
document.addEventListener("cdm-custom-page:ready", function() {
   all_pages_tweaks();
   offensive_content_popup();
});


// For the about page.
document.addEventListener("cdm-about-page:ready", function() {
   all_pages_tweaks();
   offensive_content_popup();
});


// For collection pages.
// No longer used?
// document.addEventListener("cdm-collection-page:ready", function() {
//    all_pages_tweaks();
// });



// For the login page.
document.addEventListener("cdm-login-page:ready", function() {
   all_pages_tweaks();
   offensive_content_popup();
});


// For the not found page.
document.addEventListener("cdm-notfound-page:ready", function() {
   all_pages_tweaks();
   offensive_content_popup();
});


// For the saved items page.
document.addEventListener("cdm-saved-items-page:ready", function() {
   all_pages_tweaks();
   offensive_content_popup();
});


// For the shared items page.
document.addEventListener("cdm-shared-items-page:ready", function() {
   all_pages_tweaks();
   offensive_content_popup();
});


/**
 * Insert IIIF Links
 */
insert_iiif_links();


/**
 * Mirador Integration
 */
mirador_integration();


/**
 * Rights & Licenses Badges
 */
rights_licenses_badges();


/**
 * Aeon Script Integration
 */
aeon_button();

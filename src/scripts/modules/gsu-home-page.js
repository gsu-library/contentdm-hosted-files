export { home_page_tweaks };


// Home page ready
function home_page_tweaks() {
   // Change cards to col-sm-3s.
   var cards = document.querySelectorAll(".Card-cardcontainer.col-sm-6");

   // Can't use forEach because IE.
   for(i = 0; i < cards.length; i++) {
      cards[i].classList.remove("col-sm-6");
      cards[i].classList.add("col-sm-3");
   }
}

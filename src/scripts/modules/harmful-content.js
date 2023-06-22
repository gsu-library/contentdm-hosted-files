export { harmful_content_popup };


/**
 * Adds harmful content popup to all pages. Stores acknowledgement for 7 days which is refreshed on
 * page visit.
 */
function harmful_content_popup() {
   // Check that our browser supports custom elements,
   // ... cf. https://caniuse.com/?search=customElements
   if (!("customElements" in window)) {
     return;
   }

   // Define content and styles for modal
   const template = document.createElement("template");
   template.innerHTML = /*html*/ `
     <style>
       .wsu-dialog {
         margin: 0 auto;
         top: 5%;

         max-width: 65ch;

         border: 1px solid hsla(0 0% 0% / .5);
         border-radius: .5em;

         box-shadow: 0 2.8px 2.2px hsla(0, 0%, 0%, 0.034),
                     0 6.7px 5.3px hsla(0, 0%, 0%, 0.048),
                     0 12.5px 10px hsla(0, 0%, 0%, 0.06),
                     0 22.3px 17.9px hsla(0, 0%, 0%, 0.072),
                     0 41.8px 33.4px hsla(0, 0%, 0%, 0.086),
                     0 100px 80px hsla(0, 0%, 0%, 0.12);

         color: currentColor;
         padding-inline: 1.5em;
         padding-block: 1.125em;
       }

       .wsu-dialog__header {
         display: flex;
         justify-content: space-between;
         align-items: flex-start;
         border-bottom: 1px solid lightgray;
       }

       .wsu-dialog__heading {
         margin-top: 0;
       }

       .wsu-dialog__close-btn {
         border: none;
         background: transparent;
         color: currentColor;
         cursor: pointer;
       }

       .wsu-dialog__content {
         line-height: 1.5;
         margin-block: 1.5rem;
       }

       .wsu-dialog__continue-btn {
         padding: .75em 1em;
         color: white;
         border: 1px solid hsla(0 0% 0% / .25);
         border-radius: .5em;
         background-color: #0039a6;
         cursor: pointer;
       }

       .wsu-dialog__footer {
         border-top: 1px solid lightgray;
       }

       .wsu-dialog::backdrop {
         background-color: hsla(0 0% 0% / .5);
       }

       .close {
         animation: slide-out-up .2s ease-out;
       }

       @keyframes slide-out-up {
         to {
           transform:translateY(-100%);
           opacity: 0;
         }
       }

     </style>

     <dialog id="wsu-dialog" class="wsu-dialog">
       <header class="wsu-dialog__header">
         <h2 id="wsu-dialog-heading" class="wsu-dialog__heading"><slot name="title">Potentially Harmful Content</slot></h2>
         <button id="wsu-dialog-close" class="wsu-dialog__close-btn" aria-label="close dialog" aria-controls="wsu-dialog"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" aria-hidden="true" style="pointer-events:none" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10" opacity=".5"/><path stroke-linecap="round" d="m14.5 9.5l-5 5m0-5l5 5"/></g></svg></button>
       </header>
       <section class="wsu-dialog__content">
         <slot name="content">
           <p>Some content in our collection may contain graphic images, offensive language, or material that conflicts with strongly held values or beliefs. We provide access to this content to preserve the historical record. We do not endorse the attitudes, prejudices, or behaviors it represents.</p>
           <p>If you are sensitive to this material, please do not proceed.</p>
           <p><button id="wsu-dialog-continue" class="wsu-dialog__continue-btn" aria-controls="wsu-dialog">Continue</button></p>
         </slot>
       </section>
       <footer class="wsu-dialog__footer">
         <slot name="footer">
         <p>For more information read our <a id="wsu-dialog-readmore" href="/custom/harmful-content">Statement on Potentially Harmful Content</a>.</p>
         </slot>
       </footer>
     </dialog>
 `;

   class WsuDialog extends HTMLElement {
     #isRendered = false;

     constructor() {
       super();
       this.attachShadow({ mode: "open" });
     }

     connectedCallback() {
       this.render();
     }

     render() {
       if (this.#isRendered || !this.showAgain()) {
         return;
       }

       this.shadowRoot.append(template.content.cloneNode(true));

       const dialog = this.shadowRoot.querySelector("#wsu-dialog");
       dialog.showModal();

       dialog.addEventListener("click", this.handleCloseModal);

       this.#isRendered = true;
     }

     /**
      * Checks if 7 days or more since last seen
      *
      * @return {boolean} — True if never shown or ready to show again
      * @memberof WsuDialog
      */
     showAgain() {
       const now = new Date();
       const hideUntil = window.localStorage.getItem("hideUntil");

       if (hideUntil === null) {
         return true;
       }

       const showAfter = new Date(hideUntil);

       return now > showAfter;
     }

     handleCloseModal(event) {
       const isClose = event.target.matches("#wsu-dialog-close");
       const isContinue = event.target.matches("#wsu-dialog-continue");
       const isReadmore = event.target.matches("#wsu-dialog-readmore");

       if (!(isClose || isContinue || isReadmore)) {
         return;
       }

       const dialog = event.target.closest("dialog");

       const hideUntil = new Date();
       hideUntil.setDate(hideUntil.getDate() + 7);
       window.localStorage.setItem("hideUntil", hideUntil.toString());

       dialog.classList.add("close");

       window.setTimeout(() => {
         dialog.close();
       }, 150);
     }
   }

   customElements.define("wsu-dialog", WsuDialog);
   const newDialog = document.createElement("wsu-dialog");
   document.body.append(newDialog);
 }

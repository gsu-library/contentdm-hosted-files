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
  template.innerHTML = `
     <style>
       .dialog {
          margin: 0 auto;
          top: 5%;
          max-width: 65ch;
          border: 1px solid hsla(0 0% 0% / 0.5);
          border-radius: 0.5em;
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

        .dialog__header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: 1px solid lightgray;
        }

        .dialog__header *,
        .dialog__header ::slotted(*) {
          margin-block-start: 0;
        }

        .dialog__close-btn {
          border: none;
          background: transparent;
          color: currentColor;
          cursor: pointer;
        }

        .dialog__content {
          line-height: 1.5;
          margin-block: 1.5rem;
        }

        .dialog__continue-btn {
          padding: 1.25em 2em;
          color: white;
          border: 1px solid hsla(0 0% 0% / 0.125);
          border-radius: var(--btn-radius, none);
          background-color: var(--btn-continue-color, hsl(219, 100%, 33%));
          cursor: pointer;
        }

        a {
          color: hsl(219, 100%, 33%);
        }

        .dialog__footer {
          border-top: 1px solid lightgray;
        }

        .dialog::backdrop {
          background-color: hsla(0 0% 0% / 0.5);
        }

        .close {
          animation: slide-out-up 0.2s ease-out;
        }

        @keyframes slide-out-up {
          to {
            transform: translateY(-100%);
            opacity: 0;
          }
        }
     </style>

      <dialog id="dialog" class="dialog">
        <header class="dialog__header">
        <slot name="title">
          <h2 id="dialog-heading" class="dialog__heading">Potentially Offensive Content</h2>
        </slot>
          <button id="dialog-close" class="dialog__close-btn" aria-label="close dialog" aria-controls="dialog">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" aria-hidden="true" style="pointer-events:none" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10" opacity=".5"/><path stroke-linecap="round" d="m14.5 9.5l-5 5m0-5l5 5"/></g></svg>
          </button>
        </header>
        <section class="dialog__content">
          <slot name="content">
            <p>Some content in our collection may contain graphic images, offensive language, or material that conflicts with strongly held values or beliefs. We provide access to this content to preserve the historical record. We do not endorse the attitudes, prejudices, or behaviors it represents.</p>
            <p>If you are sensitive to this material, please do not proceed.</p>
            <p><button id="dialog-continue" class="dialog__continue-btn" aria-controls="dialog">Continue</button></p>
          </slot>
        </section>
        <footer class="dialog__footer">
          <slot name="footer">
          <p>For more information read our <a id="dialog-readmore" href="/digital/custom/offensive-content">Statement on Potentially Offensive Content</a>.</p>
          </slot>
        </footer>
      </dialog>
 `;

  class NoticeDialog extends HTMLElement {
    #isRendered = false;
    #hideForDays = 0;

    constructor() {
      super();
      this.root = this.attachShadow({ mode: "closed" });
    }

    connectedCallback() {
      if (this.#isRendered || !this.showAgain()) {
        return;
      }

      this.root.append(template.content.cloneNode(true));

      const dialog = this.root.querySelector("#dialog");
      dialog.showModal();

      dialog.addEventListener("click", this.handleCloseModal.bind(this));

      this.#isRendered = true;
    }

    static get observedAttributes() {
      return ["hide-for-days"];
    }

    attributeChangedCallback(attrName, oldVal, newVal) {
      if (attrName === "hide-for-days") {
        this.#hideForDays = Number(newVal);
      }
    }

    showAgain() {
      let showDialog = true;

      const now = new Date();
      const hideUntil = window.localStorage.getItem("hideUntil");

      if (hideUntil) {
        const showAfter = new Date(hideUntil);
        showDialog = now > showAfter;
      }

      return showDialog;
    }

    handleCloseModal(event) {
      const isClose = event.target.matches(
        "#dialog-close, #dialog-continue, #dialog-readmore"
      );

      if (!isClose) {
        return;
      }

      const dialog = event.target.closest("dialog");

      const hideUntil = new Date();

      hideUntil.setDate(hideUntil.getDate() + this.#hideForDays);

      window.localStorage.setItem("hideUntil", hideUntil.toString());

      dialog.classList.add("close");

      window.setTimeout(() => {
        dialog.close();
      }, 150);
    }
  }

  customElements.define("notice-dialog", NoticeDialog);

  // Add notice-dialog to all pages
  const noticeDialog = document.createElement("notice-dialog");
  // Update hide time to 7 days, default 0
  noticeDialog.setAttribute("hide-for-days", 7);
  document.body.append(noticeDialog);
}

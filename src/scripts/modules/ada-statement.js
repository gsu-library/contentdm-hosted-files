export { ada_statement };


/**
 * Adds an ADA statement to the end of an item description. Based off of archived
 * content banner v1.3
 * (https://cdmdemo.contentdm.oclc.org/digital/custom/recipedownloads#id-ada-bnr) and
 * OSU digital collections
 * https://dc.library.okstate.edu/customizations/global/pages/js/ADA-Archived-Content-Statement-OKS-1.0.3.js.
 */
function ada_statement(e) {
   collectionId = e.detail.collectionId;
   itemId = e.detail.itemId;
   get_item_info(collectionId, itemId);
   adaTitle = 'Accessibility Support';
   adaStatement = 'This item is exempt from Title II requirements. For more information, see our <a href="https://digitalcollections.library.gsu.edu/digital/custom/accessibility">Accessibility Statement</a>.';


   // Call API so we can get item tags.
   async function get_item_info(collection, item) {
      return fetch('/digital/bl/dmwebservices/index.php?q=dmGetItemInfo/' + collection + '/' + item + '/json')
      .then((response) => response.json())
      .then((responseData) => {
         if(responseData.tags?.includes('TitleIIArchival')) {
            console.log('Found a tag match for title II.');
            insert_ada_statement();
         }
      })
      .catch(error => console.warn(error));
   }


   // Insert the ADA statement.
   function insert_ada_statement() {
      // Find the specific metadata table
      let targetTable = document.querySelector('table[data-id="metadataTable"]');

      if (targetTable) {
         // Get the tbody element
         let tbody = targetTable.querySelector('tbody');

         if (tbody) {
         // Create a new table row
         let row = document.createElement('tr');
         row.id = 'ada-statement-row';
         row.className = 'ItemMetadata-metadatarow field-ada-statement';

         // Create a table cell that spans all columns
         let cell = document.createElement('td');

         // Get the number of columns in the table to set colspan
         let firstRow = tbody.querySelector('tr');
         let columnCount = firstRow ? firstRow.querySelectorAll('td, th').length : 1;
         cell.setAttribute('colspan', columnCount);

         // Add the ADA statement content with smaller text and word wrap
         cell.innerHTML = `
            <div role="note" aria-label="Accessibility Support" style="
               padding: 0.75rem;
               margin: 0;
               background-color: #fff3cd;
               border-left: 0.25rem solid #856404;
               color: #212529;
               font-size: 0.813rem;
               line-height: 1.5;
               box-sizing: border-box;
               word-wrap: break-word;
               overflow-wrap: break-word;
               word-break: break-word;
               hyphens: auto;
               max-width: 100%;
            ">
               <h3 style="
               margin: 0 0 0.5rem 0;
               padding: 0;
               font-size: 0.938rem;
               line-height: 1.4;
               color: #212529;
               font-weight: 600;
               word-wrap: break-word;
               overflow-wrap: break-word;
               ">${adaTitle}</h3>
               <p style="
               margin: 0;
               padding: 0;
               font-size: 0.813rem;
               line-height: 1.6;
               color: #212529;
               word-wrap: break-word;
               overflow-wrap: break-word;
               word-break: break-word;
               hyphens: auto;
               ">${adaStatement}</p>
            </div>
         `;

         // Add the cell to the row
         row.appendChild(cell);

         // Add the row to the end of the tbody
         tbody.appendChild(row);
         }
      } else {
         console.warn('Metadata table not found for ADA statement injection.');
      }
   }

}

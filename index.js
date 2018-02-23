'use strict';
/*global $*/

// `STORE` is responsible for storing the underlying data
// that our app needs to keep track of in order to work.
//
// for a shopping list, our data model is pretty simple.
// we just have an array of shopping list items. each one
// is an object with a `name` and a `checked` property that
// indicates if it's checked off or not.
// we're pre-adding items to the shopping list so there's
// something to see when the page first loads.

const STORE = {
  items: [
    {name: 'apples', checked: false},
    {name: 'oranges', checked: false},
    {name: 'milk', checked: true},
    {name: 'bread', checked: false}
  ],
  filter: false,
  search: ''
};
function generateItemElement(item, itemIndex, template) {
  //create html for editing item vs not editing. Cannot edit checked items.
  let itemName = `<span class="shopping-item js-shopping-item ${item.checked ? 'shopping-item__checked' : ''}">${item.name}</span>`;
  if (!item.checked) {
    itemName = `
    <form id="js-edit-shopping-item">
    <input type="text" name="edit-shopping-item" class="js-edit-shopping-item" value="${item.name}" />
    <button type="submit">submit edit</button>
    <button>cancel edit</button>
    </form>
    `;
  }

  return `
  <li class="js-item-index-element" data-item-index="${itemIndex}">
      ${itemName}
      <div class="shopping-item-controls">
        <button class="shopping-item-toggle js-item-toggle">
            <span class="button-label">check</span>
        </button>
        <button class="shopping-item-delete js-item-delete">
            <span class="button-label">delete</span>
        </button>
      </div>
    </li>
  `;
}

function generateShoppingItemsString(shoppingList) {
  console.log ('Generating shopping list element');
  const items = shoppingList.map((item, index) => generateItemElement(item, index));
  return items.join('');
}

function renderShoppingList() {
  // this function will be repsonsible for rendering the shopping list in
  // the DOM
  console.log('`renderShoppingList` ran');
  let items = STORE.items;
  //render filter checked items
  if (STORE.filter) {
    items=STORE.items.filter(item => !item.checked);
  }
  //render search term
  if (STORE.search) {
    items = STORE.items.filter(item => item.name.includes(STORE.search));
  }
  const shoppingListItemsString = generateShoppingItemsString(items);
  //inserts HTML into DOM
  $('.js-shopping-list').html(shoppingListItemsString);
}

function addItemToShoppingList(itemName) {
  console.log(`Adding ${itemName} to shopping list`);
  STORE.items.unshift({name: itemName, checked: false});
}


function handleNewItemSubmit() {
  // this function will be responsible for when users add a new shopping list item
  $('#js-shopping-list-form').submit(function(event) {
    event.preventDefault();
    const newItemName = $('.js-shopping-list-entry').val();
    console.log(newItemName);
    $('.js-shopping-list-entry').val('');
    addItemToShoppingList(newItemName);
    renderShoppingList();
  });
}

function toggleCheckedforListItem(itemIndex) {
  console.log('Toggling checked property for item at index ' + itemIndex);
  STORE.items[itemIndex].checked = !STORE.items[itemIndex].checked;
}

function getItemIndexFromElement(item) {
  const itemIndexString = $(item)
    .closest('.js-item-index-element')
    .data('item-index');
  return itemIndexString;
}


function handleItemCheckClicked() {
  // this funciton will be reponsible for when users click the "check" button on
  // a shopping list item.
  console.log('`handleItemCheckClicked` ran');
  $('.js-shopping-list').on('click', '.js-item-toggle', event => {
    console.log('`handleItemCheckClicked` ran');
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    console.log(itemIndex);
    toggleCheckedforListItem(itemIndex);
    renderShoppingList();
  });
}

function deleteItem(index) {
  STORE.items.splice(index, 1);
}

function handleDeleteItemClicked() {
  // this function will be responsible for when users want to delete a shopping list
  // item
  console.log('`handleDeleteItemClicked` ran');
  $('.js-shopping-list').on('click', '.js-item-delete', event => {
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    deleteItem(itemIndex);
    renderShoppingList();
  });
}

function toggleFilter() {
  console.log('toggling filter');
  STORE.filter = !STORE.filter;
}

// Listen for when a user clicks the filter checkbox.
// Retrieve the item's filter attribute in STORE.
// Toggle the filter property in STORE.
// Re-render the shopping list.
function handleFilterCheck() {
  $('.js-filter-checked').click(event => {
    console.log('handle filter ran');
    toggleFilter(STORE);
    renderShoppingList();
  });
}

function setSearchTerm(term) {
  STORE.search = term;
}

// Listen for when a user enters a search.
// Retrieve the item's name (val) attribute in STORE to set search term.
// Filter STORE based on search.
// Re-render the shopping list (update render function).
//stretch goal = add button to clear search
function handleShoppingListSearch() {
  $('.js-shopping-list-search-entry').on('keyup', event => {
    console.log('handle search ran');
    let valSearchTerm = $(event.currentTarget).val();
    console.log(valSearchTerm);
    setSearchTerm(valSearchTerm);
    renderShoppingList();
  });

}

function findAndUpdateItem(newName, currentIndex) {
  //find and filter item.index from <li> using .parent of form? Update item.name
  STORE.items[currentIndex].name = newName;
}

// Listen for when a user edits an item (can build 'cancel button funtionality?).
// Retrieve the item's index attribute in STORE to update item.
// Update item name in the STORE.
// Re-render the shopping list (update render function).
//stretch goal = add cancel button functionality

function handleEditShoppingList() {
  //listen for submit - have to update HTML in generateItemElement...checkbox? form?
  $('.js-shopping-list').on('submit', '#js-edit-shopping-item', event => {
    event.preventDefault();
    const updatedItem = $(event.currentTarget)
      .find('.js-edit-shopping-item')
      .val();
    console.log(updatedItem);
    $('.js-edit-shopping-item').val('');
    const currentIndex = $(event.currentTarget)
      .parent('.js-item-index-element')
      .data('item-index');
    console.log(currentIndex);
    findAndUpdateItem(updatedItem, currentIndex);
    renderShoppingList();
  });
}

// this function will be our callback when the page loads. it's responsible for
// initially rendering the shopping list, and activating our individual functions
// that handle new item submission and user clicks on the "check" and "delete" buttons
// for individual shopping list items.
function handleShoppingList() {
  renderShoppingList();
  handleNewItemSubmit();
  handleItemCheckClicked();
  handleDeleteItemClicked();
  handleFilterCheck();
  handleShoppingListSearch();
  handleEditShoppingList();
}

$(handleShoppingList);
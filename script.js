// define "constants", this allows us to reference TREE where we would normally say
// "Tree" e.g. if ( menuType === "Tree" ) becomes if ( menuType === TREE )
// This makes it so if we change the name of Tree to something else we only update the
// string value and all the code and logic is still the same and works
var TREE = 'Tree';
var ACCORDION = 'Accordion';
var LANDSCAPE = 'Landscape';

// array of choices, as a "constant", javascript doesn't actually have a constant type unless
// you are using ES2015+ but the convention of UPPERCASE_VARIABLE implies it is not meant to
// be changed ever while the code is running
var LAYOUT_CHOICES = [TREE, ACCORDION, LANDSCAPE];

// Here is our global state, this is a bit of a contrived example to showcase some different
// parts of javascript, but this globalState variable is available in any function inside this
// script.js file, if you want the globalState to be available outside of this js file then
// assign it to the window object, e.g. window.globalState = { ... } then in other files you can
// say if (window.globalState.isTreeLayout) // do something
var globalState = {
  layoutIndex: 0,
  isTreeLayout: true,
  isAccordionLayout: false,
  isLandscapeLayout: false,
};

// returns the current layout, using modulo so I don't need to mess around with going back to 0
// when we reach the last option (2).
function getLayout() {
  return LAYOUT_CHOICES[globalState.layoutIndex % 3];
}

// cycle layout just increments the index by 1, updates the globalState variable, updates the
// layout and then updates the menu buttons. The modulo allows us to just always increment and
// not have to go back to 0 after we hit the max size of the array of LAYOUT_CHOICES
function cycleLayout() {
  globalState.layoutIndex = globalState.layoutIndex + 1;
  updateState();
  var layoutChoice = getLayout();
  updateLayout(layoutChoice);
  updateMenuButtons();
}

// sets the is<Type>Layout options, compares the current layout choice with the constants
function updateState() {
  currentLayout = getLayout();
  globalState.isTreeLayout = currentLayout === TREE;
  globalState.isAccordionLayout = currentLayout === ACCORDION;
  globalState.isLandscapeLayout = currentLayout === LANDSCAPE;
}

// Updates the layout currently just changes the text on the page to indicate the current layout choice
function updateLayout(layoutChoice) {
  // indexOf is supported by ie9 and up so we use it find the index in the array of the choice passed
  // into the updateLayout function, indexOf returns -1 if it does not find a match
  var layoutIndex = LAYOUT_CHOICES.indexOf(layoutChoice);

  // so if it doesn't === -1 it found a match
  if (layoutIndex !== -1) {
    // update the layout
    var layoutText = document.getElementById('layoutText');
    layoutText.childNodes[0].nodeValue = 'Layout: ' + layoutChoice;
  } else {
    // bad input
    var error = new Error('Invalid layout choice `' + layoutChoice + '`');
    throw error;
  }
}

// define an onclick handler for the cycle layout button
var cycleLayoutBtn = document.getElementById('cycleLayout');
cycleLayoutBtn.onclick = cycleLayout;

// generic function that gets the data attr of the passed element to update
// the menu buttons and keep the global state in sync with the DOM
function handleMenuButtonClick(mouseEvent) {
  var dataMenuOption = mouseEvent.target.attributes['data-menu-option'].nodeValue;
  globalState.layoutIndex = LAYOUT_CHOICES.indexOf(dataMenuOption);
  updateState();
  var layoutChoice = getLayout();
  updateLayout(layoutChoice);
  updateMenuButtons();
}

// generates the html for the menu based on the global state
function updateMenuButtons() {
  // Check is<Type>Layout, if it is true then we dont include that button, if it is false we want
  // to include that button, so we are saying if ( is<Type>Layout is false ) basically, to do that
  // we put a ! in front of it, if ( !is<Type>Layout ) // add the button html
  var menu = document.getElementById('menu');
  var html = '';
  // here I want each if to execute so we don't use an if/elseif/else chain
  if (!globalState.isTreeLayout) {
    html +=
      '<li style="display: inline-block"><button type="button" class="menu-button" data-menu-option="' +
      TREE +
      '">Tree</button></li>';
  }
  if (!globalState.isAccordionLayout) {
    html +=
      '<li style="display: inline-block"><button type="button" class="menu-button" data-menu-option="' +
      ACCORDION +
      '">Accordion</button></li>';
  }
  if (!globalState.isLandscapeLayout) {
    html +=
      '<li style="display: inline-block"><button type="button" class="menu-button" data-menu-option="' +
      LANDSCAPE +
      '">Landscape</button></li>';
  }
  menu.innerHTML = html;
  var menuButtons = document.querySelectorAll('button.menu-button');
  for (var index in menuButtons) {
    menuButtons[index].onclick = handleMenuButtonClick;
  }
}

// call this on page load to insert the menu initially into the DOM
updateMenuButtons();

// baseSize is adjusted by user to change size of page elements
let baseSize = 10;

// all element IDs must be entered in this array
const protectedIds = ["attributionWrapper", "attribution", "inner", "overlay", "text", "copy", "buttonSpace", "clearButton", "addButton", "input", "inputWrapper", "inputBox", "sizeAdjusters", "sizersPlusText", "topRow"];

// resizes buttons and text based on sizer buttons
function setNewSize() {
    localStorage["baseSize"] = baseSize; 
    document.body.style.fontSize = baseSize + "px";
    let heightSize = baseSize / 2;
    document.getElementById("input").style.height = heightSize + "vh";

    // send focus to textarea
    focusText();
}

// triggers on click of "+"
function increaseSize() {
    if (baseSize < 18) {
        baseSize++;
        setNewSize();
    }
}

// triggers on click of "+"
function decreaseSize() {
    if (baseSize > 6) {
        baseSize--;
        setNewSize();
    }
}

function saveInput() {
    /* pulls the text from textarea */
    let newButton = document.getElementById("input").value;
    
    /* give every element a new ID  */
    for (i = 0; i < protectedIds.length; i++) {
        if (newButton == protectedIds[i]) {
            /* by adding charCode 13 (enter key) and then filtering it back out
            in idText and verifyText, every button gets a unique ID, even though
            they have the same output */
            newButton = newButton + String.fromCharCode(13);
        }
    }
    
    // add newButton to protected ID list, to avoid duplication
    protectedIds.push(newButton);
    

    /* clear textarea */
    document.getElementById("inputWrapper").reset();
    
    /* make sure not an emptyish string */
    if (newButton.length > 0) {
        for (i = 0; i < newButton.length; i++) {
            if (newButton[i] != " " && newButton.charCodeAt(i) != 10) {
                /* store to localStorage */
                localStorage[idText(newButton)] = newButton;
                
                /* create visual button */
                makeButton(newButton);

                /* break out of for loop to avoid creating duplicate buttons */
                break;
            }
        }
    }

    // send focus to textarea
    focusText();
}

function showSavedButtons() {
    /* Pulls each key:value from localStorage and sends the value to place a button on screen */
    for ( let i = 0; i < localStorage.length; i++ ) {
        let thisKey = localStorage.key(i);  
        let thisValue = (localStorage.getItem(thisKey));
        if (thisKey != "baseSize") { // no button for baseSize setting
            makeButton(thisValue);
        }
    }
}

function clearAllButtons() {
    /* removes ALL snippets from memory */
    localStorage.clear();
    localStorage["baseSize"] = baseSize;    
    /* visual feedback: show BOOM! on screen */
    const overlay = document.getElementById("overlay");
    overlay.style.backgroundColor = "rgb(206, 119, 119)";
    let fullfont = document.body.offsetWidth * .1;
    overlay.style.fontSize = fullfont + "px";
    document.getElementById("inner").innerText = "Whoosh!";
    overlay.style.opacity = 1;
    overlay.style.zIndex = 2;

    /* Pause for effect, then reload page */
    setTimeout(function() {
        location.reload();
    }, 400);
}

function makeButton(localStorageValue) { // create button on screen
    let domId = idText(localStorageValue); // convert to element ID safe name
    let safeToCopy = verifyText(localStorageValue); // convert to format that escapes characters and retains formatting

    /* create <div> and assign safe ID */
    let node = document.createElement("DIV"); 
    node.setAttribute("id", domId);
    node.setAttribute("class", "nodeProperties");

    /* create div-button inside div, using copysafe value for onclick function */
    let nodeButton = document.createElement("DIV");
    nodeButton.setAttribute("id", domId + "_button");
    nodeButton.setAttribute("class", "button");
    nodeButton.setAttribute("onclick", "copytext('" + safeToCopy + "')");
    nodeButton.appendChild(document.createTextNode(localStorageValue));
    node.appendChild(nodeButton);

    /* create div-cancel item, which emoves parent div */
    let nodeCancel = document.createElement("DIV");
    nodeCancel.setAttribute("id", domId + "_cancel");
    nodeCancel.setAttribute("class", "cancel");
    nodeCancel.setAttribute("onclick", "removeButton('" + domId + "')");
    nodeCancel.appendChild(document.createTextNode("X"));
    node.appendChild(nodeCancel);
    
    /* add <div> with button and cancel elements to page */
    document.getElementById("buttonSpace").appendChild(node);

    // send focus to textarea
    focusText();
}

function removeButton(domId) {
    /* remove button from screen and key:value from localStorage */
    let thisButton = document.getElementById(domId);
    thisButton.parentNode.removeChild(thisButton);
    localStorage.removeItem(domId);

    // send focus to textarea
    focusText();
}

function idText(localStorageKey) {
    /* run text through filters to make safe for use as element ID */
    let newString = "";
    for (i = 0; i < localStorageKey.length; i++) {
        if (localStorageKey[i] == "'") {
            newString += ".--";
        } else if (localStorageKey[i] == "\\") {
            newString += "--.";
        } else if (localStorageKey[i] == '"') {
            newString += "..-";
        } else if (localStorageKey.charCodeAt(i) == 10) {
            newString += "-.-";  
        } else if (localStorageKey.charCodeAt(i) == 13) {
            newString += "-..";   
        } else  {
            newString += localStorageKey[i];
        }
    }
    return newString;
}

function verifyText(localStorageKey) {
    /* run text through filters to escape characters and retain formatting */
    let newString = "";
    for (i = 0; i < localStorageKey.length; i++) {
        if (localStorageKey[i] == "'" || localStorageKey[i] == '"') {
            newString += "\\" + localStorageKey[i];
        } else if (localStorageKey.charCodeAt(i) == 10) { 
            newString += "\\n";   
        } else if (localStorageKey[i] == "\\") {
            newString += "\\\\\\\\";
            i++;
        } else if (localStorageKey.charCodeAt(i) == 13) {
            // add nothing 
        } else {
            newString += localStorageKey[i];
        }
    }
    return newString;
}

function copytext(safeToCopy) {
    /* enter button text into hidden textarea, select it, then trigger clipboard copy */
    const overlay = document.getElementById('overlay');
    const text = document.getElementById("text");
    document.getElementById('copy').reset();
    text.innerText = safeToCopy;
    text.select();
    document.execCommand('copy');

    /* visual feedback - flashes screen blue and displays copied text in large font */
    let fullfont = document.body.offsetWidth * .1;
    overlay.style.fontSize = fullfont + "px";
    document.getElementById("inner").innerText = safeToCopy;
    overlay.style.opacity = 1;
    overlay.style.zIndex = 2;
    setTimeout(function() {
        overlay.style.opacity = 0;
        overlay.style.zIndex = -1;
        overlay.style.fontSize = "12px";
    }, 350);

    // send focus to textarea
    focusText();
}

function focusText() {
    document.getElementById("input").focus();
}

window.onload = function() {

    document.getElementsByClassName('addButton')[0].addEventListener('click', saveInput);
    document.getElementsByClassName('clearButton')[0].addEventListener('click', clearAllButtons);
    /* set size if saved from previous adjustments */
    if (localStorage["baseSize"] != "") {
        if (parseInt(localStorage["baseSize"]) < 21 && parseInt(localStorage["baseSize"]) > 5) {
            baseSize = parseInt(localStorage["baseSize"]);
            setNewSize();
        }
    }

    if (localStorage.length <= 1) {
        /* Load instruction text into Snippets for new users */
        const input = document.getElementById("input");
        input.value = "Snippet saves commonly used batches of text.  Enter your text in the text box, then click 'Snippet!'";
        saveInput();
        input.value = "Clicking a Snippet copies it to your Clipboard, so you can paste it anywhere.";
        saveInput();
        input.value = "You can remove a Snippet by clicking the red circle next to it. Any Snippets you don't remove will still be here the next time you come back.";
        saveInput();
        input.value = "You can also clear all of your Snippets by clicking the big red button.";
        saveInput();
        input.value = "But if you do, you'll get these instructional Snippets back again, so use the red circles to get rid of them.";
        saveInput();
    } else {
        /* Load existing buttons from localStorage */
        showSavedButtons();
    }
    
    // send focus to textarea
    focusText();
}  
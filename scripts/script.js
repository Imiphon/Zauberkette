const availableHeight = calculateAvailableHeight(); //used in calculateAvailableHeight() and changeView()

function docID(id) {
  return document.getElementById(id);
}

/* --------------- INDEX.HTML  ------------------------*/
//called for landingpage
function renderIndex() {
  let mainContent = docID("startSideContent");
  if (mainContent) mainContent.innerHTML = infoStartSite();

  const header = document.querySelector('header');
  header.innerHTML = renderHeaderHTML();
}

/*------------------------------- TABLE FUNCTIONS ---------------------------*/

//called in buildStack()
function testModus() {
  playerCards = [
    //{ nr: 1, stackNr: -1, title: 'C', amount: 3, src: 'assets/images/tones/toneC.png' },
    //{ nr: 5, stackNr: -1, title: 'E', amount: 3, src: 'assets/images/tones/toneE.png' },
    //{ nr: 8, stackNr: -1, title: 'G', amount: 3, src: 'assets/images/tones/toneG.png' },
    //{ nr: 0, stackNr: -1, title: 'gnom', amount: 1, src: 'assets/images/specials/joker.jpg' },
    { nr: 0, stackNr: -1, title: 'gnom', amount: 1, src: 'assets/images/specials/joker.jpg' },
    { nr: 0, stackNr: -1, title: 'gnom', amount: 1, src: 'assets/images/specials/joker.jpg' },
    { nr: 13, stackNr: -1, title: 'mellot', amount: 1, inUse: false, src: 'assets/images/specials/mellot.jpg' },
    { nr: 13, stackNr: -1, title: 'mellot', amount: 1, inUse: false, src: 'assets/images/specials/mellot.jpg' },
    //{ nr: 14, stackNr: -1, title: 'goblin', amount: 1, inUse: false, src: 'assets/images/specials/goblin.jpg' },
    //{ nr: 14, stackNr: -1, title: 'goblin', amount: 1, inUse: false, src: 'assets/images/specials/goblin.jpg' },
    { nr: 15, stackNr: -1, title: 'wizard', amount: 1, inUse: false, src: 'assets/images/specials/wizard.jpg' }
  ];
  console.log('testCards activated');
}

//called in renderStack()
function generateCardHTML(card, i, player) {
  let img_id = player === "playerCard" ? `playerCard${i}` : `observerCard${i}`;
  let optAccsPart = player === "playerCard" ? `optAccsPlayer` : `optAccsObserver`;

  return `
    <div class="pl-card-frame">
      <img class="card" id="${img_id}" 
      stackNr="${card.stackNr}"  
      src="${card.src}"
      onclick="getCardInfo(${i}); playSound('tone', '${card.title}', 0.3)">
      <div class="brass-plate no-btn small-font" id="${optAccsPart}${i}"></div>
    </div>
  `;
}

/**
 * @param {*} cardNr 
 * @returns 3 options of Accords or name of specialcard for each tonCard in stack
 */
function findOptAccords(cardNr) {
  if (cardNr > 12 || cardNr === 0) return cardNr;
  else {
    let acc1 = cardNr;
    let acc2 = cardNr + 5;
    let acc3 = cardNr + 8;
    if (acc2 > 12) {
      acc2 -= 12;
    }
    if (acc3 > 12) {
      acc3 -= 12;
    }
    let accNumbers = [acc1, acc3, acc2];
    return (accNumbers);
  }
}

// Helper Function to Append Translated Text
function appendTranslatedText(key, text, parentElement) {
  const span = document.createElement('span');
  span.setAttribute('data-key', key);
  span.innerHTML = text;
  parentElement.appendChild(span);
  parentElement.appendChild(document.createElement('br'));
}

// Function to Render Single Accord
function renderSingleAccord(optAcc, parentElement) {
  const keyMap = {
    0: 'gnom',
    13: 'mellot',
    14: 'goblin',
    15: 'wizard',
  };

  const key = keyMap[optAcc];
  if (key && texts[key] && texts[key][language]) {
    const text = texts[key][language];
    appendTranslatedText(key, text, parentElement);
  } else {
    console.warn(`No translation found for optAcc ${optAcc}`);
  }
}

// Function to Get Musical Term Key Based on Index
function getMusicalTermKey(index) {
  const termKeys = ['prime', 'terz', 'quint'];
  return termKeys[index] || '';
}

// Function to Render Accord List with Musical Terms
function renderAccordList(optAccArray, parentElement) {
  optAccArray.forEach((accNr, index) => {
    const currAcc = allMaj.find(acc => acc.nr === accNr);
    if (currAcc) {
      // Get the musical term key
      const termKey = getMusicalTermKey(index);
      if (!termKey) {
        console.warn(`No musical term defined for index ${index}`);
        return;
      }

      // Get the translated musical term
      const term = texts[termKey] && texts[termKey][language] ? `${texts[termKey][language]} in ` : '';

      // Get the translated title
      const translatedTitle = texts[currAcc.title] && texts[currAcc.title][language] ? texts[currAcc.title][language] : currAcc.title;

      // Create a composite key for translation (optional, if needed)
      const compositeKey = `${termKey}_${currAcc.title}`; // e.g., 'prime_gnom'

      // Combine term and title
      const combinedText = term + translatedTitle;

      // Append the translated text
      appendTranslatedText(compositeKey, combinedText, parentElement);
    } else {
      console.warn(`Accord with nr "${accNr}" not found in allMaj.`);
    }
  });
}

/**
 *  Main Function to Render Optional Accords
 * Shows for which accords each tone is useful (as prime, terz, and quint)
 * @param {array|number} optAcc - opt.accordNr (3) or 1 specialCardNr
 * @param {number} stackNr 
 * @param {string} optAccsPart 
 */
function renderOptAccords(optAcc, stackNr, optAccsPart) {
  const optAccs = document.getElementById(`${optAccsPart}${stackNr}`);
  if (!optAccs) {
    console.warn(`Element with id "${optAccsPart}${stackNr}" not found.`);
    return;
  }

  optAccs.innerHTML = '';

  if ([0, 13, 14, 15].includes(optAcc)) {
    // Render single accord
    renderSingleAccord(optAcc, optAccs);
  } else if (Array.isArray(optAcc)) {
    // Render list of accords with musical terms
    renderAccordList(optAcc, optAccs);
  } else {
    console.warn(`Unhandled optAcc value: ${optAcc}`);
  }
}

//called in buildStack()
function renderStack(player, part) {
  let currCardStack = docID(part);
  currCardStack.innerHTML = '';
  let cards = player === "playerCard" ? playerCards : observerCards;

  for (let i = 0; i < cards.length; i++) {
    let card = cards[i];
    card.stackNr = i;

    currCardStack.innerHTML += generateCardHTML(card, i, player);

    let optAccNr = findOptAccords(card.nr);
    let optAccsPart = player === "playerCard" ? `optAccsPlayer` : `optAccsObserver`;
    renderOptAccords(optAccNr, card.stackNr, optAccsPart);
  }
  stackOpacity1(cards, player);
}

function buildStack(Cards) {
  let targetArray = (Cards === "playerCards") ? playerCards : observerCards;

  for (let i = 0; i < 5; i++) {
    let newCard = randomStack();
    targetArray.push(newCard);
  }
  testModus();
  Cards === "playerCards" ? renderStack("playerCard", "playerStackID") : renderStack("observerCard", "observerStackID");
  setCardHelper();
}

function setCardHelper() {
  let obsStack = document.getElementById('observerStackID');
  let playStack = document.getElementById('playerStackID');
  obsStack.innerHTML += optAccInfo();
  playStack.innerHTML += optAccInfo();
}

function positionAccCards() {
  const accCards = document.querySelectorAll('.accCard');
  const radius = -60; // distance from center in px 

  accCards.forEach((card, index) => {
    const angle = (360 / 12) * (index + 1); // degree / count per circle
    const transform = `rotate(${angle}deg) translateY(${radius}px) rotate(${-angle}deg)`;
    card.style.transform = transform;
  });
}

function renderAccords(isObserver) {
  let array;
  if (isObserver) {
    array = observerAccords;
  } else {
    array = playerAccords;
  }
  if (array.length != 0) {
    array.forEach(accord => {
      //accNr,isNew,isObserver,isDouble
      setAcc(accord.nr, false, isObserver, false);
      if (accord.amount === 2) {
        setAcc(accord.nr, false, isObserver, true);
      }
    });
  }
}

function renderCircles() {
  for (let i = 1; i <= 2; i++) {
    let playerCircle = document.getElementById(`playerCircle${i}`);
    let obsCircle = document.getElementById(`obsCircle${i}`);
    playerCircle.innerHTML = '';
    obsCircle.innerHTML = '';
    for (let j = 1; j < 13; j++) {
      playerCircle.innerHTML += `
          <img class="accCard" id="playerCircle(${i})Acc(${j})" onclick="chooseAccord(${i}, ${j}, 'player')">
          `;
      obsCircle.innerHTML += `
          <img class="accCard" id="obsCircle(${i})Acc(${j})" onclick="chooseAccord(${i}, ${j}, 'observer')">   
          `;
    }
  }
  positionAccCards();
  renderAccords(false);//isPlayerCircle 
  renderAccords(true); //isObserver
}

/**
 * update of static texts like btns or header-tags
 */
function updateStaticTexts() {
  const elements = document.querySelectorAll('[data-key]');
  elements.forEach((element) => {
    const key = element.getAttribute('data-key');  

    if (staticTexts[key] && staticTexts[key][language]) {
      element.textContent = staticTexts[key][language];
    }
  });
}

function updateDynamicTitles() {
  const dynamicElements = document.querySelectorAll('[data-key="gnom"], [data-key="mellot"], [data-key="goblin"], [data-key="wizard"], [data-key^="prime_"], [data-key^="terz_"], [data-key^="quint_"]');

  dynamicElements.forEach((element) => {
    const key = element.getAttribute('data-key');
    if (texts[key] && texts[key][language]) {
      element.innerHTML = texts[key][language];
    }
  });
}

/**
 * Update the index to the next language, wrapping around if necessary
 * Update the image source in btn and alt attribute 
 *  updatePageLanguage(currLang);
 *  Update the displayed info to the new language
 */
currLang = 'de';
function toggleLang() {
  currentLangIndex = (currentLangIndex + 1) % languages.length;
  currLang = languages[currentLangIndex];
  language = currLang;
  if (currentInfoFunction) {
    showInfo(currentInfoFunction);
  }

  renderIndex();
  updateStaticTexts();
  updateDynamicTitles();
  localStorage.setItem('currentLangIndex', currentLangIndex);
}

document.addEventListener('DOMContentLoaded', () => {
  const savedIndex = localStorage.getItem('currentLangIndex');
  if (savedIndex !== null) {
    currentLangIndex = savedIndex - 1; //
  } else {
    currentLangIndex = 0;
  }
  toggleLang();
});

function detectTouchDevice() {
  if ('ontouchstart' in window || navigator.maxTouchPoints) {
    // It is a touch device
    document.querySelectorAll('.hover-effect').forEach(function (element) {
      let hasHover = false;
      element.addEventListener('click', function (event) {
        if (!hasHover) {
          event.preventDefault();
          element.classList.add('hover');
          hasHover = true;
          setTimeout(function () {
            hasHover = false;
          }, 300); // Adjust the timeout as needed
        } else {
          element.classList.remove('hover');
          hasHover = false;
          // Trigger the original click event
          let originalClickEvent = new Event('click', {
            bubbles: true,
            cancelable: true
          });
          element.dispatchEvent(originalClickEvent);
        }
      });
    });
  }
}

// Höhe der Tableiste ermitteln (Differenz zwischen Viewport und Dokumenthöhe)
function calculateAvailableHeight() {
  const viewportHeight = window.innerHeight;
  const documentHeight = document.documentElement.clientHeight;
  const toolbarHeight = viewportHeight - documentHeight;
  const availableHeight = viewportHeight - toolbarHeight;
  return availableHeight;
}

function renderTable() {
  const header = document.querySelector('header');
  header.innerHTML = renderHeaderHTML();
  currentInfoFunction = infoStart;
  showInfo(currentInfoFunction);
  buildStack("playerCards"); // Kay -- render player stack with joined function
  buildStack("observerCards");
  renderCircles();
  chainHelper();
  currentCardID = -1;
  startRound();
  updateStaticTexts()
}

function initialize() {
  renderTable();
  detectTouchDevice();
}

/*------------------------------- POPUPs  ------------*/

function chainHelper() { //Kay --handle the cheat sheet for the accords. Z-Index higher!
  let chainHelper = document.querySelector('.chain-helper');
  chainHelper.addEventListener('click', function (event) {
    // Das Event stoppen, damit der document click-Handler nicht ausgelöst wird
    event.stopPropagation();
    this.classList.toggle('expanded');
  });
  // a click anywhere to remove listener
  document.addEventListener('click', function () {
    chainHelper.classList.remove('expanded');
  });
}

function openCardPopup() { //Kay -- create Pop-Up Element 
  let popup = document.createElement('div');
  popup.className = 'popup';
  popup.style.display = 'flex';
  document.body.appendChild(popup);
}

function closeEvent() { // Kay -- close Popup element by click on the site
  document.addEventListener('DOMContentLoaded', function () {
    let popup = document.querySelector('.popup');
    if (popup) {
      popup.addEventListener('click', function () {
        popup.style.display = 'none';
      });
    }
  });
}

function closePopup() { //Kay -- remove Element
  let popup = document.querySelector('.popup');
  if (popup) {
    popup.remove();
    body.style.overflow = 'hidden';
  }
}
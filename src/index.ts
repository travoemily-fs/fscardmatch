// console.log("TypeScript is working!");

// step 1: define suits
enum Suit {
  Heart = "heart",
  Diamond = "diamond",
  Spade = "spade",
}

// step 2: add img property to suits
const suitImages = {
  [Suit.Heart]: "../src/assets/heart.png",
  [Suit.Diamond]: "../src/assets/diamond.png",
  [Suit.Spade]: "../src/assets/spade.png",
};

// step 3: generate randomized cards in array
const generateCardSuits = (): Suit[] => {
  const suits: Suit[] = [Suit.Heart, Suit.Diamond, Suit.Spade];
  const selectedSuits: Suit[] = [];

  // ensures 3 of the same on page load
  const randomSuit = suits[Math.floor(Math.random() * suits.length)];
  selectedSuits.push(randomSuit, randomSuit, randomSuit);

  // fill the remaining slots with random suits, ensuring no additional set of three matches
  while (selectedSuits.length < 6) {
    const randomIndex = Math.floor(Math.random() * suits.length);
    const suit = suits[randomIndex];
    if (selectedSuits.filter((s) => s === suit).length < 2) {
      selectedSuits.push(suit);
    }
  }

  // shuffle the array so that the order of cards is randomized
  return selectedSuits.sort(() => Math.random() - 0.5);
};

// step 4: initializing the game, assign suits to cards and construct event listener for card flip click
const initializeGame = (): void => {
  const cards = Array.from(document.querySelectorAll(".card")) as HTMLElement[];
  const randomizedSuits = generateCardSuits();

  // loops through each card to assign a suit
  cards.forEach((card, index) => {
    const suit = randomizedSuits[index];
    const frontImage = card.querySelector(".cardFront") as HTMLImageElement;
    if (frontImage) {
      frontImage.src = suitImages[suit];
    }
    // listens for player click on the card for 'flipping'
    card.addEventListener("click", () => flipCard(card));
  });

  // initialize the attempt display
  updateAttemptsDisplay();
};

// step 5: handling the 'flipping' functionality
let flippedCards: HTMLElement[] = [];
let attempts = 3;

const flipCard = (card: HTMLElement): void => {
  const back = card.querySelector(".cardBack") as HTMLElement;
  const front = card.querySelector(".cardFront") as HTMLElement;

  // check for card flip
  if (!back.classList.contains("hidden")) {
    // toggle visibility
    back.classList.add("hidden");
    front.classList.remove("hidden");

    // adds flipped card to flipped cards array to track
    flippedCards.push(card);

    if (flippedCards.length === 2) {
      checkFirstMatch();
    } else if (flippedCards.length === 3) {
      checkSecondMatch();
    }
  }
};

// step 6a: first check for two matching cards
const checkFirstMatch = (): void => {
  const [card1, card2] = flippedCards;
  const suit1 = card1.querySelector(".cardFront")?.getAttribute("src");
  const suit2 = card2.querySelector(".cardFront")?.getAttribute("src");

  if (suit1 === suit2) {
    // if two cards match, wait for the third card to be flipped
    flippedCards = [card1, card2]; // retain matched cards in the array
  } else {
    // if no match, flip them back
    setTimeout(() => {
      flipBack(card1);
      flipBack(card2);
      flippedCards = [];
      attempts--;
      updateAttemptsDisplay();
      if (attempts === 0) {
        alert("You’ve run out of attempts! Game over. Try again.");
        resetGame();
      }
    }, 500);
  }
};

// step 6b: second check for three matching cards
const checkSecondMatch = (): void => {
  const [card1, card2, card3] = flippedCards;
  const suit1 = card1.querySelector(".cardFront")?.getAttribute("src");
  const suit3 = card3.querySelector(".cardFront")?.getAttribute("src");

  // temporarily disable further clicks
  document
    .querySelectorAll(".card")
    .forEach((card) => card.classList.add("disabled"));

  if (suit1 === suit3) {
    // if all three cards match, player wins
    const gameResults = document.querySelector(".gameResults") as HTMLElement;
    gameResults.textContent = "You win!";
    flippedCards = [];
  } else {
    // if third card doesn’t match, flip all three back
    setTimeout(() => {
      flipBack(card1);
      flipBack(card2);
      flipBack(card3);
      flippedCards = [];
      attempts--;
      updateAttemptsDisplay();
      if (attempts === 0) {
        alert("You’ve run out of attempts! Game over. Try again.");
        resetGame();
      }
      // re-enable clicks
      document
        .querySelectorAll(".card")
        .forEach((card) => card.classList.remove("disabled"));
    }, 500);
  }
};

// step 7: implementing game reset and flipBack functions
const flipBack = (card: HTMLElement): void => {
  const back = card.querySelector(".cardBack") as HTMLElement | null;
  const front = card.querySelector(".cardFront") as HTMLElement | null;
  if (back && front) {
    back.classList.remove("hidden");
    front.classList.add("hidden");
  }
};

// game reset function
const resetGame = (): void => {
  flippedCards = [];
  attempts = 3;

  // resets cards to be back-facing
  const cards = Array.from(document.querySelectorAll(".card")) as HTMLElement[];
  cards.forEach((card) => flipBack(card));

  // clears the win message if any
  const gameResults = document.querySelector(".gameResults") as HTMLElement;
  gameResults.textContent = "";

  // call for game re-init
  initializeGame();
};

// step 8: attempt counter
const attemptsDisplay = document.querySelector(
  "#counterSection h2"
) as HTMLElement;
const updateAttemptsDisplay = (): void => {
  if (attemptsDisplay) {
    attemptsDisplay.textContent = `Attempts Remaining: ${attempts}`;
  }
};

// start over button functionality
const startOverButton = document.querySelector(
  ".startOver"
) as HTMLButtonElement;
startOverButton.addEventListener("click", resetGame);

// initialize game on page load
initializeGame();

// Unit name mapping - Display names vs File names
const fullUnitNames = {
  "Unit 1": "Unit 1 - Understand Principles of Cyber Security",
  "Unit 2": "Unit 2 - Threat Intelligence in Cyber Security",
  "Unit 3": "Unit 3 - Cyber Security Testing, Vulnerabilities and Controls",
  "Unit 4": "Unit 4 - Cyber Security Incident Response",
  "Unit 5":
    "Unit 5 - Understand Legislation and Ethical Conduct within Cyber Security",
};

// File names (with underscores for CSV files)
const csvFileNames = {
  "Unit 1": "Unit 1_Understand Principles of Cyber Security_flashcards.csv",
  "Unit 2": "Unit 2_Threat Intelligence in Cyber Security_flashcards.csv",
  "Unit 3":
    "Unit 3_Cyber Security Testing, Vulnerabilities and Controls_flashcards.csv",
  "Unit 4": "Unit 4_Cyber Security Incident Response_flashcards.csv",
  "Unit 5":
    "Unit 5_Understand Legislation and Ethical Conduct within Cyber Security_flashcards.csv",
};

// Global variables
let flashcards = [];
let currentIndex = 0;
let isFlipped = false;
let currentUnit = "";

// DOM elements
const homepage = document.getElementById("homepage");
const flashcardView = document.getElementById("flashcardView");
const loadingOverlay = document.getElementById("loadingOverlay");
const unitTitle = document.getElementById("unitTitle");
const progressCounter = document.getElementById("progressCounter");
const progressBarFill = document.getElementById("progressBarFill");
const flashcard = document.getElementById("flashcard");
const questionContent = document.getElementById("questionContent");
const answerContent = document.getElementById("answerContent");
const showAnswerBtn = document.getElementById("showAnswerBtn");
const showQuestionBtn = document.getElementById("showQuestionBtn");
const backBtn = document.getElementById("backBtn");
const errorMessage = document.getElementById("errorMessage");
const completionScreen = document.getElementById("completionScreen");
const returnHomeBtn = document.getElementById("returnHomeBtn");
const prevCardBtn = document.getElementById("prevCardBtn");
const nextCardBtn = document.getElementById("nextCardBtn");

// Event listeners for unit buttons
document.querySelectorAll(".unit-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const unit = btn.getAttribute("data-unit");
    loadUnit(unit);
  });
});

// Back button
backBtn.addEventListener("click", returnToHomepage);

// Return home button
returnHomeBtn.addEventListener("click", returnToHomepage);

// Flashcard click to flip
flashcard.addEventListener("click", (e) => {
  if (!e.target.classList.contains("show-answer-text")) {
    flipCard();
  }
});

// Show answer/question text
showAnswerBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  flipCard();
});

showQuestionBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  flipCard();
});

// Navigation arrow buttons
prevCardBtn.addEventListener("click", prevCard);
nextCardBtn.addEventListener("click", nextCard);

// Keyboard navigation
document.addEventListener("keydown", (e) => {
  if (flashcardView.classList.contains("hidden")) return;

  switch (e.key) {
    case " ":
      e.preventDefault();
      flipCard();
      break;
    case "ArrowRight":
      e.preventDefault();
      nextCard();
      break;
    case "ArrowLeft":
      e.preventDefault();
      prevCard();
      break;
  }
});

// Load unit function
async function loadUnit(unit) {
  const fileName = csvFileNames[unit];

  // Show loading overlay
  loadingOverlay.classList.remove("hidden");
  homepage.classList.add("hidden");

  try {
    const response = await fetch(fileName);

    if (!response.ok) {
      throw new Error("Failed to load CSV file");
    }

    const csvText = await response.text();
    flashcards = parseCSV(csvText);

    if (flashcards.length === 0) {
      throw new Error("No flashcards found");
    }

    // Setup flashcard view
    unitTitle.textContent = fullUnitNames[unit];
    currentUnit = unit; // Store current unit
    currentIndex = 0;
    isFlipped = false;

    // Hide loading, show flashcard view
    loadingOverlay.classList.add("hidden");
    flashcardView.classList.remove("hidden");
    errorMessage.classList.add("hidden");
    completionScreen.classList.add("hidden");

    renderFlashcard(currentIndex);
  } catch (error) {
    console.error("Error loading flashcards:", error);
    loadingOverlay.classList.add("hidden");
    flashcardView.classList.remove("hidden");
    errorMessage.classList.remove("hidden");
    document.querySelector(".flashcard-container").style.display = "none";
  }
}

// Parse CSV manually
function parseCSV(csvText) {
  const lines = csvText.trim().split("\n");
  const cards = [];

  // Skip header row
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Parse CSV with quoted fields
    const fields = parseCSVLine(line);

    if (fields.length >= 2) {
      cards.push({
        question: fields[0],
        answer: fields[1],
      });
    }
  }

  return cards;
}

// Parse a single CSV line (handles quoted fields)
function parseCSVLine(line) {
  const fields = [];
  let currentField = "";
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        currentField += '"';
        i++;
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === "," && !insideQuotes) {
      fields.push(currentField.trim());
      currentField = "";
    } else {
      currentField += char;
    }
  }

  fields.push(currentField.trim());
  return fields;
}

// Render flashcard
function renderFlashcard(index) {
  if (index >= flashcards.length) {
    showCompletionScreen();
    return;
  }

  const card = flashcards[index];
  questionContent.textContent = card.question;
  answerContent.textContent = card.answer;

  // Reset flip state
  flashcard.classList.remove("flipped");
  isFlipped = false;

  // Update progress
  updateProgress();

  // Show flashcard container
  document.querySelector(".flashcard-container").style.display = "flex";
}

// Flip card
function flipCard() {
  flashcard.classList.toggle("flipped");
  isFlipped = !isFlipped;
}

// Next card
function nextCard() {
  if (currentIndex < flashcards.length - 1) {
    currentIndex++;
    renderFlashcard(currentIndex);
  } else {
    showCompletionScreen();
  }
}

// Previous card
function prevCard() {
  if (currentIndex > 0) {
    currentIndex--;
    renderFlashcard(currentIndex);
  }
}

// Update progress counter
function updateProgress() {
  const progressPercentage = ((currentIndex + 1) / flashcards.length) * 100;
  progressBarFill.style.width = `${progressPercentage}%`;
  progressCounter.textContent = `${currentIndex + 1} / ${
    flashcards.length
  } cards`;

  // Update arrow button states
  prevCardBtn.disabled = currentIndex === 0;
  nextCardBtn.disabled = currentIndex === flashcards.length - 1;
}

// Show completion screen
function showCompletionScreen() {
  document.querySelector(".flashcard-container").style.display = "none";
  document.querySelector(".flashcard-header").style.display = "none";
  document.querySelector(".progress-section").style.display = "none";
  backBtn.style.display = "none"; // Hide back button on completion screen

  // Update completion message with unit number
  const completionTitle = document.querySelector(".completion-screen h2");
  completionTitle.textContent = `End of ${currentUnit} Flashcards`;

  completionScreen.classList.remove("hidden");

  // Start confetti animation
  startConfetti();
}

// Confetti animation - falls from right side of screen
function startConfetti() {
  const canvas = document.getElementById("confettiCanvas");
  const ctx = canvas.getContext("2d");

  // Set canvas to full window size
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Show canvas
  canvas.classList.add("active");

  const confettiPieces = [];
  const confettiCount = 100;
  const colors = [
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#FFA07A",
    "#98D8C8",
    "#F7DC6F",
    "#BB8FCE",
    "#85C1E2",
    "#FF1744",
    "#00E676",
  ];

  // Create confetti pieces - starting from right side
  for (let i = 0; i < confettiCount; i++) {
    confettiPieces.push({
      x: canvas.width + Math.random() * 100, // Start from right side
      y: Math.random() * canvas.height * 0.5, // Start from top half
      w: Math.random() * 12 + 6,
      h: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotationSpeed: Math.random() * 12 - 6,
      vx: -(Math.random() * 4 + 2), // Move left
      vy: Math.random() * 4 + 3, // Fall down
      opacity: 1,
      gravity: 0.15,
    });
  }

  let animationId;

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let allFallen = true;

    confettiPieces.forEach((piece) => {
      // Update position
      piece.x += piece.vx;
      piece.y += piece.vy;
      piece.vy += piece.gravity; // Add gravity
      piece.rotation += piece.rotationSpeed;

      // Check if still on screen
      if (piece.y < canvas.height + 50 && piece.x > -50) {
        allFallen = false;
      }

      // Draw confetti piece
      ctx.save();
      ctx.translate(piece.x, piece.y);
      ctx.rotate((piece.rotation * Math.PI) / 180);
      ctx.globalAlpha = piece.opacity;
      ctx.fillStyle = piece.color;
      ctx.fillRect(-piece.w / 2, -piece.h / 2, piece.w, piece.h);
      ctx.restore();
    });

    if (!allFallen) {
      animationId = requestAnimationFrame(animate);
    } else {
      // Hide canvas when animation completes
      canvas.classList.remove("active");
    }
  }

  animate();

  // Store animation ID to stop it later if needed
  canvas.animationId = animationId;
}

// Return to homepage
function returnToHomepage() {
  flashcardView.classList.add("hidden");
  homepage.classList.remove("hidden");
  flashcards = [];
  currentIndex = 0;
  isFlipped = false;
  currentUnit = "";

  // Stop confetti animation if running
  const canvas = document.getElementById("confettiCanvas");
  if (canvas) {
    if (canvas.animationId) {
      cancelAnimationFrame(canvas.animationId);
    }
    canvas.classList.remove("active");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  // Reset flashcard view
  document.querySelector(".flashcard-container").style.display = "flex";
  document.querySelector(".flashcard-header").style.display = "block";
  document.querySelector(".progress-section").style.display = "block";
  backBtn.style.display = "block"; // Show back button again
  completionScreen.classList.add("hidden");
  errorMessage.classList.add("hidden");
}

// ===========================
// GLOBAL VARIABLES
// ===========================

// Flashcard variables
let flashcards = [];
let currentCardIndex = 0;
let isFlipped = false;
let currentUnit = "";

// Quiz variables
let quizQuestions = [];
let currentQuestionIndex = 0;
let userAnswers = [];
let quizMode = ""; // 'unit' or 'big100'
let currentQuizUnit = "";

// Unit emoji mapping
const unitEmojis = {
  "Unit 1": "🔐",
  "Unit 2": "🧠",
  "Unit 3": "🧰",
  "Unit 4": "🚨",
  "Unit 5": "⚖️",
};

// Unit full titles mapping
const unitFullTitles = {
  "Unit 1": "Understand Principles of Cyber Security",
  "Unit 2": "Threat Intelligence in Cyber Security",
  "Unit 3": "Cyber Security Testing, Vulnerabilities and Controls",
  "Unit 4": "Cyber Security Incident Response",
  "Unit 5": "Understand Legislation and Ethical Conduct within Cyber Security",
};

// Unit file name mapping
const unitFileNames = {
  "Unit 1": {
    flashcard: "Unit 1_Understand Principles of Cyber Security_flashcards.csv",
    quiz: "Unit_1_quiz.csv",
  },
  "Unit 2": {
    flashcard: "Unit 2_Threat Intelligence in Cyber Security_flashcards.csv",
    quiz: "Unit_2_quiz.csv",
  },
  "Unit 3": {
    flashcard:
      "Unit 3_Cyber Security Testing, Vulnerabilities and Controls_flashcards.csv",
    quiz: "Unit_3_quiz.csv",
  },
  "Unit 4": {
    flashcard: "Unit 4_Cyber Security Incident Response_flashcards.csv",
    quiz: "Unit_4_quiz.csv",
  },
  "Unit 5": {
    flashcard:
      "Unit 5_Understand Legislation and Ethical Conduct within Cyber Security_flashcards.csv",
    quiz: "Unit_5_quiz.csv",
  },
};

// ===========================
// DOM ELEMENTS
// ===========================

// Common elements
const homepage = document.getElementById("homepage");
const loadingOverlay = document.getElementById("loadingOverlay");
const confettiCanvas = document.getElementById("confettiCanvas");

// Flashcard elements
const flashcardView = document.getElementById("flashcardView");
const backBtn = document.getElementById("backBtn");
const flashcard = document.getElementById("flashcard");
const questionContent = document.getElementById("questionContent");
const answerContent = document.getElementById("answerContent");
const prevCardBtn = document.getElementById("prevCardBtn");
const nextCardBtn = document.getElementById("nextCardBtn");
const progressBarFill = document.getElementById("progressBarFill");
const progressCounter = document.getElementById("progressCounter");
const unitTitle = document.getElementById("unitTitle");
const unitSubtitle = document.getElementById("unitSubtitle");
const errorMessage = document.getElementById("errorMessage");
const completionScreen = document.getElementById("completionScreen");
const completionTitle = document.getElementById("completionTitle");
const returnHomeBtn = document.getElementById("returnHomeBtn");
const takeQuizBtn = document.getElementById("takeQuizBtn");

// Quiz elements
const quizView = document.getElementById("quizView");
const quizBackBtn = document.getElementById("quizBackBtn");
const quizTitle = document.getElementById("quizTitle");
const quizQuestionContainer = document.getElementById("quizQuestionContainer");
const quizQuestionText = document.getElementById("quizQuestionText");
const quizAnswerOptions = document.getElementById("quizAnswerOptions");
const quizHintSection = document.getElementById("quizHintSection");
const quizHintToggle = document.getElementById("quizHintToggle");
const quizHintContent = document.getElementById("quizHintContent");
const prevQuestionBtn = document.getElementById("prevQuestionBtn");
const skipBtn = document.getElementById("skipBtn");
const nextQuestionBtn = document.getElementById("nextQuestionBtn");
const finishQuizBtn = document.getElementById("finishQuizBtn");
const quizProgressBarFillHeader = document.getElementById(
  "quizProgressBarFillHeader"
);
const quizProgressCounterHeader = document.getElementById(
  "quizProgressCounterHeader"
);
const quizFinishScreen = document.getElementById("quizFinishScreen");
const quizScoreValue = document.getElementById("quizScoreValue");
const quizAccuracyValue = document.getElementById("quizAccuracyValue");
const reviewQuestionsBtn = document.getElementById("reviewQuestionsBtn");
const retakeQuizBtn = document.getElementById("retakeQuizBtn");
const quizHomeBtn = document.getElementById("quizHomeBtn");
const quizReviewScreen = document.getElementById("quizReviewScreen");
const reviewQuestionsContainer = document.getElementById(
  "reviewQuestionsContainer"
);
const reviewBackBtn = document.getElementById("reviewBackBtn");
const reviewRetakeBtn = document.getElementById("reviewRetakeBtn");
const reviewHomeBtn = document.getElementById("reviewHomeBtn");

// Skipped questions elements
const skippedBtnContainer = document.getElementById("skippedBtnContainer");
const skippedQuestionsBtn = document.getElementById("skippedQuestionsBtn");
const skippedCount = document.getElementById("skippedCount");
const skippedModalOverlay = document.getElementById("skippedModalOverlay");
const skippedModalContent = document.getElementById("skippedModalContent");
const skippedModalCount = document.getElementById("skippedModalCount");
const closeSkippedModal = document.getElementById("closeSkippedModal");
const warningModalOverlay = document.getElementById("warningModalOverlay");
const warningSkippedCount = document.getElementById("warningSkippedCount");
const reviewSkippedBtn = document.getElementById("reviewSkippedBtn");
const finishAnywayBtn = document.getElementById("finishAnywayBtn");
const correctCount = document.getElementById("correctCount");
const wrongCount = document.getElementById("wrongCount");
const skippedBreakdownCount = document.getElementById("skippedBreakdownCount");
const skippedBreakdownItem = document.getElementById("skippedBreakdownItem");

// ===========================
// EVENT LISTENERS
// ===========================

// Homepage - Study buttons
document.querySelectorAll(".study-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const unit = btn.getAttribute("data-unit");
    loadUnit(unit);
  });
});

// Homepage - Quiz buttons
document.querySelectorAll(".quiz-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const unit = btn.getAttribute("data-unit");
    loadQuiz(unit, "unit");
  });
});

// Homepage - BIG 100 button
document.getElementById("big100Btn").addEventListener("click", () => {
  loadQuiz("BIG_100", "big100");
});

// Flashcard navigation
backBtn.addEventListener("click", returnToHomepage);
flashcard.addEventListener("click", flipCard);
prevCardBtn.addEventListener("click", previousCard);
nextCardBtn.addEventListener("click", nextCard);
returnHomeBtn.addEventListener("click", returnToHomepage);
takeQuizBtn.addEventListener("click", () => {
  loadQuiz(currentUnit, "unit");
});

// Quiz navigation
quizBackBtn.addEventListener("click", returnToHomepageFromQuiz);
prevQuestionBtn.addEventListener("click", goToPreviousQuestion);
skipBtn.addEventListener("click", skipQuestion);
nextQuestionBtn.addEventListener("click", goToNextQuestion);
finishQuizBtn.addEventListener("click", finishQuiz);
quizHintToggle.addEventListener("click", toggleHint);
reviewQuestionsBtn.addEventListener("click", showReviewScreen);
retakeQuizBtn.addEventListener("click", retakeQuiz);
quizHomeBtn.addEventListener("click", returnToHomepageFromQuiz);
reviewBackBtn.addEventListener("click", () => {
  quizReviewScreen.classList.add("hidden");
  quizFinishScreen.classList.remove("hidden");
});
reviewRetakeBtn.addEventListener("click", retakeQuiz);
reviewHomeBtn.addEventListener("click", returnToHomepageFromQuiz);

// Skipped questions listeners
skippedQuestionsBtn.addEventListener("click", showSkippedQuestionsModal);
closeSkippedModal.addEventListener("click", closeSkippedModal_handler);
skippedModalOverlay.addEventListener("click", (e) => {
  if (e.target === skippedModalOverlay) {
    closeSkippedModal_handler();
  }
});
reviewSkippedBtn.addEventListener("click", goToFirstSkipped);
finishAnywayBtn.addEventListener("click", proceedToFinish);

// Keyboard navigation for flashcards
document.addEventListener("keydown", (e) => {
  if (flashcardView.classList.contains("hidden")) return;

  switch (e.key) {
    case " ":
    case "Spacebar":
      e.preventDefault();
      flipCard();
      break;
    case "ArrowLeft":
      e.preventDefault();
      previousCard();
      break;
    case "ArrowRight":
      e.preventDefault();
      nextCard();
      break;
  }
});

// ===========================
// FLASHCARD FUNCTIONS
// ===========================

async function loadUnit(unit) {
  currentUnit = unit;

  loadingOverlay.classList.remove("hidden");
  errorMessage.classList.add("hidden");

  const csvFile = unitFileNames[unit].flashcard;

  if (!csvFile) {
    showError("Unit not found");
    return;
  }

  try {
    const response = await fetch(csvFile);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const csvText = await response.text();
    flashcards = parseFlashcardCSV(csvText);

    if (flashcards.length === 0) {
      showError("No flashcards found in this unit");
      return;
    }

    currentCardIndex = 0;
    isFlipped = false;

    // Update title with emoji and full unit name
    const emoji = unitEmojis[unit] || "";
    const fullTitle = unitFullTitles[unit] || "";
    unitTitle.textContent = `${emoji} ${unit}`;
    unitSubtitle.textContent = fullTitle;

    homepage.classList.add("hidden");
    flashcardView.classList.remove("hidden");
    loadingOverlay.classList.add("hidden");

    completionScreen.classList.add("hidden");
    flashcard.style.display = "block";
    document.querySelector(".flashcard-container").style.display = "flex";
    document.querySelector(".flashcard-view .progress-section").style.display =
      "block";

    renderCard();
  } catch (error) {
    console.error("Error loading unit:", error);
    showError("Error loading flashcards. Please check the file exists.");
  }
}

function parseFlashcardCSV(csvText) {
  const lines = csvText.split("\n").filter((line) => line.trim() !== "");
  const cards = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const regex = /(?:^|,)(?:"([^"]*)"|([^",]*))/g;
    const fields = [];
    let match;

    while ((match = regex.exec(line)) !== null) {
      fields.push(match[1] !== undefined ? match[1] : match[2]);
    }

    if (fields[0] === "") fields.shift();

    if (fields.length >= 2) {
      const question = fields[0].trim();
      const answer = fields[1].trim();

      if (question && answer) {
        cards.push({ question, answer });
      }
    }
  }

  return cards;
}

function renderCard() {
  if (flashcards.length === 0) return;

  const card = flashcards[currentCardIndex];

  questionContent.textContent = card.question;
  answerContent.textContent = card.answer;

  isFlipped = false;
  flashcard.classList.remove("flipped");

  updateProgress();

  prevCardBtn.disabled = currentCardIndex === 0;
  prevCardBtn.style.opacity = currentCardIndex === 0 ? "0.5" : "1";

  nextCardBtn.disabled = false;
  nextCardBtn.style.opacity = "1";
}

function updateProgress() {
  const progress = ((currentCardIndex + 1) / flashcards.length) * 100;
  progressBarFill.style.width = `${progress}%`;
  progressCounter.textContent = `${currentCardIndex + 1} / ${
    flashcards.length
  }`;
}

function flipCard() {
  isFlipped = !isFlipped;
  if (isFlipped) {
    flashcard.classList.add("flipped");
  } else {
    flashcard.classList.remove("flipped");
  }
}

function previousCard() {
  if (currentCardIndex > 0) {
    currentCardIndex--;
    renderCard();
  }
}

function nextCard() {
  if (currentCardIndex < flashcards.length - 1) {
    currentCardIndex++;
    renderCard();
  } else {
    showCompletionScreen();
  }
}

function showCompletionScreen() {
  flashcard.style.display = "none";
  document.querySelector(".flashcard-container").style.display = "none";
  document.querySelector(".flashcard-view .progress-section").style.display =
    "none";

  // Update completion title with emoji and unit
  const emoji = unitEmojis[currentUnit] || "";
  completionTitle.textContent = `${emoji} ${currentUnit} Complete!`;

  // Hide back button on completion screen
  backBtn.style.display = "none";

  completionScreen.classList.remove("hidden");

  // NO CONFETTI on flashcard completion - just sparkles (in CSS)
}

function showError(message) {
  loadingOverlay.classList.add("hidden");
  errorMessage.textContent = message;
  errorMessage.classList.remove("hidden");

  setTimeout(() => {
    errorMessage.classList.add("hidden");
    returnToHomepage();
  }, 5000);
}

function returnToHomepage() {
  flashcardView.classList.add("hidden");
  homepage.classList.remove("hidden");

  flashcards = [];
  currentCardIndex = 0;
  isFlipped = false;

  completionScreen.classList.add("hidden");
  flashcard.style.display = "block";
  document.querySelector(".flashcard-container").style.display = "flex";
  document.querySelector(".flashcard-view .progress-section").style.display =
    "block";

  // Show back button again
  backBtn.style.display = "block";

  const ctx = confettiCanvas.getContext("2d");
  ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
}

// ===========================
// QUIZ FUNCTIONS
// ===========================

async function loadQuiz(unit, mode) {
  currentQuizUnit = unit;
  quizMode = mode;

  loadingOverlay.classList.remove("hidden");

  let csvFile;
  if (mode === "big100") {
    csvFile = "BIG_100_quiz.csv";
  } else {
    if (!unitFileNames[unit]) {
      console.error("Unit not found:", unit);
      alert("Quiz not found for this unit.");
      loadingOverlay.classList.add("hidden");
      return;
    }
    csvFile = unitFileNames[unit].quiz;
  }

  console.log("Loading quiz:", unit, "Mode:", mode, "File:", csvFile);

  try {
    const response = await fetch(csvFile);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const csvText = await response.text();
    quizQuestions = parseQuizCSV(csvText);

    if (quizQuestions.length === 0) {
      alert("No quiz questions found.");
      loadingOverlay.classList.add("hidden");
      return;
    }

    // Shuffle answers for each question
    quizQuestions = quizQuestions.map((q) => shuffleAnswers(q));

    // Initialize state
    currentQuestionIndex = 0;
    userAnswers = new Array(quizQuestions.length).fill(null);

    // Update title with emoji
    if (mode === "big100") {
      quizTitle.textContent = "🔥 BIG 100 CHALLENGE";
    } else {
      const emoji = unitEmojis[unit] || "";
      quizTitle.textContent = `${emoji} ${unit} Quiz`;
    }

    // Hide other screens
    homepage.classList.add("hidden");
    flashcardView.classList.add("hidden");
    quizView.classList.remove("hidden");
    loadingOverlay.classList.add("hidden");

    quizQuestionContainer.classList.remove("hidden");
    quizFinishScreen.classList.add("hidden");
    quizReviewScreen.classList.add("hidden");

    // Show back button
    quizBackBtn.style.display = "block";

    renderQuizQuestion(currentQuestionIndex);
  } catch (error) {
    console.error("Error loading quiz:", error);
    console.error("Unit:", unit, "Mode:", mode, "File:", csvFile);
    alert(
      `Error loading quiz: ${error.message}\n\nPlease check:\n1. File "${csvFile}" exists in the same folder as index.html\n2. Browser console (F12) for more details`
    );
    loadingOverlay.classList.add("hidden");
    returnToHomepageFromQuiz();
  }
}

function parseQuizCSV(csvText) {
  const lines = csvText.split("\n").filter((line) => line.trim() !== "");
  const questions = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Parse CSV handling quotes
    const regex = /(?:^|,)(?:"([^"]*(?:""[^"]*)*)"|([^",]*))/g;
    const fields = [];
    let match;

    while ((match = regex.exec(line)) !== null) {
      const value =
        match[1] !== undefined ? match[1].replace(/""/g, '"') : match[2];
      fields.push(value || "");
    }

    if (fields[0] === "") fields.shift();

    if (fields.length >= 10) {
      const question = {
        id: fields[0].trim(),
        unit: fields[1].trim(),
        question: fields[2].trim(),
        answers: {
          A: fields[3].trim(),
          B: fields[4].trim(),
          C: fields[5].trim(),
          D: fields[6].trim(),
        },
        correct: fields[7].trim().toUpperCase(),
        explanation: fields[8].trim(),
        hint: fields[9].trim(),
      };

      if (question.question && question.correct) {
        questions.push(question);
      }
    }
  }

  return questions;
}

function shuffleAnswers(question) {
  const answerArray = [
    { letter: "A", text: question.answers.A },
    { letter: "B", text: question.answers.B },
    { letter: "C", text: question.answers.C },
    { letter: "D", text: question.answers.D },
  ];

  // Fisher-Yates shuffle
  for (let i = answerArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [answerArray[i], answerArray[j]] = [answerArray[j], answerArray[i]];
  }

  // Find new position of correct answer
  const correctAnswerIndex = answerArray.findIndex(
    (a) => a.letter === question.correct
  );
  const newCorrectLetter = ["A", "B", "C", "D"][correctAnswerIndex];

  // Rebuild answers object
  const shuffledAnswers = {
    A: answerArray[0].text,
    B: answerArray[1].text,
    C: answerArray[2].text,
    D: answerArray[3].text,
  };

  return {
    ...question,
    answers: shuffledAnswers,
    shuffledCorrect: newCorrectLetter,
    originalCorrect: question.correct,
  };
}

function renderQuizQuestion(index) {
  const question = quizQuestions[index];
  const userAnswer = userAnswers[index];

  // Update question text
  quizQuestionText.textContent = question.question;

  // Clear previous answers
  quizAnswerOptions.innerHTML = "";

  // Create answer options
  ["A", "B", "C", "D"].forEach((letter) => {
    const answerDiv = document.createElement("div");
    answerDiv.className = "answer-option";
    answerDiv.setAttribute("data-letter", letter);

    const answerLetter = document.createElement("span");
    answerLetter.className = "answer-letter";
    answerLetter.textContent = `${letter})`;

    const answerText = document.createElement("span");
    answerText.className = "answer-text";
    answerText.textContent = question.answers[letter];

    answerDiv.appendChild(answerLetter);
    answerDiv.appendChild(answerText);

    // Check if question is answered (not just skipped)
    if (userAnswer && !userAnswer.wasSkipped) {
      // Question was answered - show results, disable clicking
      answerDiv.classList.add("disabled");

      if (letter === question.shuffledCorrect) {
        answerDiv.classList.add("correct");

        // Show explanation for correct answer
        const explanationDiv = document.createElement("div");
        explanationDiv.className = "answer-explanation";
        explanationDiv.textContent = question.explanation;
        answerDiv.appendChild(explanationDiv);
      }

      if (
        letter === userAnswer.selectedAnswer &&
        letter !== question.shuffledCorrect
      ) {
        answerDiv.classList.add("wrong");
      }
    } else {
      // Question is unanswered or skipped - allow answering
      answerDiv.addEventListener("click", () => selectAnswer(letter));
    }

    quizAnswerOptions.appendChild(answerDiv);
  });

  // Update hint
  if (question.hint) {
    quizHintSection.style.display = "block";
    quizHintContent.textContent = question.hint;
    quizHintToggle.classList.remove("expanded");
    quizHintContent.classList.add("hidden");
  } else {
    quizHintSection.style.display = "none";
  }

  // Update navigation buttons
  prevQuestionBtn.disabled = index === 0;

  // Next button always enabled (will auto-skip if unanswered)
  nextQuestionBtn.disabled = false;
  nextQuestionBtn.classList.remove("hidden");

  if (userAnswer && !userAnswer.wasSkipped) {
    // Question answered - hide Skip button
    skipBtn.classList.add("hidden");

    if (index === quizQuestions.length - 1) {
      nextQuestionBtn.classList.add("hidden");
      finishQuizBtn.classList.remove("hidden");
    } else {
      finishQuizBtn.classList.add("hidden");
    }
  } else {
    // Question not answered yet - show Skip button
    skipBtn.classList.remove("hidden");
    finishQuizBtn.classList.add("hidden");

    if (index === quizQuestions.length - 1) {
      // Last question
      finishQuizBtn.classList.remove("hidden");
    }
  }

  updateQuizProgress();
  updateSkippedButton();
}

function updateSkippedButton() {
  // Only count questions that are explicitly marked as skipped
  // Don't count null (not visited yet)
  const skippedCount = userAnswers.filter((a) => {
    return a && a.wasSkipped;
  }).length;

  if (skippedCount > 0) {
    skippedBtnContainer.classList.remove("hidden");
    document.getElementById("skippedCount").textContent = skippedCount;
  } else {
    skippedBtnContainer.classList.add("hidden");
  }
}

function selectAnswer(selectedLetter) {
  const question = quizQuestions[currentQuestionIndex];
  const isCorrect = selectedLetter === question.shuffledCorrect;

  // Store answer
  userAnswers[currentQuestionIndex] = {
    selectedAnswer: selectedLetter,
    isCorrect: isCorrect,
    wasSkipped: false,
  };

  // Update UI
  const options = quizAnswerOptions.querySelectorAll(".answer-option");
  options.forEach((option) => {
    const letter = option.getAttribute("data-letter");

    option.classList.add("disabled");
    option.style.cursor = "default";

    if (letter === question.shuffledCorrect) {
      option.classList.add("correct");

      // Show explanation for correct answer
      const explanationDiv = document.createElement("div");
      explanationDiv.className = "answer-explanation";
      explanationDiv.textContent = question.explanation;
      option.appendChild(explanationDiv);
    }

    if (letter === selectedLetter && !isCorrect) {
      option.classList.add("wrong");
    }

    // Remove click listeners
    const newOption = option.cloneNode(true);
    option.parentNode.replaceChild(newOption, option);
  });

  // Update buttons
  nextQuestionBtn.disabled = false;
  skipBtn.classList.add("hidden");

  if (currentQuestionIndex === quizQuestions.length - 1) {
    nextQuestionBtn.classList.add("hidden");
    finishQuizBtn.classList.remove("hidden");
  } else {
    nextQuestionBtn.classList.remove("hidden");
    finishQuizBtn.classList.add("hidden");
  }

  updateQuizProgress();
  updateSkippedButton(); // Update in real-time
}

function skipQuestion() {
  userAnswers[currentQuestionIndex] = {
    selectedAnswer: null,
    isCorrect: false,
    wasSkipped: true,
  };

  updateSkippedButton(); // Update immediately

  if (currentQuestionIndex < quizQuestions.length - 1) {
    currentQuestionIndex++;
    renderQuizQuestion(currentQuestionIndex);
  } else {
    finishQuizBtn.classList.remove("hidden");
    skipBtn.classList.add("hidden");
  }
}

function goToPreviousQuestion() {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    renderQuizQuestion(currentQuestionIndex);
  }
}

function goToNextQuestion() {
  // If current question not answered, mark as skipped
  if (!userAnswers[currentQuestionIndex]) {
    userAnswers[currentQuestionIndex] = {
      selectedAnswer: null,
      isCorrect: false,
      wasSkipped: true,
    };
    updateSkippedButton();
  }

  if (currentQuestionIndex < quizQuestions.length - 1) {
    currentQuestionIndex++;
    renderQuizQuestion(currentQuestionIndex);
  }
}

function updateQuizProgress() {
  const answeredCount = userAnswers.filter((a) => a !== null).length;
  const progress = (answeredCount / quizQuestions.length) * 100;
  quizProgressBarFillHeader.style.width = `${progress}%`;
  quizProgressCounterHeader.textContent = `${answeredCount} / ${quizQuestions.length}`;
}

function toggleHint() {
  quizHintToggle.classList.toggle("expanded");
  quizHintContent.classList.toggle("hidden");
}

function finishQuiz() {
  // Check if there are unanswered or skipped questions
  const unansweredQuestions = userAnswers.filter((a, idx) => {
    // Count as unanswered if: null, skipped, or not actually answered
    return !a || a.wasSkipped || !a.selectedAnswer;
  });

  if (unansweredQuestions.length > 0) {
    // Show warning modal
    warningSkippedCount.textContent = unansweredQuestions.length;
    warningModalOverlay.classList.remove("hidden");
    return; // Don't proceed to finish screen yet
  }

  // No unanswered questions, proceed to finish
  proceedToFinish();
}

function proceedToFinish() {
  // Close warning modal if open
  warningModalOverlay.classList.add("hidden");

  console.log("Finishing quiz...");
  console.log("User answers:", userAnswers);

  // Calculate score (all unanswered count as wrong - use TOTAL questions)
  const correctAnswers = userAnswers.filter(
    (a) => a && a.isCorrect && !a.wasSkipped && a.selectedAnswer
  ).length;
  const wrongAnswers = userAnswers.filter(
    (a) => a && !a.isCorrect && !a.wasSkipped && a.selectedAnswer
  ).length;
  const unansweredCount = userAnswers.filter(
    (a) => !a || a.wasSkipped || !a.selectedAnswer
  ).length;
  const totalQuestions = quizQuestions.length;
  const accuracy =
    totalQuestions > 0
      ? Math.round((correctAnswers / totalQuestions) * 100)
      : 0;

  console.log(
    "Correct:",
    correctAnswers,
    "Wrong:",
    wrongAnswers,
    "Unanswered:",
    unansweredCount,
    "Total:",
    totalQuestions,
    "Accuracy:",
    accuracy + "%"
  );

  // Update scores
  quizScoreValue.textContent = `${correctAnswers}/${totalQuestions}`;
  quizAccuracyValue.textContent = `${accuracy}%`;

  // Update breakdown
  correctCount.textContent = correctAnswers;
  wrongCount.textContent = wrongAnswers;
  skippedBreakdownCount.textContent = unansweredCount;

  // Show/hide skipped breakdown item
  if (unansweredCount > 0) {
    skippedBreakdownItem.style.display = "flex";
  } else {
    skippedBreakdownItem.style.display = "none";
  }

  // Get elements
  const finishIcon = document.getElementById("quizFinishIcon");
  const finishTitle = document.getElementById("quizFinishTitle");
  const finishMessage = document.getElementById("quizFinishMessage");

  // Determine icon, message, and animation based on accuracy
  if (accuracy === 100) {
    finishIcon.textContent = "🏆";
    finishIcon.className = "finish-icon trophy-pulse";
    finishTitle.textContent = "100% Achieved! You crushed it!";
    finishMessage.textContent = "";
    triggerConfetti();
  } else if (accuracy >= 80) {
    finishIcon.textContent = "🏆";
    finishIcon.className = "finish-icon trophy-pulse";
    finishTitle.textContent = "Quiz Complete!";
    finishMessage.textContent =
      "Excellent work! You passed with flying colors!";
    triggerConfetti();
  } else if (accuracy >= 50) {
    finishIcon.textContent = "🚀";
    finishIcon.className = "finish-icon star-glow";
    finishTitle.textContent = "Good Progress!";
    finishMessage.textContent =
      "Good job! You're on a learning streak! Keep pushing forward!";
  } else {
    finishIcon.textContent = "🌱";
    finishIcon.className = "finish-icon plant-bounce";
    finishTitle.textContent = "Keep Growing!";
    finishMessage.textContent =
      "You've got this! Review and give it another shot!";
  }

  // Hide back button on finish screen
  quizBackBtn.style.display = "none";

  console.log("Showing finish screen...");

  // Hide question container, show finish screen
  quizQuestionContainer.classList.add("hidden");
  quizFinishScreen.classList.remove("hidden");

  console.log("Finish screen should now be visible");

  // TRIGGER FEEDBACK SYSTEM
  // Capture the current quiz details and score
  const quizTitle = document.getElementById("quizTitle").textContent;
  const scoreText = `${correctAnswers}/${totalQuestions} (${accuracy}%)`;

  // Delay feedback prompt by 5 seconds after results shown
  setTimeout(() => {
    if (quizTitle.includes("BIG 100")) {
      // Trigger final feedback for BIG 100
      showFinalFeedbackPrompt(scoreText);
    } else {
      // Extract unit number from title for unit quizzes
      const unitMatch = quizTitle.match(/Unit (\d+)/);
      if (unitMatch) {
        const unitNumber = unitMatch[1];
        const unitTitle = quizTitle.replace(`Unit ${unitNumber} - `, "");
        showFeedbackPrompt(unitNumber, unitTitle, scoreText);
      }
    }
  }, 3000); // 3 second delay
}

function showSkippedQuestionsModal() {
  // Build list of explicitly skipped questions only
  skippedModalContent.innerHTML = "";

  const skippedQuestions = [];
  userAnswers.forEach((answer, index) => {
    if (answer && answer.wasSkipped) {
      skippedQuestions.push({
        index: index,
        question: quizQuestions[index],
      });
    }
  });

  skippedModalCount.textContent = skippedQuestions.length;

  skippedQuestions.forEach((item) => {
    const itemDiv = document.createElement("div");
    itemDiv.className = "skipped-question-item";

    const numberDiv = document.createElement("div");
    numberDiv.className = "skipped-question-number";
    numberDiv.textContent = `Question ${item.index + 1}`;

    const textDiv = document.createElement("div");
    textDiv.className = "skipped-question-text";
    textDiv.textContent = item.question.question;

    const btnDiv = document.createElement("button");
    btnDiv.className = "go-to-question-btn";
    btnDiv.textContent = `Go to Question ${item.index + 1}`;
    btnDiv.addEventListener("click", () => {
      goToSkippedQuestion(item.index);
    });

    itemDiv.appendChild(numberDiv);
    itemDiv.appendChild(textDiv);
    itemDiv.appendChild(btnDiv);

    skippedModalContent.appendChild(itemDiv);
  });

  skippedModalOverlay.classList.remove("hidden");
}

function closeSkippedModal_handler() {
  skippedModalOverlay.classList.add("hidden");
}

function goToSkippedQuestion(index) {
  currentQuestionIndex = index;
  closeSkippedModal_handler();
  renderQuizQuestion(currentQuestionIndex);
}

function goToFirstSkipped() {
  // Find first unanswered question (skipped or null)
  const firstUnansweredIndex = userAnswers.findIndex(
    (a) => !a || a.wasSkipped || !a.selectedAnswer
  );

  if (firstUnansweredIndex !== -1) {
    warningModalOverlay.classList.add("hidden");
    currentQuestionIndex = firstUnansweredIndex;
    renderQuizQuestion(currentQuestionIndex);
  }
}

function showReviewScreen() {
  quizFinishScreen.classList.add("hidden");
  quizReviewScreen.classList.remove("hidden");

  // Clear previous content
  reviewQuestionsContainer.innerHTML = "";

  // Render all questions
  quizQuestions.forEach((question, index) => {
    const questionCard = document.createElement("div");
    questionCard.className = "review-question-card";

    const questionNumber = document.createElement("div");
    questionNumber.className = "review-question-number";
    questionNumber.textContent = `Question ${index + 1}`;

    const questionText = document.createElement("div");
    questionText.className = "review-question-text";
    questionText.textContent = question.question;

    const correctAnswerDiv = document.createElement("div");
    correctAnswerDiv.className = "review-correct-answer";

    const answerLabel = document.createElement("div");
    answerLabel.className = "review-answer-label";
    answerLabel.textContent = `✓ Correct Answer: ${question.shuffledCorrect}) ${
      question.answers[question.shuffledCorrect]
    }`;

    const explanationDiv = document.createElement("div");
    explanationDiv.className = "review-explanation";
    explanationDiv.textContent = question.explanation;

    correctAnswerDiv.appendChild(answerLabel);
    correctAnswerDiv.appendChild(explanationDiv);

    questionCard.appendChild(questionNumber);
    questionCard.appendChild(questionText);
    questionCard.appendChild(correctAnswerDiv);

    reviewQuestionsContainer.appendChild(questionCard);
  });
}

function retakeQuiz() {
  // Reshuffle answers
  quizQuestions = quizQuestions.map((q) => shuffleAnswers(q));

  // Reset state
  currentQuestionIndex = 0;
  userAnswers = new Array(quizQuestions.length).fill(null);

  // Hide skipped button
  skippedBtnContainer.classList.add("hidden");

  // Hide finish/review screens, show quiz
  quizFinishScreen.classList.add("hidden");
  quizReviewScreen.classList.add("hidden");
  quizQuestionContainer.classList.remove("hidden");

  // Show back button again
  quizBackBtn.style.display = "block";

  // Render first question
  renderQuizQuestion(currentQuestionIndex);
}

function returnToHomepageFromQuiz() {
  quizView.classList.add("hidden");
  homepage.classList.remove("hidden");

  // Reset state
  quizQuestions = [];
  currentQuestionIndex = 0;
  userAnswers = [];

  // Hide skipped button and close modals
  skippedBtnContainer.classList.add("hidden");
  skippedModalOverlay.classList.add("hidden");
  warningModalOverlay.classList.add("hidden");

  // Reset screens
  quizFinishScreen.classList.add("hidden");
  quizReviewScreen.classList.add("hidden");
  quizQuestionContainer.classList.remove("hidden");

  // Show back button again
  quizBackBtn.style.display = "block";
}

// ===========================
// CONFETTI ANIMATION
// ===========================

function triggerConfetti() {
  const canvas = confettiCanvas;
  const ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const confettiPieces = [];
  const colors = [
    "#ff6b6b",
    "#4ecdc4",
    "#45b7d1",
    "#f9ca24",
    "#6c5ce7",
    "#a29bfe",
    "#00d2d3",
  ];
  const confettiCount = 150;

  for (let i = 0; i < confettiCount; i++) {
    confettiPieces.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      w: Math.random() * 10 + 5,
      h: Math.random() * 5 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      speed: Math.random() * 3 + 2,
      rotationSpeed: Math.random() * 5 - 2.5,
      swing: Math.random() * 2 - 1,
    });
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    confettiPieces.forEach((piece, index) => {
      ctx.save();
      ctx.translate(piece.x + piece.w / 2, piece.y + piece.h / 2);
      ctx.rotate((piece.rotation * Math.PI) / 180);
      ctx.fillStyle = piece.color;
      ctx.fillRect(-piece.w / 2, -piece.h / 2, piece.w, piece.h);
      ctx.restore();

      piece.y += piece.speed;
      piece.rotation += piece.rotationSpeed;
      piece.x += piece.swing;

      if (piece.y > canvas.height) {
        confettiPieces.splice(index, 1);
      }
    });

    if (confettiPieces.length > 0) {
      requestAnimationFrame(animate);
    }
  }

  animate();
}

window.addEventListener("resize", () => {
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
});

// ===========================
// INITIALIZE
// ===========================

window.addEventListener("DOMContentLoaded", () => {
  homepage.classList.remove("hidden");
  loadingOverlay.classList.add("hidden");
  flashcardView.classList.add("hidden");
  quizView.classList.add("hidden");
});

// ============================================
// EMAILJS CONFIGURATION
// ============================================
// Initialize EmailJS with public key
emailjs.init("D8BkfDXUU7npJC2os");

const EMAIL_CONFIG = {
  serviceId: "service_0w7q097",
  unitFeedbackTemplateId: "template_80dw2j7",
  finalFeedbackTemplateId: "template_oc5nlre",
};

// ============================================
// KNOWLEDGE CHECK SYSTEM
// ============================================

let knowledgeCheckQuestions = [];
let currentKCQuestion = 0;
let kcAnswers = [];
let kcStudentName = "";

// DOM Elements - Knowledge Check
const kcBtn = document.getElementById("knowledgeCheckBtn");
const kcModal = document.getElementById("knowledgeCheckModal");
const kcCloseBtn = document.getElementById("kcCloseBtn");
const kcIntroScreen = document.getElementById("kcIntroScreen");
const kcQuestionScreen = document.getElementById("kcQuestionScreen");
const kcResultsScreen = document.getElementById("kcResultsScreen");
const kcStartBtn = document.getElementById("kcStartBtn");
const kcStudentNameInput = document.getElementById("kcStudentName");
const kcProgressFill = document.getElementById("kcProgressFill");
const kcProgressText = document.getElementById("kcProgressText");
const kcQuestion = document.getElementById("kcQuestion");
const kcOptions = document.getElementById("kcOptions");
const kcPrevBtn = document.getElementById("kcPrevBtn");
const kcNextBtn = document.getElementById("kcNextBtn");
const kcSubmitBtn = document.getElementById("kcSubmitBtn");
const kcResultName = document.getElementById("kcResultName");
const kcScoreValue = document.getElementById("kcScoreValue");
const kcScorePercent = document.getElementById("kcScorePercent");
const kcCloseResults = document.getElementById("kcCloseResults");

// Load Knowledge Check CSV
async function loadKnowledgeCheckQuestions() {
  try {
    const response = await fetch("my_knowledge_check.csv");
    const csvText = await response.text();
    const lines = csvText.split("\n").filter((line) => line.trim());

    // Skip header row
    knowledgeCheckQuestions = lines.slice(1).map((line) => {
      const values = parseCSVLine(line);
      return {
        id: values[0],
        question: values[1],
        options: [values[2], values[3], values[4], values[5]],
        correct: values[6],
        explanation: values[7],
      };
    });
  } catch (error) {
    console.error("Error loading questions:", error);
    alert("Failed to load Knowledge Check questions. Please refresh the page.");
  }
}

// Parse CSV line (handles quotes)
function parseCSVLine(line) {
  const result = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

// Open Knowledge Check Modal
kcBtn.addEventListener("click", async () => {
  if (knowledgeCheckQuestions.length === 0) {
    await loadKnowledgeCheckQuestions();
  }
  kcModal.classList.remove("hidden");
  kcIntroScreen.classList.remove("hidden");
  kcQuestionScreen.classList.add("hidden");
  kcResultsScreen.classList.add("hidden");
  kcStudentNameInput.value = "";
});

// Close Modal
kcCloseBtn.addEventListener("click", () => {
  kcModal.classList.add("hidden");
});

kcCloseResults.addEventListener("click", () => {
  kcModal.classList.add("hidden");
});

// Start Knowledge Check
kcStartBtn.addEventListener("click", () => {
  const name = kcStudentNameInput.value.trim();
  if (!name || name.length < 2) {
    alert("Please enter your name (at least 2 characters)");
    return;
  }

  kcStudentName = name;
  currentKCQuestion = 0;
  kcAnswers = new Array(knowledgeCheckQuestions.length).fill(null);

  kcIntroScreen.classList.add("hidden");
  kcQuestionScreen.classList.remove("hidden");
  displayKCQuestion();
});

// Display Question
function displayKCQuestion() {
  const q = knowledgeCheckQuestions[currentKCQuestion];
  const progress =
    ((currentKCQuestion + 1) / knowledgeCheckQuestions.length) * 100;

  kcProgressFill.style.width = `${progress}%`;
  kcProgressText.textContent = `Question ${currentKCQuestion + 1} / ${
    knowledgeCheckQuestions.length
  }`;
  kcQuestion.textContent = q.question;

  // Create options
  kcOptions.innerHTML = "";
  q.options.forEach((option, index) => {
    const optionDiv = document.createElement("div");
    optionDiv.className = "kc-option";
    optionDiv.textContent = `${String.fromCharCode(65 + index)}) ${option}`;
    optionDiv.dataset.answer = String.fromCharCode(65 + index);

    if (kcAnswers[currentKCQuestion] === String.fromCharCode(65 + index)) {
      optionDiv.classList.add("selected");
    }

    optionDiv.addEventListener("click", () => selectKCAnswer(optionDiv));
    kcOptions.appendChild(optionDiv);
  });

  // Update buttons
  kcPrevBtn.disabled = currentKCQuestion === 0;
  kcNextBtn.disabled = kcAnswers[currentKCQuestion] === null;

  if (currentKCQuestion === knowledgeCheckQuestions.length - 1) {
    kcNextBtn.classList.add("hidden");
    kcSubmitBtn.classList.remove("hidden");
    kcSubmitBtn.disabled = kcAnswers[currentKCQuestion] === null;
  } else {
    kcNextBtn.classList.remove("hidden");
    kcSubmitBtn.classList.add("hidden");
  }
}

// Select Answer
function selectKCAnswer(selectedOption) {
  const options = kcOptions.querySelectorAll(".kc-option");
  options.forEach((opt) => opt.classList.remove("selected"));
  selectedOption.classList.add("selected");

  kcAnswers[currentKCQuestion] = selectedOption.dataset.answer;
  kcNextBtn.disabled = false;
  kcSubmitBtn.disabled = false;
}

// Navigation
kcPrevBtn.addEventListener("click", () => {
  if (currentKCQuestion > 0) {
    currentKCQuestion--;
    displayKCQuestion();
  }
});

kcNextBtn.addEventListener("click", () => {
  if (currentKCQuestion < knowledgeCheckQuestions.length - 1) {
    currentKCQuestion++;
    displayKCQuestion();
  }
});

// Submit Knowledge Check
kcSubmitBtn.addEventListener("click", () => {
  if (kcAnswers.includes(null)) {
    alert("Please answer all questions before submitting.");
    return;
  }

  // Calculate score
  let correct = 0;
  knowledgeCheckQuestions.forEach((q, index) => {
    if (kcAnswers[index] === q.correct) {
      correct++;
    }
  });

  const percentage = Math.round(
    (correct / knowledgeCheckQuestions.length) * 100
  );

  // Show results
  kcResultName.textContent = kcStudentName;
  kcScoreValue.textContent = `${correct}/${knowledgeCheckQuestions.length}`;
  kcScorePercent.textContent = `${percentage}%`;

  kcQuestionScreen.classList.add("hidden");
  kcResultsScreen.classList.remove("hidden");

  // Note: Email sending skipped as template not created
  console.log(
    `Knowledge Check completed by ${kcStudentName}: ${correct}/${knowledgeCheckQuestions.length} (${percentage}%)`
  );
});

// ============================================
// FEEDBACK SYSTEM - UNIT QUICK FEEDBACK
// ============================================

// DOM Elements - Feedback
const feedbackModal = document.getElementById("feedbackModal");
const feedbackPrompt = document.getElementById("feedbackPrompt");
const fbCloseBtn = document.getElementById("fbCloseBtn");
const fbUnitTitle = document.getElementById("fbUnitTitle");
const feedbackForm = document.getElementById("feedbackForm");
const fbStudentName = document.getElementById("fbStudentName");
const fbStarRating = document.getElementById("fbStarRating");
const fbRating = document.getElementById("fbRating");
const fbImprovements = document.getElementById("fbImprovements");
const fbWordCount = document.getElementById("fbWordCount");
const fbError = document.getElementById("fbError");
const fbSuccess = document.getElementById("fbSuccess");
const fbMaybeLater = document.getElementById("fbMaybeLater");
const promptGiveFeedback = document.getElementById("promptGiveFeedback");
const promptMaybeLater = document.getElementById("promptMaybeLater");

let currentFeedbackUnit = null;
let currentFeedbackScore = null;

// Star Rating functionality
function initStarRating(container, hiddenInput) {
  const stars = container.querySelectorAll(".star");

  stars.forEach((star, index) => {
    star.addEventListener("click", () => {
      const rating = index + 1;
      hiddenInput.value = rating;

      stars.forEach((s, i) => {
        if (i < rating) {
          s.classList.add("selected");
          s.textContent = "★";
        } else {
          s.classList.remove("selected");
          s.textContent = "☆";
        }
      });
    });

    star.addEventListener("mouseenter", () => {
      stars.forEach((s, i) => {
        if (i <= index) {
          s.textContent = "★";
        } else {
          s.textContent = "☆";
        }
      });
    });
  });

  container.addEventListener("mouseleave", () => {
    const currentRating = parseInt(hiddenInput.value) || 0;
    stars.forEach((s, i) => {
      if (i < currentRating) {
        s.textContent = "★";
      } else {
        s.textContent = "☆";
      }
    });
  });
}

initStarRating(fbStarRating, fbRating);

// Word count
fbImprovements.addEventListener("input", () => {
  const words = fbImprovements.value
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0);
  fbWordCount.textContent = words.length;
});

// Show feedback prompt after quiz completion
function showFeedbackPrompt(unitNumber, unitTitle, quizScore) {
  currentFeedbackUnit = { number: unitNumber, title: unitTitle };
  currentFeedbackScore = quizScore;

  // Show prompt immediately (delay already handled in proceedToFinish)
  feedbackPrompt.classList.remove("hidden");
}

// Prompt buttons
promptGiveFeedback.addEventListener("click", () => {
  feedbackPrompt.classList.add("hidden");
  openFeedbackModal();
});

promptMaybeLater.addEventListener("click", () => {
  feedbackPrompt.classList.add("hidden");
});

// Open feedback modal
function openFeedbackModal() {
  if (!currentFeedbackUnit) return;

  fbUnitTitle.textContent = `Unit ${currentFeedbackUnit.number}`;
  feedbackForm.classList.remove("hidden");
  fbSuccess.classList.add("hidden");
  feedbackForm.reset();
  fbRating.value = "";
  fbWordCount.textContent = "0";
  fbError.classList.add("hidden");

  // Reset stars
  fbStarRating.querySelectorAll(".star").forEach((s) => {
    s.classList.remove("selected");
    s.textContent = "☆";
  });

  feedbackModal.classList.remove("hidden");
}

// Close feedback modal
fbCloseBtn.addEventListener("click", () => {
  feedbackModal.classList.add("hidden");
});

fbMaybeLater.addEventListener("click", () => {
  feedbackModal.classList.add("hidden");
});

// Submit feedback
feedbackForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Validate
  const name = fbStudentName.value.trim();
  const rating = fbRating.value;
  const difficulty = document.querySelector('input[name="difficulty"]:checked');
  const improvements = fbImprovements.value.trim();
  const words = improvements.split(/\s+/).filter((w) => w.length > 0);

  if (!name || name.length < 2) {
    showError(fbError, "Please enter your name (at least 2 characters)");
    return;
  }

  if (!rating) {
    showError(fbError, "Please select a star rating");
    return;
  }

  if (!difficulty) {
    showError(fbError, "Please select quiz difficulty");
    return;
  }

  if (words.length < 5) {
    showError(
      fbError,
      `Please provide at least 5 words of feedback (currently: ${words.length} words)`
    );
    return;
  }

  // Send email
  try {
    const stars = "⭐".repeat(parseInt(rating));

    await emailjs.send(
      EMAIL_CONFIG.serviceId,
      EMAIL_CONFIG.unitFeedbackTemplateId,
      {
        student_name: name,
        unit_number: currentFeedbackUnit.number,
        unit_title: currentFeedbackUnit.title,
        quiz_score: currentFeedbackScore,
        date: new Date().toLocaleString(),
        flashcard_stars: stars,
        flashcard_rating: rating,
        quiz_difficulty: difficulty.value,
        improvements: improvements,
      }
    );

    // Show success
    feedbackForm.classList.add("hidden");
    fbSuccess.classList.remove("hidden");

    setTimeout(() => {
      feedbackModal.classList.add("hidden");
    }, 3000);
  } catch (error) {
    console.error("Error sending feedback:", error);
    showError(fbError, "Failed to send feedback. Please try again.");
  }
});

// ============================================
// FEEDBACK SYSTEM - FINAL COURSE FEEDBACK
// ============================================

// DOM Elements - Final Feedback
const finalFeedbackModal = document.getElementById("finalFeedbackModal");
const ffCloseBtn = document.getElementById("ffCloseBtn");
const finalFeedbackForm = document.getElementById("finalFeedbackForm");
const ffStudentName = document.getElementById("ffStudentName");
const ffStarRating = document.getElementById("ffStarRating");
const ffRating = document.getElementById("ffRating");
const ffLikedMost = document.getElementById("ffLikedMost");
const ffToImprove = document.getElementById("ffToImprove");
const ffLikedCount = document.getElementById("ffLikedCount");
const ffImproveCount = document.getElementById("ffImproveCount");
const ffError = document.getElementById("ffError");
const ffSuccess = document.getElementById("ffSuccess");

let big100Score = null;

initStarRating(ffStarRating, ffRating);

// Word counts
ffLikedMost.addEventListener("input", () => {
  const words = ffLikedMost.value
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0);
  ffLikedCount.textContent = words.length;
});

ffToImprove.addEventListener("input", () => {
  const words = ffToImprove.value
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0);
  ffImproveCount.textContent = words.length;
});

// Show final feedback prompt after BIG 100
function showFinalFeedbackPrompt(score) {
  big100Score = score;

  // Show prompt immediately (delay already handled in proceedToFinish)
  feedbackPrompt.querySelector("p").textContent =
    "💬 Final course feedback? (30 sec) - Help future students 🎓!";
  feedbackPrompt.classList.remove("hidden");

  // Override prompt buttons for final feedback
  const tempGive = promptGiveFeedback.cloneNode(true);
  const tempLater = promptMaybeLater.cloneNode(true);

  promptGiveFeedback.parentNode.replaceChild(tempGive, promptGiveFeedback);
  promptMaybeLater.parentNode.replaceChild(tempLater, promptMaybeLater);

  tempGive.addEventListener("click", () => {
    feedbackPrompt.classList.add("hidden");
    openFinalFeedbackModal();
  });

  tempLater.addEventListener("click", () => {
    feedbackPrompt.classList.add("hidden");
  });
}

// Open final feedback modal
function openFinalFeedbackModal() {
  finalFeedbackForm.classList.remove("hidden");
  ffSuccess.classList.add("hidden");
  finalFeedbackForm.reset();
  ffRating.value = "";
  ffLikedCount.textContent = "0";
  ffImproveCount.textContent = "0";
  ffError.classList.add("hidden");

  ffStarRating.querySelectorAll(".star").forEach((s) => {
    s.classList.remove("selected");
    s.textContent = "☆";
  });

  finalFeedbackModal.classList.remove("hidden");
}

// Close final feedback modal
ffCloseBtn.addEventListener("click", () => {
  finalFeedbackModal.classList.add("hidden");
});

// Submit final feedback
finalFeedbackForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Validate
  const name = ffStudentName.value.trim();
  const rating = ffRating.value;
  const recommend = document.querySelector('input[name="recommend"]:checked');
  const likedMost = ffLikedMost.value.trim();
  const toImprove = ffToImprove.value.trim();
  const likedWords = likedMost.split(/\s+/).filter((w) => w.length > 0);
  const improveWords = toImprove.split(/\s+/).filter((w) => w.length > 0);

  if (!name || name.length < 2) {
    showError(ffError, "Please enter your name (at least 2 characters)");
    return;
  }

  if (!rating) {
    showError(ffError, "Please select an overall rating");
    return;
  }

  if (likedWords.length < 10) {
    showError(
      ffError,
      `"What you liked" needs at least 10 words (currently: ${likedWords.length} words)`
    );
    return;
  }

  if (improveWords.length < 10) {
    showError(
      ffError,
      `"What to improve" needs at least 10 words (currently: ${improveWords.length} words)`
    );
    return;
  }

  if (!recommend) {
    showError(ffError, "Please select if you would recommend this course");
    return;
  }

  // Send email
  try {
    const stars = "⭐".repeat(parseInt(rating));

    await emailjs.send(
      EMAIL_CONFIG.serviceId,
      EMAIL_CONFIG.finalFeedbackTemplateId,
      {
        student_name: name,
        big100_score: big100Score,
        date: new Date().toLocaleString(),
        overall_stars: stars,
        overall_rating: rating,
        liked_most: likedMost,
        to_improve: toImprove,
        would_recommend: recommend.value,
      }
    );

    // Show success
    finalFeedbackForm.classList.add("hidden");
    ffSuccess.classList.remove("hidden");

    setTimeout(() => {
      finalFeedbackModal.classList.add("hidden");
    }, 5000);
  } catch (error) {
    console.error("Error sending final feedback:", error);
    showError(ffError, "Failed to send feedback. Please try again.");
  }
});

// Helper function to show errors
function showError(errorElement, message) {
  errorElement.textContent = message;
  errorElement.classList.remove("hidden");
  setTimeout(() => {
    errorElement.classList.add("hidden");
  }, 5000);
}

// ============================================
// INTEGRATE WITH EXISTING QUIZ SYSTEM
// ============================================
// Feedback is now triggered directly from proceedToFinish() function above
// This ensures accurate score capture and proper timing

console.log("✅ Knowledge Check and Feedback systems initialized!");
console.log("📧 EmailJS configured with Service ID:", EMAIL_CONFIG.serviceId);

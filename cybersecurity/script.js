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
  "Unit 6": "🎓",
};

// Unit full titles mapping
const unitFullTitles = {
  "Unit 1": "Understand Principles of Cyber Security",
  "Unit 2": "Threat Intelligence in Cyber Security",
  "Unit 3": "Cyber Security Testing, Vulnerabilities and Controls",
  "Unit 4": "Cyber Security Incident Response",
  "Unit 5": "Understand Legislation and Ethical Conduct within Cyber Security",
  "Unit 6": "Personal and Professional Development in Cyber Security",
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
  "Unit 6": {
    flashcard: "Unit_6_Personal_Professional_Development_flashcards.csv",
    quiz: null,
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
  "quizProgressBarFillHeader",
);
const quizProgressCounterHeader = document.getElementById(
  "quizProgressCounterHeader",
);
const quizFinishScreen = document.getElementById("quizFinishScreen");
const quizScoreValue = document.getElementById("quizScoreValue");
const quizAccuracyValue = document.getElementById("quizAccuracyValue");
const reviewQuestionsBtn = document.getElementById("reviewQuestionsBtn");
const retakeQuizBtn = document.getElementById("retakeQuizBtn");
const quizHomeBtn = document.getElementById("quizHomeBtn");
const quizReviewScreen = document.getElementById("quizReviewScreen");
const reviewQuestionsContainer = document.getElementById(
  "reviewQuestionsContainer",
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
      `Error loading quiz: ${error.message}\n\nPlease check:\n1. File "${csvFile}" exists in the same folder as index.html\n2. Browser console (F12) for more details`,
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
    (a) => a.letter === question.correct,
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
    (a) => a && a.isCorrect && !a.wasSkipped && a.selectedAnswer,
  ).length;
  const wrongAnswers = userAnswers.filter(
    (a) => a && !a.isCorrect && !a.wasSkipped && a.selectedAnswer,
  ).length;
  const unansweredCount = userAnswers.filter(
    (a) => !a || a.wasSkipped || !a.selectedAnswer,
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
    accuracy + "%",
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
    (a) => !a || a.wasSkipped || !a.selectedAnswer,
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
    (correct / knowledgeCheckQuestions.length) * 100,
  );

  // Show results
  kcResultName.textContent = kcStudentName;
  kcScoreValue.textContent = `${correct}/${knowledgeCheckQuestions.length}`;
  kcScorePercent.textContent = `${percentage}%`;

  kcQuestionScreen.classList.add("hidden");
  kcResultsScreen.classList.remove("hidden");

  // Note: Email sending skipped as template not created
  console.log(
    `Knowledge Check completed by ${kcStudentName}: ${correct}/${knowledgeCheckQuestions.length} (${percentage}%)`,
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
      `Please provide at least 5 words of feedback (currently: ${words.length} words)`,
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
      },
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
      `"What you liked" needs at least 10 words (currently: ${likedWords.length} words)`,
    );
    return;
  }

  if (improveWords.length < 10) {
    showError(
      ffError,
      `"What to improve" needs at least 10 words (currently: ${improveWords.length} words)`,
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
      },
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

// ===========================
// ===========================
// UNIT 6 - PDP FUNCTIONALITY - SIMPLIFIED FLOW
// ===========================

// AI PROMPTS FOR EACH SECTION
const AI_PROMPTS = {
  2.1: `I am a student exploring a career in cybersecurity. Ask me one question at a time, giving examples or hints to help me answer. Guide me to think about my:
* Technical skills (programming languages, networking, operating systems, cybersecurity tools)
* Practical experience (home labs, projects, Capture The Flag challenges, simulations)
* Soft skills (communication, problem-solving, attention to detail, teamwork, adaptability)

Technical Skills
1. What programming languages do you know that could be useful in cybersecurity? (Example: Python, Java, C++)
2. What networking skills do you have? (Example: TCP/IP, routers, switches, network troubleshooting)
3. Are you familiar with any operating systems for cybersecurity tasks? (Example: Linux, Windows, macOS)
4. Do you know how to use any cybersecurity tools or software? (Example: Wireshark, Nmap, Metasploit, firewalls)
5. Do you have knowledge of security concepts or frameworks? (Example: encryption, threat modeling, incident response)

Practical Experience
1. Have you completed any hands-on projects or home labs related to cybersecurity? (Example: building a website, configuring a firewall, virtual lab setups)
2. Have you participated in competitions, Capture The Flag (CTF) challenges, or hackathons?
3. Have you contributed to open-source projects or personal coding projects that demonstrate your skills?
4. Do you have experience analysing data, logs, or system behaviour?
5. Have you done any internships, volunteering, or practical work that is relevant to cybersecurity?

Soft Skills
1. What problem-solving or analytical skills do you have that would help in cybersecurity?
2. What communication or teamwork skills do you have? (Example: explaining technical issues clearly, working with a team on projects)
3. What personal qualities help you succeed under pressure? (Example: attention to detail, persistence, adaptability)

Achievements & Learning
1. Have you completed any certifications, courses, or awards that demonstrate your skills? (Example: online courses, school achievements, coding certifications)
2. Are there areas you feel you still need to develop to succeed in cybersecurity? (Example: advanced networking, SIEM tools, incident response, professional communication)

After I answer all 15 questions, automatically:
1. Generate 5 skills I already have that are useful or important in cybersecurity, based on my answers.
2. Generate 3 additional skills I will need to develop for a career in cybersecurity, based on my answers.
3. Remind me to use these answers to complete the worksheet unit 6 / 2.1 Identify skills required for a career in cybersecurity
Do not ask for further clarification after the last question — just produce the lists. Start by asking me the first question now.`,

  2.2: `I am a student completing a personal SWOT analysis to understand my skills and career potential. Ask me one question at a time, giving examples or hints to help me answer. Focus on the four areas of SWOT:
* Strengths – Skills, qualities, or experiences I do well. (Examples: attention to detail, coding, problem-solving, teamwork, leadership.)
* Weaknesses – Skills or areas I need to improve. (Examples: communication, confidence, cybersecurity terminology, time management.)
* Opportunities – External factors I can take advantage of to improve or progress. (Examples: free online courses, mentorship, clubs, competitions, certifications.)
* Threats – External factors that might make it harder to achieve my goals. (Examples: lack of mentorship, time constraints, competition, limited resources.)

Ask me the following 5 guided questions for each SWOT area, giving examples if I am unsure:

STRENGTHS
1. What technical skills do you have that you are confident in? (Example: programming, networking, Linux/Windows, cybersecurity tools)
2. What practical experiences or projects have you completed that show your abilities? (Example: home labs, school projects, competitions, CTFs)
3. What personal qualities help you succeed in challenging tasks? (Example: attention to detail, problem-solving, persistence)
4. What soft skills do you feel are your strongest? (Example: teamwork, communication, leadership, adaptability)
5. Are there achievements or recognitions you are proud of that demonstrate your strengths? (Example: awards, certifications, completed courses)

WEAKNESSES
1. What technical skills do you feel you are lacking or not confident in? (Example: firewall management, SIEM tools, log analysis, advanced networking)
2. Which soft skills could you improve to work more effectively in teams or projects? (Example: communication, time management, public speaking)
3. Are there gaps in your practical experience that make you feel less prepared? (Example: few labs, limited hands-on practice, no CTF experience)
4. Are there personal habits that sometimes hold you back? (Example: procrastination, difficulty prioritizing tasks)
5. Do you find certain concepts or areas in cybersecurity difficult to understand? (Example: terminology, threat detection, incident response)

OPPORTUNITIES
1. What online courses, certifications, or resources are available to you to enhance your skills? (Example: free courses, vendor certifications like NSE4, YouTube tutorials)
2. Are there clubs, communities, or competitions that could help you gain experience? (Example: cybersecurity clubs, CTF competitions, online forums)
3. Can mentorship or networking opportunities help you progress? (Example: connecting with professionals, joining LinkedIn groups)
4. Are there tools or software you could access to practice more effectively? (Example: virtual labs, simulation tools, coding platforms)
5. Are there ways to gain practical experience through volunteering, internships, or personal projects? (Example: helping with small IT projects, participating in open-source projects)

THREATS
1. Are there time constraints that make it hard to dedicate hours to learning or practice? (Example: school, work, family commitments)
2. Are there financial limitations affecting your ability to access courses, labs, or tools?
3. Could lack of mentorship or guidance slow your progress?
4. Is competition or high standards in cybersecurity a concern for you?
5. Are there personal challenges that could prevent consistent learning or skill development? (Example: motivation, stress, limited access to equipment)

After I answer all 20 questions across the four SWOT areas, automatically:
1. Summarise my SWOT analysis in a clear, organised table or list.
2. Suggest 5 actionable personal development ideas or goals based on my SWOT.
3. Remind me to use these answers to complete the worksheet unit 6 / 2.2 Perform a personal skills analysis
Start by asking me the first question for Strengths, giving examples and hints if I'm unsure.`,

  2.3: `I am a student assessing my own skills against those required for a career in cybersecurity. Ask me guided questions one at a time, giving examples or hints to help me reflect on:
* Technical skills (programming languages, networking, operating systems, cybersecurity tools)
* Practical experience (home labs, projects, CTF challenges, simulations)
* Soft skills (communication, problem-solving, attention to detail, teamwork, adaptability)
* Achievements and learning gaps (certifications, completed courses, areas I need to improve)

Ask questions like the following (15 in total):

Technical Skills
1. What programming languages do you already know that could help in cybersecurity? (Example: Python, Java, Bash)
2. What networking knowledge or experience do you have? (Example: TCP/IP, routers, switches, configuring networks)
3. Which operating systems are you comfortable using? (Example: Linux, Windows, macOS)
4. Have you used any cybersecurity tools or software? (Example: Wireshark, Nmap, firewalls, SIEM tools)
5. Do you understand any security concepts or frameworks? (Example: encryption, threat modeling, incident response)

Practical Experience
1. Have you completed any hands-on projects or home labs related to cybersecurity?
2. Have you participated in Capture The Flag (CTF) competitions, hackathons, or challenges?
3. Have you contributed to open-source projects, coding projects, or personal IT projects?
4. Do you have experience analyzing data, logs, or system behavior for insights or security issues?
5. Have you had internships, volunteering, or practical work relevant to cybersecurity?

Soft Skills & Achievements
1. What problem-solving or analytical skills do you feel confident about?
2. What communication or teamwork skills do you have? (Example: explaining technical issues clearly, working in groups)
3. What personal qualities help you succeed under pressure or in challenging tasks? (Example: attention to detail, persistence, adaptability)
4. Have you completed any certifications, courses, or awards that show your skills? (Example: online courses, school achievements, coding certifications)
5. Are there areas or skills you feel you still need to develop to succeed in cybersecurity? (Example: advanced networking, SIEM tools, incident response, professional communication)

After I answer all 15 questions, automatically generate a table with at least 8 rows:
| Your Skills | Skills Required for Cybersecurity | Assessment / Skills to Develop |
Make sure the table compares my current skills to common cybersecurity requirements and highlights areas I need to improve. The student can then pick 3 of the most relevant rows. Do not ask for further clarification — just produce the table. Start by asking me the first question now.`,

  2.4: `I am a student working on NCFE Level 3 Cybersecurity and need to answer 17 preparation questions before creating my personal development plan with 5 SMART goals.

Please ask me these questions ONE AT A TIME and wait for my response before moving to the next question:

SECTION 1: Understanding Where I Am Now
1. What certifications or qualifications am I currently working on or have completed?
2. What technical skills do I currently have? (programming languages, cybersecurity knowledge, tools)
3. What practical experience do I have? (projects, home labs, hands-on practice)
4. What are my strongest skills right now?
5. What skills or knowledge do I feel I'm lacking?

SECTION 2: Understanding My Career Goals
6. What specific cybersecurity role am I aiming for?
7. What skills does this role require that I don't have yet?
8. What motivates me to pursue this career path?

SECTION 3: Understanding My Constraints and Resources
9. How many hours per week can I realistically dedicate to learning and development?
10. What resources do I have access to? (free training, budget, equipment, software)
11. What obstacles might prevent me from achieving my goals?
12. When do I want to achieve my main career goal?

SECTION 4: Identifying My Specific Goals
13. What certification do I want to complete next and by when?
14. What technical skill do I most need to develop for my target role?
15. What practical project or hands-on experience would strengthen my portfolio?
16. What soft skill do I need to improve?
17. What else would help me become more employable in cybersecurity?

After I answer all 17 questions, please automatically generate:
1. Summarise my answers in a clear, organised format
2. Suggest 5 potential SMART goals based on my answers
3. Remind me to use these answers to complete the worksheet unit 6 / 2.4 Create a personal development plan
Do not ask for further clarification after the last question — just produce the answers. Start by asking me the first question now.`,
};

// SECTION INFORMATION
const SECTION_INFO = {
  2.1: {
    title: "Unit 6 | Section 2.1: Identify Skills",
    fullTitle: "Identify skills required for a career in cybersecurity",
    questions: 15,
    icon: "🎯",
  },
  2.2: {
    title: "Unit 6 | Section 2.2: Perform SWOT Analysis",
    fullTitle: "Perform a personal skills analysis",
    questions: 20,
    icon: "📊",
  },
  2.3: {
    title: "Unit 6 | Section 2.3: Skills Assessment",
    fullTitle:
      "Assess own skills against those required for a career in cybersecurity",
    questions: 15,
    icon: "⚖️",
  },
  2.4: {
    title: "Unit 6 | Section 2.4: Create SMART PDP",
    fullTitle: "Create a personal development plan",
    questions: 17,
    icon: "🎓",
  },
};

// AI Platform URLs
const AI_PLATFORMS = {
  chatgpt: {
    name: "ChatGPT",
    url: "https://chat.openai.com/",
  },
  claude: {
    name: "Claude",
    url: "https://claude.ai/new",
  },
  gemini: {
    name: "Google Gemini",
    url: "https://gemini.google.com/",
  },
  deepseek: {
    name: "DeepSeek",
    url: "https://chat.deepseek.com/",
  },
};

// State management
let currentSection = null;
let promptCopied = false; // Track if prompt has been copied

// PDP DOM Elements
const pdpView = document.getElementById("pdpView");
const pdpBackBtn = document.getElementById("pdpBackBtn");
const sectionChooser = document.getElementById("sectionChooser");
const methodChooser = document.getElementById("methodChooser");
const promptDisplay = document.getElementById("promptDisplay");
const backToSections = document.getElementById("backToSections");
const backToSections2 = document.getElementById("backToSections2");
const methodSectionTitle = document.getElementById("methodSectionTitle");
const promptSectionTitle = document.getElementById("promptSectionTitle");
const useAIBtn = document.getElementById("useAIBtn");
const downloadPdfBtn = document.getElementById("downloadPdfBtn");
const copyPromptBtn = document.getElementById("copyPromptBtn");
const aiPromptText = document.getElementById("aiPromptText");
const aiPlatformSection = document.getElementById("aiPlatformSection");
const aiSuccessMessage = document.getElementById("aiSuccessMessage");
const copyWarningModal = document.getElementById("copyWarningModal");
const copyWarningOkBtn = document.getElementById("copyWarningOkBtn");
const copyWarningClose = document.getElementById("copyWarningClose");

// =========================
// PAGE 1: SECTION CHOOSER
// =========================

// PDP Button Click Handler - Show section chooser
document.querySelectorAll(".pdp-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    showSectionChooser();
  });
});

function showSectionChooser() {
  homepage.classList.add("hidden");
  pdpView.classList.remove("hidden");
  sectionChooser.classList.remove("hidden");
  methodChooser.classList.add("hidden");
  promptDisplay.classList.add("hidden");
  window.scrollTo(0, 0);
}

// Section Card Click Handlers - Entire card is clickable
document.querySelectorAll(".section-card").forEach((card) => {
  card.addEventListener("click", () => {
    const section = card.dataset.section;
    currentSection = section;
    showMethodChooser(section);
  });
});

// =========================
// PAGE 2: METHOD CHOOSER
// =========================

function showMethodChooser(section) {
  const sectionData = SECTION_INFO[section];
  methodSectionTitle.textContent = sectionData.title;

  sectionChooser.classList.add("hidden");
  methodChooser.classList.remove("hidden");
  promptDisplay.classList.add("hidden");
  window.scrollTo(0, 0);
}

// Back to Sections Button
backToSections.addEventListener("click", () => {
  methodChooser.classList.add("hidden");
  sectionChooser.classList.remove("hidden");
  window.scrollTo(0, 0);
});

// Back to Sections Button 2 (from prompt display)
backToSections2.addEventListener("click", () => {
  promptDisplay.classList.add("hidden");
  aiSuccessMessage.classList.add("hidden");
  sectionChooser.classList.remove("hidden");
  window.scrollTo(0, 0);
});

// Use AI Assistant Button
useAIBtn.addEventListener("click", () => {
  showPromptDisplay(currentSection);
});

// Make entire AI Assistant card clickable
document.querySelectorAll(".method-card").forEach((card) => {
  card.addEventListener("click", (e) => {
    // Check if click is on the AI Assistant card (has useAIBtn inside)
    if (card.querySelector("#useAIBtn")) {
      showPromptDisplay(currentSection);
    }
    // Check if click is on the Download PDF card (has downloadPdfBtn inside)
    else if (card.querySelector("#downloadPdfBtn")) {
      const link = document.createElement("a");
      link.href = "Unit_6_PDP_Questions.pdf";
      link.download = "Unit_6_PDP_Questions.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  });
});

// Download PDF Button (keep for button click too)
downloadPdfBtn.addEventListener("click", (e) => {
  e.stopPropagation(); // Prevent card click from firing too
  const link = document.createElement("a");
  link.href = "Unit_6_PDP_Questions.pdf";
  link.download = "Unit_6_PDP_Questions.pdf";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});

// =========================
// PAGE 3: PROMPT + AI PLATFORMS (Both visible)
// =========================

function showPromptDisplay(section) {
  const sectionData = SECTION_INFO[section];
  promptSectionTitle.textContent = `${sectionData.title}: AI Prompt`;
  aiPromptText.value = AI_PROMPTS[section];

  methodChooser.classList.add("hidden");
  promptDisplay.classList.remove("hidden");
  aiSuccessMessage.classList.add("hidden");

  // Reset copy state
  promptCopied = false;

  // Reset copy button
  copyPromptBtn.textContent = "📋 Copy prompt";
  copyPromptBtn.style.background = "";

  window.scrollTo(0, 0);
}

// Copy Prompt to Clipboard
if (copyPromptBtn) {
  copyPromptBtn.addEventListener("click", () => {
    console.log("Copy button clicked!");
    aiPromptText.select();
    aiPromptText.setSelectionRange(0, 99999); // For mobile

    try {
      document.execCommand("copy");

      // Mark as copied
      promptCopied = true;
      console.log("Prompt copied successfully, promptCopied =", promptCopied);

      // Visual feedback
      copyPromptBtn.textContent = "✓ Copied!";
      copyPromptBtn.style.background = "#4caf50";

      // Reset button after 2 seconds
      setTimeout(() => {
        copyPromptBtn.textContent = "📋 Copy prompt";
        copyPromptBtn.style.background = "";
      }, 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
      alert("Copy failed. Please try selecting and copying manually.");
    }
  });
} else {
  console.error("❌ copyPromptBtn not found!");
}

// =========================
// PAGE 4: AI PLATFORM SELECTION (Already visible on page 3)
// =========================

// AI Platform Button Handlers - Check if copied first
const aiCards = document.querySelectorAll(".ai-platform-card");
console.log("Found", aiCards.length, "AI cards");

aiCards.forEach((card) => {
  card.addEventListener("click", (e) => {
    console.log("AI card clicked! promptCopied =", promptCopied);

    // Check if prompt has been copied
    if (!promptCopied) {
      console.log("Showing warning modal");
      // Show warning modal
      if (copyWarningModal) {
        copyWarningModal.classList.remove("hidden");
      } else {
        console.error("❌ copyWarningModal not found!");
        alert("Please copy the prompt first!");
      }
      return;
    }

    console.log("Prompt was copied, proceeding...");
    // If copied, proceed
    const platform = card.dataset.platform;
    const platformData = AI_PLATFORMS[platform];

    // Open AI platform in new tab
    window.open(platformData.url, "_blank");

    // Show success message
    showSuccessInstructions(platformData.name);
  });
});

// Close copy warning modal
if (copyWarningOkBtn) {
  copyWarningOkBtn.addEventListener("click", () => {
    copyWarningModal.classList.add("hidden");
  });
} else {
  console.error("❌ copyWarningOkBtn not found!");
}

// Close button (X) handler
if (copyWarningClose) {
  copyWarningClose.addEventListener("click", () => {
    copyWarningModal.classList.add("hidden");
  });
}

// Close modal when clicking outside
if (copyWarningModal) {
  copyWarningModal.addEventListener("click", (e) => {
    if (e.target === copyWarningModal) {
      copyWarningModal.classList.add("hidden");
    }
  });
} else {
  console.error("❌ copyWarningModal not found!");
}

// =========================
// PAGE 5: SUCCESS SCREEN (Simplified - just "Go Back" button)
// =========================

function showSuccessInstructions(aiName) {
  const sectionData = SECTION_INFO[currentSection];

  aiSuccessMessage.innerHTML = `
    <div class="success-content">
      <div class="success-icon">✓</div>
      <h3>✓ Prompt Copied Successfully!</h3>
      <p class="success-subtitle">
        ${aiName} is now open in a new tab
      </p>
      
      <div class="next-steps">
        <h4>📝 What to do next:</h4>
        <ol>
          <li>Paste the prompt into ${aiName} (Ctrl+V or Cmd+V)</li>
          <li>Answer all ${sectionData.questions} questions one by one</li>
          <li>${aiName} will provide personalized insights</li>
          <li>Use the outputs to complete Unit 6 worksheet</li>
        </ol>
      </div>
      
      <button class="success-btn" id="successGoBackBtn">
        ← Go Back
      </button>
    </div>
  `;
  aiSuccessMessage.classList.remove("hidden");

  // Scroll to success message
  setTimeout(() => {
    aiSuccessMessage.scrollIntoView({ behavior: "smooth", block: "center" });
  }, 100);

  // Add event listener to Go Back button - returns to AI selection
  document.getElementById("successGoBackBtn").addEventListener("click", () => {
    aiSuccessMessage.classList.add("hidden");
    window.scrollTo(0, 0);
  });
}

// PDP Main Back Button (top left)
pdpBackBtn.addEventListener("click", () => {
  pdpView.classList.add("hidden");
  homepage.classList.remove("hidden");
  window.scrollTo(0, 0);
});

console.log("✅ Unit 6 PDP System Initialized!");
console.log("📋 4 Section Prompts Loaded:", Object.keys(AI_PROMPTS));
console.log("🔍 DOM Elements Check:");
console.log("  copyPromptBtn:", copyPromptBtn);
console.log("  copyWarningModal:", copyWarningModal);
console.log(
  "  AI cards count:",
  document.querySelectorAll(".ai-platform-card").length,
);

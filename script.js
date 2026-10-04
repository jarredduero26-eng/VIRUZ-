const questions = [
  {
    q: "What do you appreciate most about a person?",
    options: ["Kindness", "Humor", "Honesty", "Their effort"]
  },
  {
    q: "What makes you notice someone?",
    options: ["Their smile", "Their personality", "Their confidence", "How they treat others"]
  },
  {
    q: "What quality do you admire most?",
    options: ["Loyalty", "Patience", "Respect", "Understanding"]
  },
  {
    q: "What makes you comfortable around someone?",
    options: ["Good conversations", "Being listened to", "Shared interests", "Being yourself"]
  },
  {
    q: "What kind of message do you like receiving?",
    options: ["Good morning", "A funny message", "A thoughtful message", "A simple check-in"]
  },
  {
    q: "What would you enjoy doing with someone you like?",
    options: ["Talking for hours", "Going somewhere fun", "Studying together", "Trying something new"]
  },
  {
    q: "What makes someone trustworthy?",
    options: ["Keeping promises", "Being honest", "Respecting privacy", "Being consistent"]
  },
  {
    q: "What is a green flag for you?",
    options: ["Good communication", "Kindness", "Responsibility", "Respect"]
  },
  {
    q: "What kind of personality do you enjoy?",
    options: ["Funny", "Calm", "Adventurous", "Thoughtful"]
  },
  {
    q: "What matters most in a relationship or friendship?",
    options: ["Trust", "Respect", "Communication", "Support"]
  },
  {
    q: "What is your favorite food?",
    options: ["Pizza", "Chicken", "Noodles", "Something else"]
  },
  {
    q: "What is your favorite color?",
    options: ["Black", "Blue", "Red", "Other"]
  },
  {
    q: "What kind of music do you like?",
    options: ["Pop", "R&B", "OPM", "Any kind"]
  },
  {
    q: "What is your favorite way to relax?",
    options: ["Listening to music", "Gaming", "Watching shows", "Sleeping"]
  },
  {
    q: "What is your favorite movie genre?",
    options: ["Horror", "Comedy", "Romance", "Action"]
  },
  {
    q: "What is your favorite time of day?",
    options: ["Morning", "Afternoon", "Evening", "Late night"]
  },
  {
    q: "Where do you like hanging out?",
    options: ["Mall", "Home", "Outdoor place", "Anywhere with friends"]
  },
  {
    q: "What is your favorite snack?",
    options: ["Chips", "Chocolate", "Ice cream", "Other"]
  },
  {
    q: "What is your favorite kind of weather?",
    options: ["Rainy", "Sunny", "Cloudy", "Cool and windy"]
  },
  {
    q: "What always makes you smile?",
    options: ["Friends", "Family", "Pets", "A good joke"]
  }
];

// HTML elements
const startScreen = document.getElementById("startScreen");
const gameScreen = document.getElementById("gameScreen");
const finishScreen = document.getElementById("finishScreen");

const nameInput = document.getElementById("nameInput");
const statusText = document.getElementById("status");
const progressText = document.getElementById("progressText");
const barFill = document.getElementById("barFill");
const questionText = document.getElementById("questionText");
const optionsContainer = document.getElementById("options");
const answerInput = document.getElementById("answerInput");
const warning = document.getElementById("warning");
const finishMessage = document.getElementById("finishMessage");

let currentQuestion = 0;
let participantName = "";
let voiceOn = true;
let answers = [];

function showScreen(screen) {
  startScreen.classList.add("hidden");
  gameScreen.classList.add("hidden");
  finishScreen.classList.add("hidden");

  screen.classList.remove("hidden");
}

function speak(message) {
  if (!voiceOn || !("speechSynthesis" in window)) {
    return;
  }

  speechSynthesis.cancel();

  const speech = new SpeechSynthesisUtterance(message);
  speech.rate = 0.82;
  speech.pitch = 0.62;
  speech.volume = 1;

  speechSynthesis.speak(speech);
}

function startGame() {
  participantName = nameInput.value.trim();

  if (participantName === "") {
    alert("Please enter your name first.");
    nameInput.focus();
    return;
  }

  currentQuestion = 0;
  answers = [];

  showScreen(gameScreen);
  showQuestion();
}

function showQuestion() {
  const question = questions[currentQuestion];

  progressText.textContent =
    `QUESTION ${currentQuestion + 1} / ${questions.length}`;

  barFill.style.width =
    ((currentQuestion + 1) / questions.length * 100) + "%";

  questionText.textContent = question.q;
  answerInput.value = "";
  warning.classList.add("hidden");

  optionsContainer.innerHTML = "";

  question.options.forEach(option => {
    const button = document.createElement("button");

    button.className = "option";
    button.textContent = option;

    button.addEventListener("click", function() {
      saveAnswer(option);
    });

    optionsContainer.appendChild(button);
  });

  statusText.textContent =
    "● CONNECTED TO " + participantName.toUpperCase();

  speak(participantName + ". " + question.q);
}

function submitAnswer() {
  const answer = answerInput.value.trim();

  if (answer === "") {
    alert("Please type an answer or choose one of the buttons.");
    answerInput.focus();
    return;
  }

  saveAnswer(answer);
}

function saveAnswer(answer) {
  answers.push({
    question: questions[currentQuestion].q,
    answer: answer
  });

  currentQuestion++;

  if (currentQuestion >= questions.length) {
    finishGame();
  } else {
    showQuestion();
  }
}

function declineQuestion() {
  warning.classList.remove("hidden");

  warning.innerHTML = `
    !
    <div>SKIP REQUEST DETECTED</div>
    <small>
      Your response has been marked as DECLINED.
      Continue only if you want to answer.
    </small>
  `;

  speak(
    "Skip request detected. Your response has been marked as declined."
  );
}

function finishGame() {
  if ("speechSynthesis" in window) {
    speechSynthesis.cancel();
  }

  showScreen(finishScreen);

  statusText.textContent = "● CONNECTION ENDED";

  finishMessage.textContent =
    "Okay, " + participantName + "... the mystery is over.";

  speak(
    "Gotcha, " + participantName +
    ". This was only a harmless prank. Nothing was recorded or sent."
  );
}

function endPrank() {
  finishGame();
}

function toggleVoice() {
  voiceOn = !voiceOn;

  document.getElementById("voiceButton").textContent =
    voiceOn ? "VOICE: ON" : "VOICE: OFF";

  if (!voiceOn && "speechSynthesis" in window) {
    speechSynthesis.cancel();
  }
}

function playAgain() {
  nameInput.value = "";
  document.getElementById("pronouns").value = "";

  participantName = "";
  currentQuestion = 0;
  answers = [];

  statusText.textContent = "● WAITING FOR PARTICIPANT...";

  showScreen(startScreen);
}

// Button events
document.getElementById("beginButton")
  .addEventListener("click", startGame);

document.getElementById("submitButton")
  .addEventListener("click", submitAnswer);

document.getElementById("declineButton")
  .addEventListener("click", declineQuestion);

document.getElementById("endButton")
  .addEventListener("click", endPrank);

document.getElementById("voiceButton")
  .addEventListener("click", toggleVoice);

document.getElementById("againButton")
  .addEventListener("click", playAgain);

// Enter key submits a typed answer
answerInput.addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    submitAnswer();
  }
});

// Array that stores Correct Answers for validation
const correctAnswers = {
    "question-one": "A",
    "question-two": "A",
    "question-three": "C",
    "question-four": "B",
    "question-five": "A",
    "question-six": "A",
    "question-seven": "A",
    "question-eight": "B",
    "question-nine": "A",
    "question-ten": "A"
};

// Quiz state variables
let currentQuestion = 0;
let timeleft = 300; // 5 minutes in seconds
let timer;
let userAnswers = {}; // stores user answers

// DOM elements
const startQuizBtn = document.querySelector(".start-quiz");
const quizForm = document.querySelector(".quiz-form");
const quizTimer = document.querySelector(".quiz-timer");
const timerDisplay = document.querySelector(".timer");
const resultDisplay = document.querySelector(".result");
const reviewSection = document.querySelector(".review-answers");
const comparisonContainer = document.getElementById("answers-comparison");

// function to start the quiz
function startQuiz() {
    startQuizBtn.style.display = "none";
    quizForm.style.display = "block";
    quizTimer.style.display = "block";
    showQuestion(currentQuestion);
    startTimer();
}

// show a specific question
function showQuestion(index) {
    const questions = document.querySelectorAll(".question");
    questions.forEach((question, i) => {
        question.classList.remove("active");
        if (i === index) {
            question.classList.add("active");
        }
    });
}

// next question with validation
function nextQuestion() {
    const currentQuestionElement = document.querySelector(".question.active");
    const questionName = currentQuestionElement.querySelector('input[type="radio"]').name;
    const selectedOption = currentQuestionElement.querySelector(`input[name="${questionName}"]:checked`);

    if (!selectedOption) {
        alert("Please select an answer!");
        return;
    }

    userAnswers[questionName] = selectedOption.value;
    currentQuestion++;
    showQuestion(currentQuestion);
}

// previous question
function prevQuestion() {
    currentQuestion--;
    if (currentQuestion < 0) currentQuestion = 0;
    showQuestion(currentQuestion);
}

// Timer functionality
function startTimer() {
    updateTimerDisplay();
    timer = setInterval(() => {
        timeleft--;
        updateTimerDisplay();
        if (timeleft <= 0) {
            clearInterval(timer);
            submitQuiz();
        }
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeleft / 60);
    const seconds = timeleft % 60;
    timerDisplay.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

function submitQuiz(event) {
    if (event) event.preventDefault();
    
    // Capture last answer (Question 10)
    const lastQ = document.querySelector(".question.active");
    const lastQName = lastQ.querySelector('input[type="radio"]').name;
    const lastAnswer = lastQ.querySelector(`input[name="${lastQName}"]:checked`);
    if (lastAnswer) userAnswers[lastQName] = lastAnswer.value;

    // Calculate score
    const score = Object.keys(correctAnswers)
        .reduce((acc, q) => acc + (userAnswers[q] === correctAnswers[q] ? 1 : 0), 0);
    
    // Display result
    resultDisplay.textContent = `You scored ${score} out of 10!`;
    
    // Show review section
    reviewSection.style.display = "block";
    
    // Generate answer comparison
    comparisonContainer.innerHTML = "";
    
    Object.keys(correctAnswers).forEach((question, index) => {
        const questionElement = document.querySelector(`input[name="${question}"]`).closest(".question");
        const questionText = questionElement.querySelector("h3").textContent;
        const userAnswer = userAnswers[question] || "Not answered";
        const isCorrect = userAnswer === correctAnswers[question];
        
        const questionDiv = document.createElement("div");
        questionDiv.className = `review-item ${isCorrect ? "correct" : "incorrect"}`;
        questionDiv.innerHTML = `
            <p><strong>Question ${index + 1}:</strong> ${questionText}</p>
            <p>✅ <strong>Correct Answer:</strong> ${correctAnswers[question]}</p>
            <p>${isCorrect ? "✔️" : "❌"} <strong>Your Answer:</strong> ${userAnswer}</p>
        `;
        comparisonContainer.appendChild(questionDiv);
    });

    // Debug logging
    console.log("User Answers:", userAnswers);
    console.log("Correct Answers:", correctAnswers);
    console.log("Final Score:", score);
}

// Event listeners
quizForm.addEventListener("submit", submitQuiz);
document.querySelector(".startQuizBtn").addEventListener("click", startQuiz);

// Navigation button event delegation
document.addEventListener("click", function(e) {
    if (e.target.classList.contains("next")) {
        nextQuestion();
    } else if (e.target.classList.contains("previous")) {
        prevQuestion();
    }
});
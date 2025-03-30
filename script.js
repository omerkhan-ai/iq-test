document.addEventListener("DOMContentLoaded", () => {
    const startScreen = document.getElementById("start-screen");
    const quizContainer = document.getElementById("quiz-container");
    const resultsScreen = document.getElementById("results-screen");
    const questionText = document.getElementById("question-text");
    const optionsContainer = document.getElementById("options-container");
    const nextBtn = document.getElementById("next-btn");
    const restartBtn = document.getElementById("restart-btn");
    const finalScore = document.getElementById("final-score");
    const timerDisplay = document.getElementById("time");
    const progressText = document.getElementById("progress-text");

    let questions = [];
    let currentQuestionIndex = 0;
    let score = 0;
    let timer;

    // ✅ Fetch & Shuffle Questions
    fetch("questions.json")
        .then(response => response.json())
        .then(data => {
            if (!Array.isArray(data) || data.length === 0) {
                throw new Error("Questions file is empty or not an array!");
            }
            questions = shuffleArray(data).slice(0, 10); // Shuffle and select 10 questions
        })
        .catch(error => {
            console.error("❌ Failed to load questions:", error);
            alert("Error loading questions. Please refresh the page.");
        });

    // ✅ Start Quiz
    document.getElementById("start-btn").addEventListener("click", () => {
        if (questions.length === 0) {
            alert("Questions are not loaded. Please refresh the page.");
            return;
        }
        startScreen.classList.add("hidden");
        quizContainer.classList.remove("hidden");
        currentQuestionIndex = 0;
        score = 0;
        loadQuestion();
    });

    // ✅ Load a Question
    function loadQuestion() {
        if (!questions[currentQuestionIndex]) {
            alert("Something went wrong! Please refresh.");
            return;
        }

        clearInterval(timer);
        startTimer(30);

        let question = questions[currentQuestionIndex];
        questionText.textContent = question.question;
        optionsContainer.innerHTML = "";

        // ✅ Shuffle answer options before displaying
        let shuffledOptions = shuffleArray([...question.options]);

        shuffledOptions.forEach(option => {
            let btn = document.createElement("button");
            btn.classList.add("option");
            btn.textContent = option;
            btn.setAttribute("data-answer", option);
            btn.addEventListener("click", () => selectAnswer(option, question.correctAnswer));
            optionsContainer.appendChild(btn);
        });

        progressText.textContent = `Question ${currentQuestionIndex + 1} / 10`;
        nextBtn.classList.add("hidden");
    }

    // ✅ Handle Answer Selection
    function selectAnswer(selected, correct) {
        clearInterval(timer);
        document.querySelectorAll(".option").forEach(button => {
            button.disabled = true;
            if (button.textContent === correct) {
                button.classList.add("correct");
            } else if (button.textContent === selected) {
                button.classList.add("incorrect");
            }
        });

        if (selected === correct) score++;
        nextBtn.classList.remove("hidden");
    }

    // ✅ Move to Next Question
    nextBtn.addEventListener("click", () => {
        if (currentQuestionIndex < 9) {
            currentQuestionIndex++;
            loadQuestion();
        } else {
            showResults();
        }
    });

    // ✅ Show Results
    function showResults() {
        quizContainer.classList.add("hidden");
        resultsScreen.classList.remove("hidden");
        finalScore.textContent = `You scored ${score} out of 10!`;
    }

    // ✅ Restart Quiz
    restartBtn.addEventListener("click", () => {
        resultsScreen.classList.add("hidden");
        startScreen.classList.remove("hidden");
        currentQuestionIndex = 0;
        score = 0;
    });

    // ✅ Timer Function
    function startTimer(seconds) {
        let timeLeft = seconds;
        timerDisplay.textContent = timeLeft;
        timer = setInterval(() => {
            timeLeft--;
            timerDisplay.textContent = timeLeft;
            if (timeLeft <= 0) {
                clearInterval(timer);
                selectAnswer(null, questions[currentQuestionIndex].correctAnswer);
            }
        }, 1000);
    }

    // ✅ Fisher-Yates Shuffle Algorithm
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
});

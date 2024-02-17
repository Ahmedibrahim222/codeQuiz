// Add variables that keep track of the quiz "state"
let currentQuestionIndex = 0;
let time = questions.length * 15;
let timerId;

// Add variables to reference DOM elements
let questionsEl = document.getElementById('questions');
let feedbackEl = document.getElementById('feedback');
let timerEl = document.getElementById('timer');
let startBtn = document.getElementById('start-btn');
let submitBtn = document.getElementById('submit-btn');
let initialsEl = document.getElementById('initials');
let choicesEl = document.getElementById('choices');

// Reference the sound effects
let sfxRight = new Audio('sfx/correct.wav');
let sfxWrong = new Audio('sfx/incorrect.wav');

function startQuiz() {
  // Hide start screen
  document.getElementById('start-screen').style.display = 'none';

  // Un-hide questions section
  questionsEl.style.display = 'block';

  // Start timer
  timerId = setInterval(clockTick, 1000);

  // Show starting time
  timerEl.textContent = time;

  // Call a function to show the next question
  getQuestion();
}

function getQuestion() {
  // Get current question object from array
  let currentQuestion = questions[currentQuestionIndex];

  // Update title with current question
  document.getElementById('question-title').textContent = currentQuestion.title;

  // Clear out any old question choices
  choicesEl.innerHTML = '';

  // Loop over the choices for each question
  for (let i = 0; i < currentQuestion.choices.length; i++) {
    // Create a new button for each choice, setting the label and value for the button
    let choiceBtn = document.createElement('button');
    choiceBtn.textContent = currentQuestion.choices[i];
    choiceBtn.setAttribute('value', currentQuestion.choices[i]);

    // Display the choice button on the page
    choicesEl.appendChild(choiceBtn);
  }
}

function questionClick(event) {
  if (event.target.matches('button')) {
    // Identify the targeted button that was clicked on
    let selectedChoice = event.target.value;

    // Check if user guessed wrong
    if (selectedChoice !== questions[currentQuestionIndex].answer) {
      // If they got the answer wrong, penalize time by subtracting 15 seconds from the timer
      time -= 15;

      // If they run out of time, set time to zero so we can end quiz
      if (time < 0) {
        time = 0;
      }

      // Display new time on page
      timerEl.textContent = time;

      // Play "wrong" sound effect
      sfxWrong.play();

      // Display "wrong" feedback on page
      feedbackEl.textContent = 'Wrong!';
    } else {
      // Play "right" sound effect
      sfxRight.play();

      // Display "right" feedback on page
      feedbackEl.textContent = 'Correct!';
    }

    // Flash right/wrong feedback on page for half a second
    feedbackEl.setAttribute('class', 'feedback');

    // After one second, remove the "feedback" class from the feedback element
    setTimeout(() => {
      feedbackEl.removeAttribute('class', 'feedback');
    }, 500);

    // Move to next question
    currentQuestionIndex++;

    // Check if we've run out of questions
    if (currentQuestionIndex === questions.length || time <= 0) {
      quizEnd();
    } else {
      getQuestion();
    }
  }
}

function clockTick() {
  // Update time
  time--;

  // Update the element to display the new time value
  timerEl.textContent = time;

  // Check if user ran out of time; if so, call the quizEnd() function
  if (time <= 0) {
    quizEnd();
  }
}

function quizEnd() {
  // Stop the timer
  clearInterval(timerId);

  // Hide questions section
  questionsEl.style.display = 'none';

  // Show end screen
  document.getElementById('end-screen').style.display = 'block';

  // Show final score
  document.getElementById('final-score').textContent = time;
}

function saveHighScore() {
  // Get the value of the initials input box
  let initials = initialsEl.value.trim();

  // Make sure the value of the initials input box wasn't empty
  if (initials !== '') {
    // Retrieve high scores from local storage
    let highScores = JSON.parse(localStorage.getItem('highscores')) || [];

    // Add the new initials and high score to the array
    highScores.push({ initials: initials, score: time });


    // Store the high scores in local storage (using consistent key name)
    localStorage.setItem('highscores', JSON.stringify(highScores));

    // Redirect the user to the high scores page
    window.location.href = 'Main/highscores.html';
  }
}

function checkForEnter(event) {
  // If the user presses the enter key, then call the saveHighScore function
  if (event.key === 'Enter') {
    saveHighScore();
  }
}

// User clicks button to submit initials
submitBtn.onclick = saveHighScore;

// User clicks button to start quiz
startBtn.onclick = startQuiz;

// User clicks on an element containing choices
choicesEl.onclick = questionClick;

// Listen for keyup event on initials input box
initialsEl.onkeyup = checkForEnter;

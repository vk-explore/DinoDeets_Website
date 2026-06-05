import quizData from './data/dino-quiz.json';

export function initDinoQuizPage() {
  // Elements
  const screenStart = document.getElementById('quiz-start');
  if (!screenStart) return;
  const screenActive = document.getElementById('quiz-active');
  const screenResults = document.getElementById('quiz-results');

  const btnStart = document.getElementById('btn-start-quiz');
  const btnRestart = document.getElementById('btn-restart-quiz');
  
  const elQuestionText = document.getElementById('quiz-question');
  const elOptionsContainer = document.getElementById('quiz-options');
  const elCurrentNum = document.getElementById('quiz-current-num');
  const elScore = document.getElementById('quiz-score');
  const elProgressFill = document.getElementById('quiz-progress-fill');
  
  const elFinalScore = document.getElementById('quiz-final-score-val');
  const elFeedback = document.getElementById('quiz-feedback');
  const elResultsEmoji = document.getElementById('quiz-results-emoji');
  
  const elChart = document.getElementById('quiz-history-chart');

  // State
  const TOTAL_QUESTIONS = 10;
  let currentQuestions = [];
  let currentIndex = 0;
  let score = 0;
  let isAnswering = false;

  // Initialize
  init();

  function init() {
    btnStart.addEventListener('click', startQuiz);
    btnRestart.addEventListener('click', startQuiz);
    renderChart();
  }

  function startQuiz() {
    // Reset state
    score = 0;
    currentIndex = 0;
    isAnswering = false;
    elScore.textContent = score;

    // Pick 10 random questions
    currentQuestions = getRandomQuestions(TOTAL_QUESTIONS);

    // Switch screens
    screenStart.style.display = 'none';
    screenResults.style.display = 'none';
    screenActive.style.display = 'block';

    loadQuestion();
  }

  function getRandomQuestions(num) {
    let recentIndexes = JSON.parse(localStorage.getItem('dino_quiz_recent_questions') || '[]');
    
    // Filter available indexes
    let availableIndexes = [];
    for (let i = 0; i < quizData.length; i++) {
      if (!recentIndexes.includes(i)) {
        availableIndexes.push(i);
      }
    }
    
    // Fallback: If not enough available questions, clear history
    if (availableIndexes.length < num) {
      recentIndexes = [];
      availableIndexes = quizData.map((_, i) => i);
    }
    
    // Shuffle and pick
    availableIndexes.sort(() => 0.5 - Math.random());
    const selectedIndexes = availableIndexes.slice(0, num);
    
    // Update recent history (store up to 30 items for 3 quizzes of 10)
    recentIndexes = [...recentIndexes, ...selectedIndexes];
    if (recentIndexes.length > 30) {
      recentIndexes = recentIndexes.slice(recentIndexes.length - 30);
    }
    localStorage.setItem('dino_quiz_recent_questions', JSON.stringify(recentIndexes));
    
    return selectedIndexes.map(i => quizData[i]);
  }

  function loadQuestion() {
    isAnswering = false;
    const q = currentQuestions[currentIndex];
    
    elCurrentNum.textContent = currentIndex + 1;
    elProgressFill.style.width = `${((currentIndex) / TOTAL_QUESTIONS) * 100}%`;
    
    elQuestionText.textContent = q.question;
    elOptionsContainer.innerHTML = '';

    // Map options to keep track of their original index, then shuffle
    let optionsWithIndex = q.options.map((opt, idx) => ({ text: opt, originalIndex: idx }));
    optionsWithIndex.sort(() => 0.5 - Math.random());

    optionsWithIndex.forEach((optObj) => {
      const btn = document.createElement('button');
      btn.className = 'quiz__btn-option';
      btn.textContent = optObj.text;
      
      const isCorrect = optObj.originalIndex === q.answerIndex;
      if (isCorrect) {
        btn.dataset.correct = "true";
      }

      btn.addEventListener('click', () => handleAnswer(btn, isCorrect));
      elOptionsContainer.appendChild(btn);
    });
  }

  function handleAnswer(btn, isCorrect) {
    if (isAnswering) return;
    isAnswering = true;

    const allBtns = elOptionsContainer.querySelectorAll('.quiz__btn-option');

    if (isCorrect) {
      score++;
      elScore.textContent = score;
      btn.classList.add('quiz__btn-option--correct');
    } else {
      btn.classList.add('quiz__btn-option--wrong');
      const correctBtn = Array.from(allBtns).find(b => b.dataset.correct === "true");
      if (correctBtn) {
        correctBtn.classList.add('quiz__btn-option--correct');
      }
    }

    // Disable all buttons
    allBtns.forEach(b => b.disabled = true);

    elProgressFill.style.width = `${((currentIndex + 1) / TOTAL_QUESTIONS) * 100}%`;

    // Wait and move to next
    setTimeout(() => {
      currentIndex++;
      if (currentIndex >= TOTAL_QUESTIONS) {
        showResults();
      } else {
        loadQuestion();
      }
    }, 1500);
  }

  function showResults() {
    screenActive.style.display = 'none';
    screenResults.style.display = 'block';

    elFinalScore.textContent = score;
    
    if (score === 10) {
      elResultsEmoji.textContent = '👑';
      elFeedback.textContent = 'Perfect score! You are a true Dinosaur Genius!';
    } else if (score >= 7) {
      elResultsEmoji.textContent = '🌟';
      elFeedback.textContent = 'Great job! You know your prehistoric facts!';
    } else if (score >= 4) {
      elResultsEmoji.textContent = '👍';
      elFeedback.textContent = 'Not bad! Keep digging for more dino deets!';
    } else {
      elResultsEmoji.textContent = '🦕';
      elFeedback.textContent = 'It\'s okay, even a T-Rex had to start somewhere!';
    }

    saveScore(score);
    renderChart();
  }

  function saveScore(newScore) {
    let scores = JSON.parse(localStorage.getItem('dino_quiz_scores') || '[]');
    scores.push(newScore);
    if (scores.length > 10) {
      scores.shift();
    }
    localStorage.setItem('dino_quiz_scores', JSON.stringify(scores));
  }

  function renderChart() {
    let scores = JSON.parse(localStorage.getItem('dino_quiz_scores') || '[]');
    if (scores.length === 0) {
      elChart.innerHTML = '<p class="history__empty">Play a game to see your history!</p>';
      return;
    }

    elChart.innerHTML = '';
    
    scores.forEach((s, i) => {
      const barWrap = document.createElement('div');
      barWrap.className = 'history__bar-wrap';
      
      const bar = document.createElement('div');
      bar.className = 'history__bar';
      
      const fill = document.createElement('div');
      fill.className = 'history__bar-fill';
      // height based on score 0-10
      const pct = (s / 10) * 100;
      fill.style.height = `${pct}%`;

      // Color coding
      if (s === 10) fill.classList.add('history__bar-fill--perfect');
      else if (s >= 7) fill.classList.add('history__bar-fill--good');
      else fill.classList.add('history__bar-fill--low');

      const label = document.createElement('span');
      label.className = 'history__bar-label';
      label.textContent = s;

      bar.appendChild(fill);
      barWrap.appendChild(bar);
      barWrap.appendChild(label);
      elChart.appendChild(barWrap);
    });
  }
}

let totalProblems = 50; // 50 problems in total (10 x 5 grid)
let problems = [];
let timerId; // Timer interval ID
let startTime; // Start time for the timer

// Function to generate random math problems
function generateProblems() {
    const container = document.getElementById('problem-container');
    container.innerHTML = ''; // Clear previous problems
    problems = []; // Reset problems array

    for (let i = 1; i <= totalProblems; i++) {
        let problem = createRandomProblem();
        problems.push(problem.correctAnswer); // Store correct answer

        let problemDiv = document.createElement('div');
        problemDiv.className = 'problem';

        let expression = document.createElement('span');
        expression.textContent = `${problem.expression} =`;

        let input = document.createElement('input');
        input.type = 'number';
        input.className = 'answer-input';
        input.id = `answer-${i}`;

        problemDiv.appendChild(expression);
        problemDiv.appendChild(input);

        container.appendChild(problemDiv);
    }
}

// Function to create random addition/subtraction problems
function createRandomProblem() {
    let operators = ['+', '-'];
    let nums = [];

    for (let i = 0; i < 4; i++) { // Limit to 4 numbers in an expression
        nums.push(Math.floor(Math.random() * 99) + 1); // Random number between 1 and 99
    }

    let expression = `${nums[0]}`;
    let correctAnswer = nums[0];

    for (let i = 1; i < nums.length; i++) {
        let operator = operators[Math.floor(Math.random() * 2)];
        expression += ` ${operator} ${nums[i]}`;
        correctAnswer = operator === '+' ? correctAnswer + nums[i] : correctAnswer - nums[i];
    }

    return { expression, correctAnswer };
}

// Function to check the user's answers
function checkAnswers() {
    clearInterval(timerId); // Stop the timer when user submits answers

    let correctCount = 0;
    let answers = [];

    for (let i = 1; i <= totalProblems; i++) {
        const answerInput = document.getElementById(`answer-${i}`);
        const userAnswer = parseInt(answerInput.value);

        if (userAnswer === problems[i - 1]) {
            correctCount++;
        }

        answers.push({ problem: problems[i - 1], userAnswer: userAnswer });
    }

    document.getElementById('result').innerHTML = `
        <p>You answered ${correctCount} out of ${totalProblems} problems correctly.</p>
    `;

    // Store results in SQLite
    storeResultsInSQLite(answers);

    setTimeout(() => {
        document.getElementById('result').innerHTML = ''; // Clear result after showing
    }, 3000); // Show results for 3 seconds
}

// Timer functions
function startTimer() {
    const timerDisplay = document.getElementById('timer');
    startTime = Date.now();

    timerId = setInterval(() => {
        let elapsedTime = Math.floor((Date.now() - startTime) / 1000);
        timerDisplay.textContent = `Time: ${elapsedTime}s`;
    }, 1000); // Update every second
}

function resetTimer() {
    clearInterval(timerId);
    document.getElementById('timer').textContent = `Time: 0s`;
}

// Function to start the challenge
function startChallenge() {
    document.getElementById('start-button').style.display = 'none';
    document.getElementById('problem-container').style.display = 'block';
    document.getElementById('submit-button').style.display = 'block';

    generateProblems();
    startTimer();
}

// Function to store results in SQLite
function storeResultsInSQLite(answers) {
    const db = new SQL.Database();
    db.run("CREATE TABLE IF NOT EXISTS results (problem TEXT, userAnswer INTEGER, timeTaken INTEGER)");

    answers.forEach(answer => {
        db.run("INSERT INTO results (problem, userAnswer, timeTaken) VALUES (?, ?, ?)", [answer.problem, answer.userAnswer, Math.floor((Date.now() - startTime) / 1000)]);
    });

    const data = db.export();
    const buffer = new Uint8Array(data);
    const blob = new Blob([buffer], { type: 'application/octet-stream' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'results.sqlite';
    link.click();
}

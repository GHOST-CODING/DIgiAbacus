let totalProblems = 50;
let problems = [];
let timerId;
let startTime;

function generateProblems() {
    const container = document.getElementById('problem-container');
    container.innerHTML = '';
    problems = [];

    for (let i = 1; i <= totalProblems; i++) {
        let problem = createRandomProblem();
        problems.push(problem.correctAnswer);

        let problemDiv = document.createElement('div');
        problemDiv.className = 'problem';

        let expressionDiv = document.createElement('div');
        expressionDiv.className = 'expression';
        expressionDiv.innerHTML = problem.expression.replace(/\+/g, '<br>+').replace(/-/g, '<br>-');
        
        let lineDiv = document.createElement('div');

        let input = document.createElement('input');
        input.type = 'number';
        input.className = 'answer-input';
        input.id = `answer-${i}`;

        problemDiv.appendChild(expressionDiv);
        problemDiv.appendChild(lineDiv);
        problemDiv.appendChild(input);

        container.appendChild(problemDiv);
    }
}

function createRandomProblem() {
    let operators = ['+', '-'];
    let nums = [];

    for (let i = 0; i < 4; i++) { 
        nums.push(Math.floor(Math.random() * 99) + 1); 
    }

    let expression = `${nums[0]}`;
    let correctAnswer = nums[0];

    for (let i = 1; i < nums.length; i++) {
        let operator = operators[Math.floor(Math.random() * 2)];

        if (operator === '-' && correctAnswer < nums[i]) {
            operator = '+'; // Prevent negative answers
        }

        expression += ` ${operator} ${nums[i]}`;
        correctAnswer = operator === '+' ? correctAnswer + nums[i] : correctAnswer - nums[i];
    }

    return { expression, correctAnswer };
}

function checkAnswers() {
    clearInterval(timerId);

    let correctCount = 0;
    let wrongAnswers = [];

    for (let i = 1; i <= totalProblems; i++) {
        const answerInput = document.getElementById(`answer-${i}`);
        const userAnswer = parseInt(answerInput.value);

        if (userAnswer === problems[i - 1]) {
            correctCount++;
        } else {
            wrongAnswers.push({
                question: document.getElementById(`answer-${i}`).previousSibling.previousSibling.innerHTML.replace(/<br>/g, ''),
                correctAnswer: problems[i - 1]
            });
        }
    }

    document.getElementById('result').innerHTML = `You answered ${correctCount} out of ${totalProblems} problems correctly.`;
    displayWrongAnswers(wrongAnswers);
    document.getElementById('restart-button').style.display = 'block';
}

function displayWrongAnswers(wrongAnswers) {
    const wrongAnswersContainer = document.querySelector('.wrong-answers-container');
    wrongAnswersContainer.innerHTML = '';
    document.getElementById('wrong-answers').style.display = 'block';

    wrongAnswers.forEach(item => {
        let answerDiv = document.createElement('div');
        answerDiv.className = 'wrong-answer';
        answerDiv.innerHTML = `${item.question} = ${item.correctAnswer}`;
        wrongAnswersContainer.appendChild(answerDiv);
    });
}

function startTimer() {
    const timerDisplay = document.getElementById('timer');
    startTime = Date.now();

    timerId = setInterval(() => {
        let elapsedTime = Math.floor((Date.now() - startTime) / 1000);
        timerDisplay.textContent = `Time: ${elapsedTime}s`;
    }, 1000);
}

function resetTimer() {
    clearInterval(timerId);
    document.getElementById('timer').textContent = `Time: 0s`;
}

function startChallenge() {
    document.getElementById('start-button').style.display = 'none';
    document.getElementById('problem-container').style.display = 'grid';
    document.getElementById('submit-button').style.display = 'block';

    generateProblems();
    startTimer();
}

function restartChallenge() {
    window.location.reload();
}

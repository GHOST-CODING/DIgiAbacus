let num1, num2, operator;
let totalProblems = 0;
let correctAnswers = 0;
let results = [];

function generateProblem() {
    if (totalProblems >= 10) {
        showReport();
        return;
    }

    num1 = Math.floor(Math.random() * 50) + 1;
    num2 = Math.floor(Math.random() * 50) + 1;
    operator = Math.random() < 0.5 ? '+' : '-';

    if (operator === '-') {
        // Ensure no negative result by always subtracting the smaller from the larger
        if (num1 < num2) {
            [num1, num2] = [num2, num1];  // Swap num1 and num2
        }
    }

    document.getElementById('num1').textContent = num1;
    document.getElementById('operator').textContent = operator;
    document.getElementById('num2').textContent = num2;
    document.getElementById('answer').value = '';
    document.getElementById('result').textContent = '';
}

function appendNumber(number) {
    document.getElementById('answer').value += number;
}

function clearAnswer() {
    document.getElementById('answer').value = '';
}

function checkAnswer() {
    const answer = parseInt(document.getElementById('answer').value);
    let correctAnswer;

    if (operator === '+') {
        correctAnswer = num1 + num2;
    } else {
        correctAnswer = num1 - num2;
    }

    if (answer === correctAnswer) {
        document.getElementById('result').textContent = 'Correct!';
        document.getElementById('result').style.color = 'green';
        correctAnswers++;
        results.push('Correct');
    } else {
        document.getElementById('result').textContent = `Wrong! The correct answer was ${correctAnswer}.`;
        document.getElementById('result').style.color = 'red';
        results.push('Wrong');
    }

    totalProblems++;

    // Automatically move to the next problem after a short delay
    setTimeout(() => {
        generateProblem();
    }, 1000);
}

function showReport() {
    const reportDiv = document.getElementById('result');
    reportDiv.innerHTML = `<h2>Report</h2>
    <p>You answered ${correctAnswers} out of 10 problems correctly.</p>
    <ul>${results.map((result, index) => `<li>Problem ${index + 1}: ${result}</li>`).join('')}</ul>
    <button onclick="restart()">Restart</button>`;
}

function restart() {
    totalProblems = 0;
    correctAnswers = 0;
    results = [];
    generateProblem();
}

// Generate the first problem on page load
generateProblem();


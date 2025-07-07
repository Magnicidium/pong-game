
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const resultMsg = document.getElementById("resultMessage");

const isMobile = window.innerWidth < 500;
canvas.width = isMobile ? 320 : 850;
canvas.height = isMobile ? 270 : 650;

let paddleWidth = isMobile ? 4 : 6;
const paddleHeight = canvas.height / 3.5; // slightly smaller
const ballRadius = isMobile ? 4 : 6;

let leftPaddleY = canvas.height / 2 - paddleHeight / 2;
let rightPaddleY = canvas.height / 2 - paddleHeight / 2;
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;

let ballSpeed = isMobile ? 3 : 5;
let ballAngle = Math.random() * Math.PI / 4 - Math.PI / 8;
let ballVX = Math.cos(ballAngle) * ballSpeed * (Math.random() > 0.5 ? 1 : -1);
let ballVY = Math.sin(ballAngle) * ballSpeed;

let leftScore = 0;
let rightScore = 0;
let gameOver = false;
let gameStarted = false;

canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    rightPaddleY = e.clientY - rect.top - paddleHeight / 2;
});

canvas.addEventListener("touchmove", (e) => {
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    rightPaddleY = touch.clientY - rect.top - paddleHeight / 2;
}, { passive: false });

startBtn.addEventListener("click", () => {
    startBtn.style.display = "none";
    canvas.style.display = "block";
    gameStarted = true;
    loop();
});

restartBtn.addEventListener("click", () => {
    leftScore = 0;
    rightScore = 0;
    gameOver = false;
    resultMsg.innerText = "";
    restartBtn.style.display = "none";
    resetBall();
});

function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#fff";

    ctx.fillRect(20, leftPaddleY, paddleWidth, paddleHeight);
    ctx.fillRect(canvas.width - paddleWidth - 20, rightPaddleY, paddleWidth, paddleHeight);

    if (!gameOver) {
        ctx.beginPath();
        ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
        ctx.fill();
    }

    ctx.font = "18px Arial";
    ctx.fillText(leftScore, canvas.width / 4, 30);
    ctx.fillText(rightScore, (canvas.width / 4) * 3, 30);

    if (gameOver) {
        ctx.font = "28px Arial";
        ctx.textAlign = "center";
        resultMsg.innerText = rightScore === 7 ? "You Win!" : "You Lose";
    }
}

function update() {
    if (!gameStarted || gameOver) return;

    ballX += ballVX;
    ballY += ballVY;

    if (ballY - ballRadius <= 0 || ballY + ballRadius >= canvas.height) {
        ballVY *= -1;
    }

    if (
        ballX + ballRadius >= canvas.width - paddleWidth - 20 &&
        ballY > rightPaddleY &&
        ballY < rightPaddleY + paddleHeight
    ) {
        const impactPoint = (ballY - rightPaddleY) / paddleHeight - 0.5;
        const angle = impactPoint * Math.PI / 3;
        ballSpeed = Math.min(ballSpeed + 0.5, 10);
        ballVX = -Math.cos(angle) * ballSpeed;
        ballVY = Math.sin(angle) * ballSpeed;
        ballX = canvas.width - paddleWidth - ballRadius - 20;
    }

    if (
        ballX - ballRadius <= paddleWidth + 20 &&
        ballY > leftPaddleY &&
        ballY < leftPaddleY + paddleHeight
    ) {
        const impactPoint = (ballY - leftPaddleY) / paddleHeight - 0.5;
        const angle = impactPoint * Math.PI / 3;
        ballSpeed = Math.min(ballSpeed + 0.5, 10);
        ballVX = Math.cos(angle) * ballSpeed;
        ballVY = Math.sin(angle) * ballSpeed;
        ballX = paddleWidth + ballRadius + 20;
    }

    if (ballX < 0) {
        rightScore++;
        resetBall();
    } else if (ballX > canvas.width) {
        leftScore++;
        resetBall();
    }

    const ballCenter = ballY;
    const paddleCenter = leftPaddleY + paddleHeight / 2;
    if (paddleCenter < ballCenter - 1) {
        leftPaddleY = clamp(leftPaddleY + 2, 0, canvas.height - paddleHeight);
    } else if (paddleCenter > ballCenter + 1) {
        leftPaddleY = clamp(leftPaddleY - 2, 0, canvas.height - paddleHeight);
    }

    if ((leftScore === 7 || rightScore === 7) && !gameOver) {
        gameOver = true;
        restartBtn.style.display = "block";
    }
}

function resetBall() {
    if (gameOver) return;
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeed = isMobile ? 3 : 5;
    const angle = Math.random() * Math.PI / 4 - Math.PI / 8;
    const direction = Math.random() > 0.5 ? 1 : -1;
    ballVX = Math.cos(angle) * ballSpeed * direction;
    ballVY = Math.sin(angle) * ballSpeed;
}

function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}

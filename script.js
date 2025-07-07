

function isMobile() {
    return window.innerWidth < 600;
}

const canvas = document.getElementById("gameCanvas");
function resizeCanvas() {
    if (window.innerWidth < 600) {
        canvas.width = 320;
        canvas.height = 360;
    } else {
        canvas.width = 950;
        canvas.height = 500;
    }
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const ctx = canvas.getContext("2d");
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");

const paddleWidth = 12;
const paddleHeight = 120;
const ballRadius = 11.25;

let leftPaddleY = canvas.height / 2 - paddleHeight / 2;
let rightPaddleY = canvas.height / 2 - paddleHeight / 2;
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;


let ballSpeed;
function getInitialBallSpeed() {
    return window.innerWidth < 600 ? 3 : 5;
}
ballSpeed = getInitialBallSpeed();
// ballSpeed is now dynamic based on screen size
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
    resetBall();
    restartBtn.style.display = "none";
});

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#fff";
    ctx.fillRect(0, leftPaddleY, paddleWidth, paddleHeight);
    ctx.fillRect(canvas.width - paddleWidth, rightPaddleY, paddleWidth, paddleHeight);

    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = "32px Arial";
    ctx.fillText(leftScore, canvas.width / 4, 40);
    ctx.fillText(rightScore, (canvas.width / 4) * 3, 40);

    if (gameOver) {
        ctx.font = "48px Arial";
        ctx.textAlign = "center";
        const message = rightScore === 7 ? "You Win" : "You Lose";
        ctx.fillText(message, canvas.width / 2, canvas.height / 2);
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
        ballX + ballRadius >= canvas.width - paddleWidth &&
        ballY > rightPaddleY &&
        ballY < rightPaddleY + paddleHeight
    ) {
        const impactPoint = (ballY - rightPaddleY) / paddleHeight - 0.5;
        const angle = impactPoint * Math.PI / 3;
        ballSpeed = Math.min(ballSpeed + 0.2, 10);
        ballVX = -Math.cos(angle) * ballSpeed;
        ballVY = Math.sin(angle) * ballSpeed;
        ballX = canvas.width - paddleWidth - ballRadius;
    }

    if (
        ballX - ballRadius <= paddleWidth &&
        ballY > leftPaddleY &&
        ballY < leftPaddleY + paddleHeight
    ) {
        const impactPoint = (ballY - leftPaddleY) / paddleHeight - 0.5;
        const angle = impactPoint * Math.PI / 3;
        ballSpeed = Math.min(ballSpeed + 0.2, 10);
        ballVX = Math.cos(angle) * ballSpeed;
        ballVY = Math.sin(angle) * ballSpeed;
        ballX = paddleWidth + ballRadius;
    }

    if (ballX < 0) {
        rightScore++;
        resetBall();
    } else if (ballX > canvas.width) {
        leftScore++;
        resetBall();
    }

    if (leftScore === 7 || rightScore === 7) {
        gameOver = true;
        restartBtn.style.display = "block";
    }

    const ballCenter = ballY;
    const paddleCenter = leftPaddleY + paddleHeight / 2;
    if (paddleCenter < ballCenter - 5) {
        leftPaddleY = clamp(leftPaddleY + 2, 0, canvas.height - paddleHeight);
    } else if (paddleCenter > ballCenter + 5) {
        leftPaddleY = clamp(leftPaddleY - 2, 0, canvas.height - paddleHeight);
    }
}

function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeed = getInitialBallSpeed();
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

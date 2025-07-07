const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startBtn = document.getElementById("startBtn");

const paddleWidth = 22;
const paddleHeight = 120;
const ballRadius = 15;

let leftPaddleY = 0;
let rightPaddleY = 0;
let ballX = 0;
let ballY = 0;

let ballSpeed = 5;
let ballAngle = Math.random() * Math.PI / 4 - Math.PI / 8;
let ballVX = Math.cos(ballAngle) * ballSpeed * (Math.random() > 0.5 ? 1 : -1);
let ballVY = Math.sin(ballAngle) * ballSpeed;

let leftScore = 0;
let rightScore = 0;
let gameOver = false;
let gameStarted = false;
let restartButtonArea = null;

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

canvas.addEventListener("click", (e) => {
    if (!gameOver || !restartButtonArea) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const { x, y, width, height } = restartButtonArea;

    if (
        clickX >= x &&
        clickX <= x + width &&
        clickY >= y &&
        clickY <= y + height
    ) {
        leftScore = 0;
        rightScore = 0;
        gameOver = false;
        restartButtonArea = null;
        resetBall();
    }
});

window.addEventListener("DOMContentLoaded", () => {
  setCanvasSize();
  startBtn.addEventListener("click", () => {
    setCanvasSize();
    resetBall();
    leftPaddleY = canvas.height / 2 - paddleHeight / 2;
    rightPaddleY = canvas.height / 2 - paddleHeight / 2;
    startBtn.style.display = "none";
    canvas.style.display = "block";
    gameStarted = true;
    requestAnimationFrame(loop);
  });
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

    ctx.font = \`\${canvas.width * 0.04}px Arial\`;
    ctx.textAlign = "center";
    ctx.fillText(leftScore, canvas.width / 4, 50);
    ctx.fillText(rightScore, (canvas.width / 4) * 3, 50);

    if (gameOver) {
        ctx.font = \`\${canvas.width * 0.06}px Arial\`;
        ctx.fillText(rightScore === 7 ? "You Win" : "You Lose", canvas.width / 2, canvas.height / 2 - 40);

        const btnWidth = canvas.width * 0.3;
        const btnHeight = 50;
        const btnX = canvas.width / 2 - btnWidth / 2;
        const btnY = canvas.height / 2 + 10;

        ctx.strokeStyle = "white";
        ctx.strokeRect(btnX, btnY, btnWidth, btnHeight);

        ctx.font = "24px Arial";
        ctx.fillText("Restart", canvas.width / 2, btnY + 33);

        restartButtonArea = { x: btnX, y: btnY, width: btnWidth, height: btnHeight };
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
    ballSpeed = 5;
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

function setCanvasSize() {
    if (window.innerWidth <= 480) {
        canvas.width = 320;
        canvas.height = 280;
    } else {
        canvas.width = 950;
        canvas.height = 700;
    }
    leftPaddleY = canvas.height / 2 - paddleHeight / 2;
    rightPaddleY = canvas.height / 2 - paddleHeight / 2;
    resetBall();
}
window.addEventListener('load', setCanvasSize);
window.addEventListener('resize', setCanvasSize);

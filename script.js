
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startBtn = document.getElementById("startBtn");

const paddleWidth = 22;
const paddleHeight = 120;
const ballRadius = 15;

let leftPaddleY, rightPaddleY, ballX, ballY;
let ballVX = 0, ballVY = 0, ballSpeed = 5;
let leftScore = 0, rightScore = 0;
let gameOver = false, gameStarted = false;
let restartButtonArea = null;

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

function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
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
        const impact = (ballY - rightPaddleY) / paddleHeight - 0.5;
        const angle = impact * Math.PI / 3;
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
        const impact = (ballY - leftPaddleY) / paddleHeight - 0.5;
        const angle = impact * Math.PI / 3;
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
    if (paddleCenter < ballCenter - 5)
        leftPaddleY = clamp(leftPaddleY + 2, 0, canvas.height - paddleHeight);
    else if (paddleCenter > ballCenter + 5)
        leftPaddleY = clamp(leftPaddleY - 2, 0, canvas.height - paddleHeight);
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

        const btnW = canvas.width * 0.3;
        const btnH = 50;
        const btnX = canvas.width / 2 - btnW / 2;
        const btnY = canvas.height / 2 + 10;

        ctx.strokeStyle = "white";
        ctx.strokeRect(btnX, btnY, btnW, btnH);

        ctx.font = "24px Arial";
        ctx.fillText("Restart", canvas.width / 2, btnY + 33);

        restartButtonArea = { x: btnX, y: btnY, width: btnW, height: btnH };
    }
}

function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}

canvas.addEventListener("click", (e) => {
    if (!gameOver || !restartButtonArea) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const { x: bx, y: by, width, height } = restartButtonArea;
    if (x >= bx && x <= bx + width && y >= by && y <= by + height) {
        leftScore = 0;
        rightScore = 0;
        gameOver = false;
        restartButtonArea = null;
        resetBall();
    }
});

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

window.addEventListener("load", () => {
    setCanvasSize();
    resetBall();
    canvas.style.display = "none";

    startBtn.addEventListener("click", () => {
        setCanvasSize();
        resetBall();
        canvas.style.display = "block";
        gameStarted = true;
        loop();
    });
});

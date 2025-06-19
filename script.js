
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const paddleWidth = 22;
const paddleHeight = 120;
const ballRadius = 15;

let leftPaddleY = canvas.height / 2 - paddleHeight / 2;
let rightPaddleY = canvas.height / 2 - paddleHeight / 2;
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballVX = 4;
let ballVY = 3;

let leftScore = 0;
let rightScore = 0;
let gameOver = false;

canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    rightPaddleY = e.clientY - rect.top - paddleHeight / 2;
});

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw paddles
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, leftPaddleY, paddleWidth, paddleHeight);
    ctx.fillRect(canvas.width - paddleWidth, rightPaddleY, paddleWidth, paddleHeight);

    // Draw ball as a circle
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fill();

    // Draw scores
    ctx.font = "32px Arial";
    ctx.fillText(leftScore, canvas.width / 4, 40);
    ctx.fillText(rightScore, (canvas.width / 4) * 3, 40);

    // Game Over message
    if (gameOver) {
        ctx.font = "48px Arial";
        ctx.fillText("Game Over", canvas.width / 2 - 120, canvas.height / 2);
    }
}

function update() {
    if (gameOver) return;

    ballX += ballVX;
    ballY += ballVY;

    // Wall bounce
    if (ballY - ballRadius <= 0 || ballY + ballRadius >= canvas.height) {
        ballVY *= -1;
    }

    // Right paddle collision
    if (
        ballX + ballRadius >= canvas.width - paddleWidth &&
        ballY > rightPaddleY &&
        ballY < rightPaddleY + paddleHeight
    ) {
        ballVX *= -1;
        ballX = canvas.width - paddleWidth - ballRadius;
    }

    // Left paddle collision
    if (
        ballX - ballRadius <= paddleWidth &&
        ballY > leftPaddleY &&
        ballY < leftPaddleY + paddleHeight
    ) {
        ballVX *= -1;
        ballX = paddleWidth + ballRadius;
    }

    // Score conditions
    if (ballX < 0) {
        rightScore++;
        resetBall();
    } else if (ballX > canvas.width) {
        leftScore++;
        resetBall();
    }

    if (leftScore === 10 || rightScore === 10) {
        gameOver = true;
    }

    // AI for left paddle
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
    ballVX = Math.random() > 0.5 ? 4 : -4;
    ballVY = Math.random() > 0.5 ? 3 : -3;
}

function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}

loop();

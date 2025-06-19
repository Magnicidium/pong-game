
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const paddleWidth = 22;
const paddleHeight = 120;
const ballSize = 30;

let leftPaddleY = canvas.height / 2 - paddleHeight / 2;
let rightPaddleY = canvas.height / 2 - paddleHeight / 2;
let ballX = canvas.width / 2 - ballSize / 2;
let ballY = canvas.height / 2 - ballSize / 2;
let ballVX = 4;
let ballVY = 3;

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

    // Draw ball
    ctx.fillRect(ballX, ballY, ballSize, ballSize);
}

function update() {
    ballX += ballVX;
    ballY += ballVY;

    // Wall bounce
    if (ballY <= 0 || ballY + ballSize >= canvas.height) {
        ballVY *= -1;
    }

    // Right paddle collision
    if (
        ballX + ballSize >= canvas.width - paddleWidth &&
        ballY + ballSize > rightPaddleY &&
        ballY < rightPaddleY + paddleHeight
    ) {
        ballVX *= -1;
        ballX = canvas.width - paddleWidth - ballSize;
    }

    // Left paddle collision
    if (
        ballX <= paddleWidth &&
        ballY + ballSize > leftPaddleY &&
        ballY < leftPaddleY + paddleHeight
    ) {
        ballVX *= -1;
        ballX = paddleWidth;
    }

    // Missed paddle (reset)
    if (ballX < 0 || ballX > canvas.width) {
        ballX = canvas.width / 2 - ballSize / 2;
        ballY = canvas.height / 2 - ballSize / 2;
        ballVX = Math.random() > 0.5 ? 4 : -4;
        ballVY = Math.random() > 0.5 ? 3 : -3;
    }

    // Simple AI for left paddle
    const ballCenter = ballY + ballSize / 2;
    const paddleCenter = leftPaddleY + paddleHeight / 2;
    if (paddleCenter < ballCenter - 5) {
        leftPaddleY = clamp(leftPaddleY + 2, 0, canvas.height - paddleHeight);
    } else if (paddleCenter > ballCenter + 5) {
        leftPaddleY = clamp(leftPaddleY - 2, 0, canvas.height - paddleHeight);
    }
}

function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}

loop();

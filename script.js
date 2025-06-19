
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const paddleWidth = 22;
const paddleHeight = 120;
const ballRadius = 15;

let leftPaddleY = canvas.height / 2 - paddleHeight / 2;
let rightPaddleY = canvas.height / 2 - paddleHeight / 2;
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;

let ballSpeed = 3;
let ballAngle = Math.random() * Math.PI / 4 - Math.PI / 8; // -22.5° to +22.5°
let ballVX = Math.cos(ballAngle) * ballSpeed * (Math.random() > 0.5 ? 1 : -1);
let ballVY = Math.sin(ballAngle) * ballSpeed;

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
        ctx.fillText("Game Over", canvas.width / 2 - 120, canvas.height / 2);
    }
}

function update() {
    if (gameOver) return;

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

    if (leftScore === 10 || rightScore === 10) {
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
    ballSpeed = 3;
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

loop();

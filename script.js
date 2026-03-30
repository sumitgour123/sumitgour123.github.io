const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Full screen
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// ===== AUDIO =====
const bgMusic = new Audio("bg.mp3");
const gameOverSound = new Audio("gameover.mp3");

bgMusic.loop = true;
bgMusic.volume = 0.5;

// Start music on first key press
let gameStarted = false;
document.addEventListener("keydown", () => {
    bird.velocity = bird.lift;

    if (!gameStarted) {
        bgMusic.play();
        gameStarted = true;
    }
});

// ================= BIRD =================
let bird = {
    x: 100,
    y: canvas.height / 2,
    width: 40,
    height: 40,
    gravity: 0.6,
    lift: -12,
    velocity: 0
};

// ================= PIPES =================
let pipes = [];
let pipeWidth = 70;
let pipeGap = 180;
let pipeSpeed = 3;

// Create pipe
function createPipe() {
    let minHeight = 50;
    let maxHeight = canvas.height - pipeGap - 50;

    let topHeight = Math.random() * (maxHeight - minHeight) + minHeight;

    pipes.push({
        x: canvas.width,
        top: topHeight,
        bottom: canvas.height - topHeight - pipeGap,
        passed: false
    });
}

// Update pipes
function updatePipes() {
    for (let pipe of pipes) {
        pipe.x -= pipeSpeed;
    }

    pipes = pipes.filter(pipe => pipe.x + pipeWidth > 0);
}

// Draw pipes
function drawPipes() {
    ctx.fillStyle = "green";

    for (let pipe of pipes) {
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);
        ctx.fillRect(pipe.x, canvas.height - pipe.bottom, pipeWidth, pipe.bottom);
    }
}

// ================= BIRD =================
function updateBird() {
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;
}

function drawBird() {
    ctx.fillStyle = "orange";
    ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
}

// ================= SCORE =================
let score = 0;

function updateScore() {
    for (let pipe of pipes) {
        if (!pipe.passed && pipe.x + pipeWidth < bird.x) {
            score++;
            pipe.passed = true;
        }
    }
}

function drawScore() {
    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.fillText("Score: " + score, 20, 50);
}

// ================= COLLISION =================
function checkCollision() {
    for (let pipe of pipes) {
        if (
            bird.x < pipe.x + pipeWidth &&
            bird.x + bird.width > pipe.x &&
            (
                bird.y < pipe.top ||
                bird.y + bird.height > canvas.height - pipe.bottom
            )
        ) {
            return true;
        }
    }

    if (bird.y < 0 || bird.y + bird.height > canvas.height) {
        return true;
    }

    return false;
}

// ================= GAME LOOP =================
let frame = 0;

function gameLoop() {
    frame++;

    updateBird();
    updatePipes();
    updateScore();

    if (frame % 90 === 0) {
        createPipe();
    }

    if (checkCollision()) {
        bgMusic.pause();
        gameOverSound.play();

        setTimeout(() => {
            alert("Game Over! Score: " + score);
            location.reload();
        }, 500);

        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBird();
    drawPipes();
    drawScore();

    requestAnimationFrame(gameLoop);
}

gameLoop();

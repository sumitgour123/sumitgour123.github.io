const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// FULL SCREEN
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Images
const playerImg = new Image();
playerImg.src = "tiger.png";

const coinImg = new Image();
coinImg.src = "coin.png";

// Sounds
const bgMusic = document.getElementById("bgMusic");
const jumpSound = document.getElementById("jumpSound");
const overSound = document.getElementById("overSound");
const coinSound = new Audio("coin.wav");

// Player
let player = {
    x: 100,
    y: 200,
    w: 70,
    h: 70,
    gravity: 0.6,
    lift: -12,
    velocity: 0
};

let pipes = [];
let coins = [];
let score = 0;
let totalCoins = localStorage.getItem("coins") || 0;
let gameRunning = false;

// Start Game
function startGame() {
    document.getElementById("startScreen").style.display = "none";
    bgMusic.volume = 0.5;
    bgMusic.play().catch(()=>{});
    gameRunning = true;
    gameLoop();
}

// Jump
function jump() {
    if (!gameRunning) return;
    player.velocity = player.lift;
    jumpSound.currentTime = 0;
    jumpSound.play();
}
document.addEventListener("keydown", jump);
document.addEventListener("touchstart", jump);

// Game Loop
function gameLoop() {
    if (!gameRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Player
    player.velocity += player.gravity;
    player.y += player.velocity;

    ctx.drawImage(playerImg, player.x, player.y, player.w, player.h);

    // Pipes
    if (Math.random() < 0.02) {
        let gap = 180;
        let top = Math.random() * (canvas.height - gap - 100);

        pipes.push({
            x: canvas.width,
            top: top,
            bottom: top + gap,
            passed: false
        });
    }

    pipes.forEach(pipe => {
        pipe.x -= 5;

        ctx.fillStyle = "#00ff88";
        ctx.fillRect(pipe.x, 0, 70, pipe.top);
        ctx.fillRect(pipe.x, pipe.bottom, 70, canvas.height);

        // Collision
        if (
            player.x < pipe.x + 70 &&
            player.x + player.w > pipe.x &&
            (player.y < pipe.top || player.y + player.h > pipe.bottom)
        ) {
            gameOver();
        }

        if (!pipe.passed && pipe.x + 70 < player.x) {
            score++;
            pipe.passed = true;
        }
    });

    // Coins
    if (Math.random() < 0.02) {
        coins.push({
            x: canvas.width,
            y: Math.random() * (canvas.height - 50)
        });
    }

    coins.forEach((coin, i) => {
        coin.x -= 5;
        ctx.drawImage(coinImg, coin.x, coin.y, 40, 40);

        if (
            player.x < coin.x + 40 &&
            player.x + player.w > coin.x &&
            player.y < coin.y + 40 &&
            player.y + player.h > coin.y
        ) {
            coins.splice(i, 1);
            totalCoins++;
            coinSound.currentTime = 0;
            coinSound.play();
        }
    });

    // UI
    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.fillText("Score: " + score, 20, 50);
    ctx.fillText("Coins: " + totalCoins, 20, 100);

    // Ground collision
    if (player.y > canvas.height) {
        gameOver();
    }

    requestAnimationFrame(gameLoop);
}

// Game Over
function gameOver() {
    gameRunning = false;

    bgMusic.pause();

    overSound.currentTime = 0;
    overSound.play();

    localStorage.setItem("coins", totalCoins);

    setTimeout(() => {
        alert("Game Over 💀\nScore: " + score + "\nCoins: " + totalCoins);
        location.reload();
    }, 500);
}

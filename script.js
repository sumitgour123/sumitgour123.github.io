let randomNumber = Math.floor(Math.random() * 100) + 1;
let attemptsLeft = 7;

function checkGuess() {
    let userGuess = document.getElementById("guessInput").value;

    if (userGuess === "") {
        alert("Please enter a number!");
        return;
    }

    userGuess = Number(userGuess);
    attemptsLeft--;

    if (userGuess === randomNumber) {
        document.getElementById("message").innerText = "🎉 Correct! You won!";
        disableGame();
    } else if (attemptsLeft === 0) {
        document.getElementById("message").innerText = 
            "❌ Game Over! Number was " + randomNumber;
        disableGame();
    } else if (userGuess > randomNumber) {
        document.getElementById("message").innerText = "📉 Too High!";
    } else {
        document.getElementById("message").innerText = "📈 Too Low!";
    }

    document.getElementById("attempts").innerText = 
        "Attempts left: " + attemptsLeft;
}

function disableGame() {
    document.getElementById("guessInput").disabled = true;
}

function resetGame() {
    randomNumber = Math.floor(Math.random() * 100) + 1;
    attemptsLeft = 7;

    document.getElementById("guessInput").disabled = false;
    document.getElementById("guessInput").value = "";
    document.getElementById("message").innerText = "";
    document.getElementById("attempts").innerText = "";
}

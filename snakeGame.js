const playBoard = document.querySelector(".play-board");
const scoreUpdate = document.querySelector('.score');
const highScoreUpdate = document.querySelector('.highScore');

let gameOver = false;
let foodX, foodY;
let snakeX = 5, snakeY = 10;
let snakeBody = [];
let leftRight = 0, upDown = 0;
let setIntervalId;
let score = 0;
let highScore = localStorage.getItem("highScore") || 0;

const changeFoodPosition = () => {
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
}

const handleGameOver = () => {
    score = 0;
    alert("Game Over! Press OK to replay...");
    clearInterval(setIntervalId);
    location.reload();
    /// efectiv da un refresh la pagina
}

const changeDirection = (e) => {
    if (e.key === "ArrowUp" && upDown != 1) {
        leftRight = 0;
        upDown = -1;
    } else if (e.key === "ArrowDown" && upDown != -1) {
        leftRight = 0;
        upDown = 1;
    } else if (e.key === "ArrowLeft" && leftRight != 1) {
        leftRight = -1;
        upDown = 0;
    } else if (e.key === "ArrowRight" && leftRight != -1) {
        leftRight = 1;
        upDown = 0;
    }
}

const initGame = () => {
    highScoreUpdate.innerText = `High Score: ${localStorage.getItem("highScore")}`;
    if (gameOver) {
        return handleGameOver();
    }
    let htmlMarkup = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;

    if (snakeX === foodX && snakeY === foodY) {
        changeFoodPosition();
        snakeBody.push([foodX, foodY]);
        score++;
        if (score > highScore) {
            highScore = score;
            localStorage.setItem("highScore", highScore);
            highScoreUpdate.innerText = `High Score: ${highScore}`;
        }

        scoreUpdate.innerText = `Score: ${score}`;
    }

    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }

    snakeBody[0] = [snakeX, snakeY];

    snakeX += leftRight;
    snakeY += upDown;

    if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
        gameOver = true;
    }

    for (let i = 0; i < snakeBody.length; i++) {
        htmlMarkup += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
        if (i !== 0) {
            if (snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
                gameOver = true;
            }
        }
    }
    playBoard.innerHTML = htmlMarkup;
    /// aceste 2 linii de mai sus creeaza un nou div care apartine clasei 'food'
    /// si adauga acest div inauntrul div-ului cu clasa 'play-board'
}

changeFoodPosition();
setIntervalId = setInterval(initGame, 125);
/// am creeat identificatorul dat prin setInterval (acest identificator este returnat atunci cand creezi un interval cu setInterval)
/// iar ca sa oprim intervalul trebuie sa folosim : clearInterval(setIntervalId)




/// functia initGame se apeleaza la fiecare 0.125 secunde
/// intrebarea mea a fost : de ce sarpele continua sa mearga la stanga
/// chiar daca nu mai apas deloc nicio tasta
/// ei bine, functia apelandu-se la fiecare 0.125 secunde, variabilele
/// leftRight si upDown raman nemodificate si functia se tot apeleaza
/// de exemplu leftRight poate ramane 1 si upDown poate ramane 0
/// si raman cu aceste valori pana la urmatoarea apasare a unei sageti
document.addEventListener("keydown", changeDirection);

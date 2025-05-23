const gameboard = (function(){
    let gameboardArray = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    const addPlay = function (player, playPosition) {
        gameboardArray[playPosition] = player.getToken();
    };
    const show = function() {return gameboardArray};
    const clean = function () { gameboardArray = [0, 1, 2, 3, 4, 5, 6, 7, 8]};
    const getStateAt = (position) => {return gameboardArray[position]}
    return {addPlay, show, clean, getStateAt};
})();


function createPlayer (name, token) {
    let score = 0;
    const addWin = function (){score++};
    const getScore = ()=> {return score};
    const getToken = () => {return token};
    return {name, addWin, getScore, getToken};
};

function createGame (player1, player2) {
    const players = [player1, player2];
    let activePlayer = players[0];
    let inARound = false;

    const getActivePlayer = () => activePlayer;

    const switchPlayerTurn = () => {
        activePlayer = (activePlayer === players[0])? players[1] : players[0];
        console.log(`${activePlayer.name} is next to play`)
    };

    const play = (playPosition) => {
        if (gameboard.getStateAt(playPosition) !== players[0].getToken() && gameboard.getStateAt(playPosition) !== players[1].getToken()) {
            gameboard.addPlay(activePlayer, playPosition);

            if (checkForWin()) {
                activePlayer.addWin();
                console.log(`Oh my god, ${activePlayer.name} has won this round !!!!`);
                displayController.setWinnerState();
                displayController.refreshPlayersScore();
                endRound();
            } else if (checkForTie()) {
                console.log("Well it's a tie I guess");
                endRound();
            };
            switchPlayerTurn();
        } else {
            console.log("Hey that spot is taken friend");
        }
    };

    const startRound = () => {
        gameboard.clean();
        displayController.removeWinnerState();
        inARound = true;
        displayController.showGameboard()
    };

    const isInRound = () => inARound;

    const endRound = () => {
        inARound = false;
        displayController.showGameboard();
    }

    const checkForWin = () => {
        const currentBoard = gameboard.show();
        if (currentBoard[0] === currentBoard[1] && currentBoard[1] === currentBoard[2] ||
            currentBoard[3] === currentBoard[4] && currentBoard[4] === currentBoard[5] ||
            currentBoard[6] === currentBoard[7] && currentBoard[7] === currentBoard[8] ||

            currentBoard[0] === currentBoard[3] && currentBoard[3] === currentBoard[6] ||
            currentBoard[1] === currentBoard[4] && currentBoard[4] === currentBoard[7] ||
            currentBoard[2] === currentBoard[5] && currentBoard[5] === currentBoard[8] ||

            currentBoard[0] === currentBoard[4] && currentBoard[4] === currentBoard[8] ||
            currentBoard[2] === currentBoard[4] && currentBoard[4] === currentBoard[6]
        ) {
            return true;
        } else {
            return false;
        }
    };

    const checkForTie = () => {
        const currentBoard = gameboard.show();
        for (let cell of currentBoard) {
            if (typeof(cell) === "number") {
                return false;
            };
        };
        return true;
    };

    return {getActivePlayer,
        switchPlayerTurn,
        play,
        checkForWin,
        checkForTie,
        startRound,
        isInRound,
        endRound}
};


const displayController = (function () {
    const gameboardDiv = document.querySelector(".gameboard");
    const showGameboard = () => {
        cleanGameboard();
        const currentBoard = gameboard.show();
        for (let cell of currentBoard) {
            const cellToDisplay = document.createElement("button");
            cellToDisplay.setAttribute("class", "gameboard-cell");
            if (typeof(cell) !== "number") {
                cellToDisplay.textContent = cell;
            };
            if (game.isInRound()){
                cellToDisplay.addEventListener("click", () =>{
                    game.play(cell);
                    showGameboard();
                });
            }
            gameboardDiv.appendChild(cellToDisplay);
        };
    };

    const cleanGameboard = () => {
        gameboardDiv.textContent = "";
    };

    const setWinnerState = () => {
        gameboardDiv.setAttribute("class", "gameboard winner-state")
    };

    const removeWinnerState = () => {
        gameboardDiv.setAttribute("class", "gameboard")
    };


    const playerOneContainer = document.querySelector(".player-one");
    const playerTwoContainer = document.querySelector(".player-two");
    const formOne = document.querySelector(".player-one form");
    const formTwo = document.querySelector(".player-two form");
    const playerOneTitle = document.querySelector(".player-one h2");
    const playerTwoTitle = document.querySelector(".player-two h2");

    formOne.addEventListener("submit", (e) => {
        e.preventDefault();
        const formOneData = new FormData(e.target);
        const playerOneName = formOneData.get("player-one-name");
        playerOneTitle.textContent = playerOneName;
        playerOneContainer.removeChild(formOne);
    });

    formTwo.addEventListener("submit", (e) => {
        e.preventDefault();
        const formTwoData = new FormData(e.target);
        const playerTwoName = formTwoData.get("player-two-name");
        playerTwoTitle.textContent = playerTwoName;
        playerTwoContainer.removeChild(formTwo);
    });

    const startRoundBtn = document.querySelector(".start-round");
    startRoundBtn.addEventListener("click", ()=>{game.startRound()})

    const playerOneScoreDiv = document.querySelector(".player-one-score");
    const playerTwoScoreDiv = document.querySelector(".player-two-score");

    const refreshPlayersScore = () => {
        const playerOneCurrentScore = playerOne.getScore();
        const playerTwoCurrentScore = playerTwo.getScore();
        playerOneScoreDiv.textContent = `Score = ${playerOneCurrentScore}`;
        playerTwoScoreDiv.textContent = `Score = ${playerTwoCurrentScore}`;
    };


    return {showGameboard, cleanGameboard, setWinnerState, removeWinnerState, refreshPlayersScore};
})();


const playerOne = createPlayer("Ulysse", "O");
const playerTwo = createPlayer("AI", "X");
const game = createGame(playerOne, playerTwo);
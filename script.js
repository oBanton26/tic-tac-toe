const gameboard = (function(){
    let gameboardArray = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    const addPlay = function (player, playPosition) {
        gameboardArray[playPosition] = player.name;
    };
    const show = function() {return gameboardArray};
    const clean = function () { gameboardArray = [0, 1, 2, 3, 4, 5, 6, 7, 8]};
    const getStateAt = (position) => {return gameboardArray[position]}
    return {addPlay, show, clean, getStateAt};
})();


function createPlayer (name) {
    let score = 0;
    const addWin = function (){score++};
    const getScore = ()=> {return score};
    return {name, addWin, getScore};
};

function createGame (player1, player2) {
    const players = [player1, player2];
    let activePlayer = players[0];

    const getActivePlayer = () => activePlayer;

    const switchPlayerTurn = () => {
        activePlayer = (activePlayer === players[0])? players[1] : players[0];
    };

    const playRound = (playPosition) => {
        if (gameboard.getStateAt(playPosition) !== players[0].name && gameboard.getStateAt(playPosition) !== players[1].name) {
            gameboard.addPlay(activePlayer, playPosition);

            if (checkForWin()) {
                activePlayer.addWin();
                gameboard.clean();
                console.log(`Oh my god, ${activePlayer.name} has won this round !!!!`);
                switchPlayerTurn();
            } else {
                switchPlayerTurn();
                console.log(`${activePlayer.name} is the next player to play the next play...`)
            };
        } else {
            console.log("Hey that spot is taken friend");
        }
        
        
    };

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

    return {getActivePlayer, switchPlayerTurn, playRound, checkForWin}
};


const me = createPlayer("Ulysse");
const ai = createPlayer("AI");
const game = createGame(me, ai);
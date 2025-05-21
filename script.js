const gameboard = (function(){
    let gameboardArray = [];
    const addPlay = function (player, playPosition) {
        gameboardArray.push(playPosition)
    };
    const show = function() {return gameboardArray};
    const clean = function() {gameboardArray = []};
    return {addPlay, show, clean};
})();


function createPlayer (name) {
    let score = 0;
    const addWin = function (){score++};
    const getScore = ()=> {return score};
    return {name, addWin, getScore};
};

function createGame (player1, player2) {
    gameboard.clean();
    
}
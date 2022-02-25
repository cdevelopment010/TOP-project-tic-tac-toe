// factory function for repeating objects
const people = function(name, marker) {
    return  {name, marker}
}


//Module for gameboard

const gameBoard = ((function() {

    let cells = [...document.querySelectorAll('.cell')];

    cells.forEach(cell=> {
        cell.addEventListener('click',updateGrid);
    })

    function checkWinner(arrToCheck) {
        let currentPlayer = gameController.getCurrentPlayer(); 
        let winningArr = [[0,1,2], 
                         [3,4,5], 
                         [6,7,8], 
                         [0,3,6], 
                         [1,4,7], 
                         [2,5,8], 
                         [0,4,8],
                         [2,4,6]
                        ]; 

        let continueCheck = arrToCheck.some(cell => cell.innerText == ''); 
        if (!continueCheck) {
            console.log(`It is a draw!`); 
            gameController.gameOver(); 
            return true;
        } 

        for (let i = 0; i < winningArr.length; i++) {
            let check1 = winningArr[i][0];
            let check2 = winningArr[i][1];
            let check3 = winningArr[i][2];
            let marker = playerController.playerList[currentPlayer].marker; 
            if (arrToCheck[check1].innerText == marker && arrToCheck[check2].innerText == marker && arrToCheck[check3].innerText == marker) {
                console.log(`Winner winner, chicken dinner! \n${playerController.playerList[currentPlayer].name} wins`); 
                gameController.gameOver(playerController.playerList[currentPlayer].name);
                return true;
            }
        }
        return false; 
    }

    function clearCells() {
        cells.forEach(cell => cell.innerText = '');
    }


    function updateGrid() {
        let player= gameController.getCurrentPlayer()        
        if (this.innerText !== '' || checkWinner(cells)) {
            return false;
        }

        // If player2 is a bot
        if (playerController.playerList[1].name =='player2') {
            this.innerText = playerController.playerList[player].marker; 
            botController.recursiveFindBlank(cells,true); 

        } else {
            this.innerText = playerController.playerList[player].marker; 
            gameController.updatePlayer();
        }


        // the alert was showing before the inner text updated
        setTimeout(() => {
            checkWinner(cells); 
        }, 50) 
    }

    return {
        cells,
        clearCells, 
        checkWinner
    }
}))(); 


const playerController = (function() {

    const playerList =[]; 
    const setPlayers = function(player1, player2) {
        let person1 = people(player1, 'X'); 
        let person2 = people(player2, 'O'); 
        
        playerList[0] = person1; 
        playerList[1] = person2; 
        return playerList; 
    }
    return {
        playerList, 
        setPlayers
    }

})(); 

const gameController = (function() {
    let currentPlayer = 0;  
    const startBtn = document.getElementById('btn');
    const restartBtn = document.getElementById('restart-btn'); 
    const playerStart = document.getElementById('player-start'); 
    const game = document.getElementById('game'); 
    const gameOverScreen = document.getElementById('game-over'); 
    const rematchBtn = document.getElementById('rematch'); 
    const newPlayersBtn = document.getElementById('new-players')
    
    startBtn.addEventListener('click', startGame); 
    restartBtn.addEventListener('click', updateScreen); 
    rematchBtn.addEventListener('click', rematch); 
    newPlayersBtn.addEventListener('click', newGame); 

    function startGame() {
        gameBoard.clearCells();
        gameOverScreen.classList.add('hidden') 
        currentPlayer = 0; 
        const player1Name = document.getElementById('player1').value || 'player1'
        const player2Name = document.getElementById('player2').value || 'player2'
        playerController.setPlayers(player1Name, player2Name); 
        updateScreen(); 
        document.getElementById('player1').value = ''; 
        document.getElementById('player2').value = ''; 
    }

    function updatePlayer() {
        currentPlayer = (currentPlayer + 1) % 2;
    }

    function getCurrentPlayer() {
        return currentPlayer;
    }

    function updateScreen() {
        game.classList.toggle('hidden');
        playerStart.classList.toggle('hidden');
    }

    function gameOver(winner) {
        gameOverScreen.querySelector('h2').innerText = `Winner: ${winner}`; 
        gameOverScreen.classList.remove('hidden')
        game.classList.add('hidden');
        playerStart.classList.add('hidden');
    }

    function rematch() {
        gameOverScreen.querySelector('h2').innerText = ''; 
        gameBoard.clearCells();
        gameOverScreen.classList.add('hidden') 
        currentPlayer = 0; 
        game.classList.toggle('hidden');
    }

    function newGame() {
        gameOverScreen.querySelector('h2').innerText = ''; 
        playerStart.classList.toggle('hidden');
        gameBoard.clearCells();
        gameOverScreen.classList.add('hidden')
    }

    return {
        updatePlayer,
        getCurrentPlayer, 
        gameOver
    }

})(); 



const botController = (function() {

    let remainingCells = [];

    let score = {
        win: 1, 
        loss: -1, 
        draw: 0
    }


    
    //position = current position
    //depth = how many moves ahead
    //maximising player = boolean 
    function minimax(position, depth, maximisingPlayer) {
        console.log("depth", depth); 
        updateRemainingCells(position); 
        if (depth = 0) return;
        
        if (maximisingPlayer) {
            let maxEval = -Infinity
            

            for (let i = 0; i < remainingCells.length; i++) {
                if (remainingCells[i] == '') {
                    remainingCells[i] = 0; 
                    console.log("minimax=true",remainingCells)
                    gameBoard.checkWinner(remainingCells); 
                    minimax(remainingCells, depth-1, false); 
                }
            }
            return maxEval
        } else {

            let minEval = Infinity; 

            for (let i = 0; i < remainingCells.length; i++) {
                if (remainingCells[i] == '') {

                    remainingCells[i] = 0; 
                    if (!gameBoard.checkWinner(remainingCells)) {
                        minimax(remainingCells, depth-1, true)
                        minEval = Math.min(minEval,1) 
                    }
                }
            }

            return  minEval
        }
    }

    function updateRemainingCells(arr) {
        remainingCells = arr.map(cell => cell.innerText == '' ? '' : 0); 
        console.log("remaining cells",remainingCells); 
        let continueCheck = remainingCells.some(cell => cell.innerText == ''); 
        console.log("check empty", continueCheck); 
    }


    function recursiveFindBlank(arr, bot) {
        let firstBlank = -1;
        let tempArr = [...arr]; 
        for (let i = 0; i<tempArr.length; i++) {
            // console.log(arr[i]); 
            if (tempArr[i].innerText =='') {
                firstBlank = i; 
                break;
            }
        }

        
        if (!bot || firstBlank == -1) {
            return;
        }

        tempArr[firstBlank].innerText = 'O'; 
        return recursiveFindBlank(tempArr, false)
    }

    return {
        minimax, 
        recursiveFindBlank
    }

})()
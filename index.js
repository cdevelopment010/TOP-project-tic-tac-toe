// Module
const gameBoard = (function() {
    let cells = [...document.querySelectorAll('.cell')];
    return {
        cells
    }
})(); 


// factory function for repeating objects

const people = function(name, marker) {
    return  {name, marker}
}


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

const displayController = (function() {
    let currentPlayer = 0;  
    const startBtn = document.getElementById('btn');
    const restartBtn = document.getElementById('restart-btn'); 
    const playerStart = document.getElementById('player-start'); 
    const game = document.getElementById('game'); 
    
    startBtn.addEventListener('click', startGame); 
    gameBoard.cells.forEach(cell => {
        cell.addEventListener('click', updateGrid)
    })
    restartBtn.addEventListener('click', updateScreen); 

    function updateGrid() {

        if (this.innerText !== '') {
            return false;
        }
        this.innerText = playerController.playerList[currentPlayer].marker; 

        // the alert was showing before the inner text updated
        setTimeout(() => {
            checkWinner(); 
            // Update to next player
            currentPlayer = (currentPlayer + 1) % 2;
        }, 50) 
    }


    
    function startGame() {
        gameBoard.cells.forEach(cell => cell.innerText = ''); 
        currentPlayer = 0; 
        const player1Name = document.getElementById('player1').value || 'player1'
        const player2Name = document.getElementById('player2').value || 'player2'
        playerController.setPlayers(player1Name, player2Name); 
        updateScreen(); 
        document.getElementById('player1').value = ''; 
        document.getElementById('player2').value = ''; 
    }

    function checkWinner() {
        let winningArr = [[0,1,2], 
                         [3,4,5], 
                         [6,7,8], 
                         [0,3,6], 
                         [1,4,7], 
                         [2,5,8], 
                         [0,4,8],
                         [2,4,6]
                        ]; 

        let continueCheck = gameBoard.cells.some(cell => cell.innerText == ''); 
        if (!continueCheck) {
            alert(`It is a draw!`); 
            updateScreen(); 
            return true;
        } 

        for (let i = 0; i < winningArr.length; i++) {
            let check1 = winningArr[i][0];
            let check2 = winningArr[i][1];
            let check3 = winningArr[i][2];
            let marker = playerController.playerList[currentPlayer].marker; 
            if (gameBoard.cells[check1].innerText == marker && gameBoard.cells[check2].innerText == marker && gameBoard.cells[check3].innerText == marker) {
                alert(`Winner winner, chicken dinner! \n${playerController.playerList[currentPlayer].name} wins`); 
                updateScreen(); 
                return true; 
            }
        }
        return false; 
    }


    function updateScreen() {
        game.classList.toggle('hidden');
        playerStart.classList.toggle('hidden');
    }

    return {
        
    }

})(); 
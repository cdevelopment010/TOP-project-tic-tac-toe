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

const gameController = (function() {
    let currentPlayer = 0;  
    let cells = [...document.querySelectorAll('.cell')];
    const startBtn = document.getElementById('btn');
    const restartBtn = document.getElementById('restart-btn'); 
    const playerStart = document.getElementById('player-start'); 
    const game = document.getElementById('game'); 
    
    startBtn.addEventListener('click', startGame); 
    cells.forEach(cell => {
        cell.addEventListener('click', updateGrid)
    })
    restartBtn.addEventListener('click', updateScreen); 

    function updateGrid() {

        if (this.innerText !== '') {
            return false;
        }

        if (playerController.playerList[currentPlayer].name == 'player2') {
            botController.minimax(cells, 6, true); 
        }

        this.innerText = playerController.playerList[currentPlayer].marker; 

        // the alert was showing before the inner text updated
        setTimeout(() => {
            checkWinner(cells); 
            // Update to next player
            currentPlayer = (currentPlayer + 1) % 2;
        }, 50) 
    }
    
    function startGame() {
        cells.forEach(cell => cell.innerText = ''); 
        currentPlayer = 0; 
        const player1Name = document.getElementById('player1').value || 'player1'
        const player2Name = document.getElementById('player2').value || 'player2'
        playerController.setPlayers(player1Name, player2Name); 
        updateScreen(); 
        document.getElementById('player1').value = ''; 
        document.getElementById('player2').value = ''; 
    }

    function checkWinner(arrToCheck) {
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
            // updateScreen(); 
            return true;
        } 

        for (let i = 0; i < winningArr.length; i++) {
            let check1 = winningArr[i][0];
            let check2 = winningArr[i][1];
            let check3 = winningArr[i][2];
            let marker = playerController.playerList[currentPlayer].marker; 
            if (arrToCheck[check1].innerText == marker && arrToCheck[check2].innerText == marker && arrToCheck[check3].innerText == marker) {
                console.log(`Winner winner, chicken dinner! \n${playerController.playerList[currentPlayer].name} wins`); 
                // updateScreen(); 
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
        cells,
        checkWinner, 
    }

})(); 



const botController = (function() {

    let remainingCells = gameController.cells.map(cell => cell.innerText == '' ? '' : 0); 
    console.log(remainingCells)
    
    //position = current position
    //depth = how many moves ahead
    //maximising player = boolean 
    function minimax(position, depth, maximisingPlayer) {
        console.log(depth); 
        updateRemainingCells(position); 
        if (depth = 0) return;
        
        if (maximisingPlayer) {
            let maxEval = -Infinity
            

            for (let i = 0; i < remainingCells.length; i++) {
                if (remainingCells[i] == '') {
                    remainingCells[i] = 0; 
                    console.log("minimax=true",remainingCells)
                    gameController.checkWinner(remainingCells); 
                    await minimax(remainingCells, depth-1, false); 
                    // if (!gameController.checkWinner(remainingCells)) {
                    //     minimax(remainingCells, depth-1, false)
                    //     maxEval = Math.max(maxEval,0) 
                    // }
                }
            }

            //loop through all children of the current position
            //Call recursive function to minimax with depth -1

            // maxEval = Math.max(maxEval, childrenEval)
            return maxEval
        } else {
            //similar to above

            let minEval = Infinity; 

            //loop through children but recursive functino should be true i.e minimax(ChildPosition, depth -1 , true)

            // minEval = Math.min(minEval, childrenEval)

            for (let i = 0; i < remainingCells.length; i++) {
                if (remainingCells[i] == '') {

                    remainingCells[i] = 0; 
                    if (!gameController.checkWinner(remainingCells)) {
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


    return {
        minimax, 
    }

})()
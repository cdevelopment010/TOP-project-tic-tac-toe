// factory function for repeating objects
const people = function(name, marker) {
    return  {name, marker}
}


//Module for gameboard

const gameBoard = ((function() {

    
    let cells = [...document.querySelectorAll('.cell')];
    const board = []; 
    for (let i = 0; i < 9; i++) {
        board.push(''); 
    }
    cells.forEach(cell=> {
        cell.addEventListener('click',updateGrid);
    })

    function checkWinner(arrToCheck, marker) {
        let winningArr = [[0,1,2], 
                         [3,4,5], 
                         [6,7,8], 
                         [0,3,6], 
                         [1,4,7], 
                         [2,5,8], 
                         [0,4,8],
                         [2,4,6]
                        ];
    
        for (let i = 0; i < winningArr.length; i++){
            if (arrToCheck[winningArr[i][0]] != '' && (arrToCheck[winningArr[i][0]] == arrToCheck[winningArr[i][1]]
                             && arrToCheck[winningArr[i][0]] == arrToCheck[winningArr[i][2]])) {

                if (arrToCheck[winningArr[i][0]] == marker) {
                    return {
                        gameover: true, 
                        score: 1
                    }; 

                } else {
                    return {
                        gameover: true, 
                        score: -1

                    }; 
                }
            }
        }

        if (emptyCellCount() == 0) {
            return {
                gameover: true, 
                score: 0
            }; 
        }
        return {
            gameover: false, 
            // score: null
            score: 0
        }; 
    }

    function clearCells() {
        cells.forEach(cell => {
            cell.innerText = ''
            cell.className = cell.className.replace(/player*/gi, '')
        });
        board.forEach((square, index) => {
            board[index] = ''; 
        }); 
    }

    function emptyCellCount() {
        return board.reduce((prev,next) => next == '' ? prev + 1 : prev, 0)
    }

    function updateGrid() {
        let positionsRemaining = emptyCellCount() - 1;  
        let player= gameController.getCurrentPlayer() ; 
        let currentMarker = playerController.playerList[player].marker; 
        let opponentMarker = ['X','O'].filter(symbol => symbol != currentMarker)[0];
        let opponent = gameController.getCurrentPlayerByMarker(['X','O'].filter(symbol => symbol != currentMarker));
        if (board[this.id] !== '' || checkWinner(board, currentMarker).gameover) {
            return false;
        }       
        
        // If player2 is not a bot
        if (playerController.playerList[1].name !='player2') {
            board[this.id] = currentMarker; 
            console.log(`player${player}`); 
            this.classList.add(`player${player}`); 
            gameController.updatePlayer();
            document.getElementById('turn').innerText  = `It is ${gameController.playerName()}'s turn`; 
        } else {
            //if player 2 is a bot
            board[this.id] = currentMarker; 
            this.classList.add(`player${player}`); 
            let move = botController.minimax(cells, positionsRemaining, true, opponentMarker).index; 
            if (move != undefined) {
                cells[move].classList.add(`player${player+1}`)
                board[move] = opponentMarker;
            } 
        }
        
        setTimeout(() => {
            if(checkWinner(board, currentMarker).gameover) {
                let winner; 
                if (checkWinner(board, currentMarker).score === 0 ) {
                    winner = 'draw'
                } else if (checkWinner(board, currentMarker).score === 1) {
                    winner = gameController.getCurrentPlayerByMarker(currentMarker); 
                } else {
                    winner = opponent
                }
                gameController.gameOver(winner)
            } 
        }, 50) 
    }

    return {
        cells,
        board,
        clearCells, 
        checkWinner, 
        emptyCellCount, 
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
        document.getElementById('turn').innerText  = `It is ${playerName()}'s turn`; 
    }

    function updatePlayer() {
        currentPlayer = (currentPlayer + 1) % 2;
    }

    function playerName() {
        return playerController.playerList[currentPlayer].name; 
    }

    function getCurrentPlayer() {
        return currentPlayer;
    }
    function getCurrentPlayerByMarker(marker) {
        return playerController.playerList[0].marker == marker ? playerController.playerList[0].name : playerController.playerList[1].name;
    }

    function updateScreen() {
        game.classList.toggle('hidden');
        playerStart.classList.toggle('hidden');
    }

    function gameOver(winner) {
        gameOverScreen.querySelector('h2').innerText = winner == 'draw' ? `It is a draw!` : `Winner: ${winner}`; 
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
        document.getElementById('turn').innerText  = `It is ${playerName()}'s turn`; 
    }

    function newGame() {
        gameOverScreen.querySelector('h2').innerText = ''; 
        playerStart.classList.toggle('hidden');
        gameBoard.clearCells();
        gameOverScreen.classList.add('hidden')
        document.getElementById('turn').innerText  = `It is ${playerName()}'s turn`; 
    }

    return {
        updatePlayer,
        getCurrentPlayer, 
        gameOver, 
        getCurrentPlayerByMarker, 
        playerName
    }

})(); 



const botController = (function() {
    function availableSquares(arr) {
        let available = arr.map((space,index) => {
            if (space == '')
            return index; 
        }).filter(space => space != undefined); 
    
        return available; 
    }

    function minimax(position, depth, maximise, marker) {
        let bestScore, currentScore, bestMove; 
        let opponentMarker = ['X', 'O'].filter(mark => mark != marker)[0]; 
        let availableSpaces = availableSquares(gameBoard.board); 
        let moves = []
        let move; 
        let checkWinner = gameBoard.checkWinner(gameBoard.board, marker);
        if (checkWinner.gameover || depth == 0 ) {
            let score = checkWinner.score >= 0 ? checkWinner.score - depth:  checkWinner.score - depth
            return {index: availableSpaces[0], score} ; 
        }
        if (availableSpaces.length > 0 ) {
            for (let i = 0; i < availableSpaces.length; i++) {
                move = {}
                move.index = availableSpaces[i]; 
                
                // console.log("tempboard:",  board); 
                if (!maximise) {
                    gameBoard.board[availableSpaces[i]] = opponentMarker;
                    currentScore= minimax(position, depth - 1 , true, marker)
                    move.score = currentScore.score; 
                } else {
                    gameBoard.board[availableSpaces[i]] = marker;
                    currentScore = minimax(position, depth - 1 , false, marker)
                    move.score = currentScore.score; 
                }
                gameBoard.board[availableSpaces[i]] = ''; 
                moves.push(move)
            }
        }
    
        if (maximise) {
            bestScore = Number.NEGATIVE_INFINITY; 
            for (let i = 0; i < moves.length; i++) {
                if (moves[i].score > bestScore) {
                    bestScore = moves[i].score; 
                    bestMove = i; 
                }
            }
        } else {
            bestScore = Number.POSITIVE_INFINITY; 
            for (let j = 0; j < moves.length; j++) {
                if (moves[j].score < bestScore) {
                    bestScore = moves[j].score; 
                    bestMove = j; 
                }
            }
        }

        return moves[bestMove]; 
    }
    return {
        minimax
    }

})()
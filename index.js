// Module
const gameBoard = (function() {
    const board = ['', '', '', '', '', '', '', '', '']; 
    let cells = [...document.querySelectorAll('.cell')]; 

    const addMarker = function() {
        // check is blank
        if (this.innerText == '') {
            let marker = game.currentMarker(); 
            this.innerText = marker;
            if (checkWinner(marker)) {
                declareWinner(marker); 
                resetGrid(); 
            } 
        }
    }

    const checkWinner = function(marker) { 
        let winningArr = [[0,1,2], 
                         [3,4,5], 
                         [6,7,8], 
                         [0,3,6], 
                         [1,4,7], 
                         [2,5,8], 
                         [0,4,8],
                         [2,4,6]
                        ]

        for (let i = 0; i < winningArr.length; i++) {
            let check1 = winningArr[i][0]; 
            let check2 = winningArr[i][1]; 
            let check3 = winningArr[i][2]; 
            if (cells[check1].innerText==marker 
                    && cells[check2].innerText ==marker 
                    && cells[check3].innerText == marker) {
                return true; 
            }
        }
        return false;
    }

    const declareWinner = function(marker) {
        let currentPerson = [game.person1,game.person2].filter(person => person.marker == marker);
        return alert(`${currentPerson[0].name} wins!`) 
    }

    const resetGrid = function() {

        game.resetMarker(); 
        cells.forEach((cell,index) => {
            cell.innerText = ''; 
        })
    }



    cells.forEach((cell,index) => {
        cell.addEventListener('click', addMarker)
    })
    

    return {
        addMarker
    }
})(); 


// factory function for repeating objects

const people = function(name, marker) {
    return  {name, marker}
}

const game = (function() {

    const btn = document.getElementById('btn'); 
    
    const setPeople = function() {
        const player1Name = document.getElementById('player1').value || 'player1'; 
        const player2Name = document.getElementById('player2').value || 'player2'; 
        
        const person1 = people(player1Name, 'X'); 
        const person2 = people(player2Name, 'O');
        
        return  {person1, person2} 
    }
    // Set people
    
    btn.addEventListener('click', setPeople);

    // add marker

    let marker = person1.marker
    let currentMarker = () => {
        marker =  marker == person1.marker ? person2.marker : person1.marker; 
        return marker == person1.marker ? person2.marker : person1.marker; 
    }

    const resetMarker = function() {
        marker = person1.marker; 
    }

    return {
        currentMarker,
        resetMarker,  
        person1, 
        person2
    }

})(); 
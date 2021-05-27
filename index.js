const randomDogApi = "https://dog.ceo/api/breeds/image/random";
const dogImage = document.getElementById('dog')

// Display Stuff:
// 1. populate a board with tiles/mines
// 2. left click on tiles
    // a. Reveal tiles
// 3. right click on tiles - NOT YET IMPLEMENTED
    // a. mark tiles - NOT YET IMPLEMENTED
// 4. check for win/lose

function appendDog () {     // shows us a dog image
    fetch(randomDogApi)
    .then(res => res.json())
    .then(data => {
        dogImage.innerHTML = `<img src = "${data.message}" alt = "dog"/>`
    })
}

document.addEventListener("DOMContentLoaded", () => {
    document.querySelector("#start-game").addEventListener('click', startGame)  // 'Start Game!' button
    document.querySelector("#give-me-dog").addEventListener('click', appendDog) // 'I deserve a dog.' button
})

let boardSize = 10;     
let difficulty = 20;    // mine count

function startGame() {       // generate grid based on chosen board size
    const grid = document.getElementById("grid");
    grid.innerHTML = " ";

    // let x = 0
    // while(x < boardSize){
    //     row = grid.insertRow(x)
    //     let y = 0
    //     while( y < boardSize){
    //         // all the code in inner for loop
    //         y++
    //     }
    //     x++
    // }

    for (let x = 0; x < boardSize; x++) {
        row = grid.insertRow(x);    // we make our grid out of cells

        for (let y = 0; y < boardSize; y++) {
            cell = row.insertCell(y);
            cell.onclick = function() { clickCell(this); }; 
            const mine = document.createAttribute("data-mine");     // we allow mines to be placed in the cells for function addMines()
            mine.value = "false";                                   // starting with making all cells NOT mines
            cell.setAttributeNode(mine);            
        }

    }
    return addMines();                                              
}

function addMines() {
    for (let i = 0; i < difficulty; i++) {                          
        const row = Math.floor(Math.random() * 10);
        const col = Math.floor(Math.random() * 10);
        const cell = grid.rows[row].cells[col];
        cell.setAttribute("data-mine", "true");
    }
}
  
function revealMines() {                                            // Highlight all mines in red, will eventually change to 'poop emoji'
    for (let x = 0; x < boardSize; x++) {
        for (let y = 0; y < boardSize; y++) {
            const cell = grid.rows[x].cells[y];
            if (cell.getAttribute("data-mine") == "true") cell.className = "mine";    
        }
    }
}
  
function checkLevelCompletion() {
    let levelComplete = true;
    for (let x = 0; x < boardSize; x++) {
        for (let y = 0; y < boardSize; y++) {
            if ((grid.rows[x].cells[y].getAttribute("data-mine") == "false") && (grid.rows[x].cells[y].innerHTML == "")) levelComplete = false;
        }
    }
    if (levelComplete) {
        alert("You Win!");
        appendDog()             // you earned a doggo
        return revealMines();
    }
}
  
function clickCell(cell) {
    if (cell.getAttribute("data-mine") == "true") {   // check if mine was clicked
        revealMines();
        alert("Game Over");
    } else {
        cell.className = "clicked";                 // count adjacent mines, in order to show the number when clicked
        let mineCount = 0;
        const cellRow = cell.parentNode.rowIndex;
        const cellCol = cell.cellIndex;
        for (let x = Math.max(cellRow - 1, 0); x <= Math.min(cellRow + 1, boardSize - 1); x++) {
            for(let y = Math.max(cellCol - 1, 0); y <= Math.min(cellCol + 1, boardSize - 1); y++) {
                if (grid.rows[x].cells[y].getAttribute("data-mine") == "true") mineCount++;
            }
        }

    cell.innerHTML = mineCount;
    if (mineCount == 0) {                        // we reveal all adjacent cells as they do not have a mine
        for (let x = Math.max(cellRow - 1, 0); x <= Math.min(cellRow + 1, boardSize - 1); x++) {
            for(let y = Math.max(cellCol - 1, 0); y <= Math.min(cellCol + 1, boardSize - 1); y++) {
                if (grid.rows[x].cells[y].innerHTML == "") clickCell(grid.rows[x].cells[y]);
            }
        }
    }
    return checkLevelCompletion();
    }
}


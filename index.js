const randomDogApi = "https://dog.ceo/api/breeds/image/random";     // this should appear when someone wins the game
// const allDogsApi = "https://dog.ceo/api/breeds/list/all";           // dont know if I will use this yet...
const dogImage = document.getElementById('dog')

// MULTIPLE IMAGES FROM A BREED COLLECTION
// https://dog.ceo/api/breed/hound/images/random/3


// Display Stuff:
// 1. populate a board with tiles/mines
// 2. left click on tiles
    // a. Reveal tiles
// 3. right click on tiles
    // a. mark tiles
// 4. check for win/lose


function appendDog () {     // this *should* show us a dog upon winning the game, or clicking 'I deserve a dog'
    fetch(randomDogApi)
    .then(res => res.json())
    .then(data => {
        dogImage.innerHTML = `<img src = "${data.message}" alt = "dog"/>`
    })
}
// function showMeADog(dog) {
    
//     doucment.getElementById('dog').innerHTML = `${dog.message}`
// }

document.addEventListener("DOMContentLoaded", function(){
    document.querySelector("#start-game").addEventListener('click', startGame)  // when we click the "Start Game!" button, the grid should appear (see: function startGame() )
    document.querySelector("#give-me-dog").addEventListener('click', appendDog)
})

let boardSize = 10;     // 
let difficulty = 20;    // mine count

function startGame() {
    //generate grid based on chosen board size
    const grid = document.getElementById("grid");
    grid.innerHTML = " ";

    for (let x = 0; x < boardSize; x++) {
        row = grid.insertRow(x);    // we're gonna make our grid out of cells, like excel/sheets

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
    for (let i = 0; i < difficulty; i++) {                          // adding mines randomly with Math.random
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
            if (cell.getAttribute("data-mine") == "true") cell.className="mine";    // lets us change the appearance of mines within the cell in .css
        }
    }
}
  
function checkLevelCompletion() {
    let levelComplete = true;
    for (let x = 0; x < boardSize; x++) {
        for (let y = 0; y < boardSize; y++) {
            if ((grid.rows[x].cells[y].getAttribute("data-mine")=="false") && (grid.rows[x].cells[y].innerHTML=="")) levelComplete=false;
        }
    }
    if (levelComplete) {
        alert("You Win!");
        appendDog()             // you earned a doggo
        return revealMines();
    }
}
  
function clickCell(cell) {
    //Check if the end-user clicked on a mine
    if (cell.getAttribute("data-mine")=="true") {
        revealMines();
        alert("Game Over");

    } else {
        cell.className = "clicked";
        //Count and display the number of adjacent mines
        let mineCount = 0;
        const cellRow = cell.parentNode.rowIndex;
        const cellCol = cell.cellIndex;
        //alert(cellRow + " " + cellCol);
        for (let x = Math.max(cellRow - 1, 0); x <= Math.min(cellRow + 1, boardSize - 1); x++) {
            for(let y = Math.max(cellCol - 1, 0); y <= Math.min(cellCol + 1, boardSize - 1); y++) {
                if (grid.rows[x].cells[y].getAttribute("data-mine")=="true") mineCount++;
            }
        }

    cell.innerHTML = mineCount;
    if (mineCount == 0) {                        // we reveal all adjacent cells as they do not have a mine
        for (let x = Math.max(cellRow - 1, 0); x <= Math.min(cellRow + 1, boardSize - 1); x++) {
            for(let y = Math.max(cellCol - 1, 0); y <= Math.min(cellCol + 1, boardSize - 1); y++) {
                //Recursive Call
                if (grid.rows[x].cells[y].innerHTML == " ") clickCell(grid.rows[x].cells[y]);
            }
        }
      }
    return checkLevelCompletion();
    }
}


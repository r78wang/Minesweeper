
var time = 0;
var difficultyLevel = 0;
var flagCount = 0;
var clickTime = 0;
var gridInfo = [];
var gameover = 0;

/********************* Class Definition *********************/

function TileInfo (x, y, type, revealOrFlag) {
    this.x = x;
    this.y = y;
    /* type 0 zero mine nearby
     * type 1 one mine nearby
     * type 2 two mines nearby
     * type 3 three mines nearby
     * type 4 four mines nearby
     * type 5 five mines nearby
     * type 6 six mines nearby
     * type 7 seven mines nearby
     * type 8 eight mines nearby
     * type 9 mine
     */
    this.type = type;
    /* revealOrFlag 0 not revealed without flag
     * revealOrFlag 1 revealed
     * revealOrFlag 2 not revealed with flag
     */
    this.revealOrFlag = revealOrFlag;
    this.getLocation = function() {
        return x.toString()+" "+y.toString();
    };
    this.setType = function(type) {
        this.type = type;
    };
    this.isMine = function() {
        if (type == 9) {
            return true;
        } else{
            return false;
        }
    }
    this.changeFlag = function() {
        if (this.revealOrFlag == 0) {
            this.revealOrFlag = 2;
            var tile = document.getElementById(x.toString()+" "+y.toString());
            tile.classList.add("flag");
            setFlag(--flagCount);
        } else if (this.revealOrFlag == 1) {
        } else {
            this.revealOrFlag = 0;
            var tile = document.getElementById(x.toString()+" "+y.toString());
            tile.classList.remove("flag");
            setFlag(++flagCount);
        }
    }
}

/********************* Grid And Tile Related Function *********************/
function buildGrid(columns, rows) {

    // Fetch grid and clear out old elements.
    var grid = document.getElementById("minefield");
    grid.innerHTML = null;


    // Build DOM Grid
    var tile;
    
    for (var y = 0; y < rows; y++) {
        var rowInfo = [];
        for (var x = 0; x < columns; x++) {
            tile = createTile(x,y);
            grid.appendChild(tile);
            var tileMem = new TileInfo(x, y, 0, 0);
            rowInfo.push(tileMem);
        }
        gridInfo.push(rowInfo);
    }
    
    var style = window.getComputedStyle(tile);
    var width = parseInt(style.width.slice(0, -2));
    var height = parseInt(style.height.slice(0, -2));
    grid.style.width = columns * width;
    grid.style.height = rows * height;
}

function createTile(x,y) {
    var tile = document.createElement("div");
    tile.id = x.toString()+" "+y.toString();
    tile.classList.add("tile");
    tile.classList.add("hidden");

    tile.addEventListener("click", handleTileClick); //Left Click
    tile.addEventListener("auxclick", handleTileClick); //Middle Click
    tile.addEventListener("contextmenu", function(e) {e.preventDefault();}); //Right Click

    return tile;
}

function handleTileClick(event) {
    if (gameover == 1) {
        return;
    }
    // Left Click
    if (event.button === 0) {
        var indexArr = this.id.split(" ");
        if (clickTime == 0) {
            plantMines(parseInt(indexArr[0]),parseInt(indexArr[1]));
        }
        clickTime++;
        reveal(parseInt(indexArr[0]),parseInt(indexArr[1]));
        //var indexArr = this.id.split(" ");
        //gridInfo[parseInt(indexArr[1])][parseInt(indexArr[0])];
    }
    // Middle Click
    else if (event.button === 1) {
        var indexArr = this.id.split(" ");
        //TODO try to reveal adjacent tiles
        if (canRevealAdj(parseInt(indexArr[0]), parseInt(indexArr[1]))) {
            revealAdj(parseInt(indexArr[0]), parseInt(indexArr[1]));
        }

    }
    // Right Click
    else if (event.button === 2) {
        //TODO toggle a tile flag
        var indexArr = this.id.split(" ");
        //console.log(gridInfo[parseInt(indexArr[1])][parseInt(indexArr[0])]);
        gridInfo[parseInt(indexArr[1])][parseInt(indexArr[0])].changeFlag();
    }
}

function needToReveal(x, y) {
    var columns = gridInfo[0].length;
    var rows = gridInfo.length;
    
    if (x < 0 || x >= columns || y < 0 || y >= rows 
        || gridInfo[y][x].revealOrFlag > 0 ) {
        return false;
    } 
    return true;
}

function canRevealAdj(x, y) {
    var num = 0;
    if (gridInfo[y][x].revealOrFlag == 1 && gridInfo[y][x].type > 0 
        && gridInfo[y][x].type < 9) {
        
         for (var i = y-1; i <= y+1; i++) {
             for (var j = x-1; j <= x+1; j++) {
                 if (flagThere(j,i)) {
                    num++;
                 }
             }
         }
         if (num === gridInfo[y][x].type) {
            return true;
         }
    }
    return false;
}

function flagThere(x, y) {
    if (x >= 0 && x < gridInfo[0].length 
        && y >= 0 && y < gridInfo.length
        && gridInfo[y][x].revealOrFlag == 2) {
        
        return true;
    } 
    return false;
}

function reveal(xx, yy){
    if (!needToReveal(xx, yy)) return;
    gridInfo[yy][xx].revealOrFlag = 1;
    if (gridInfo[yy][xx].type == 0) {
        revealAdj(xx, yy);
        var tile = document.getElementById(xx.toString()+" "+yy.toString());
        tile.classList.remove("hidden");
    } else if (gridInfo[yy][xx].type == 1) {
        var tile = document.getElementById(xx.toString()+" "+yy.toString());
        tile.classList.add("tile_1");
    } else if (gridInfo[yy][xx].type == 2) {
        var tile = document.getElementById(xx.toString()+" "+yy.toString());
        tile.classList.add("tile_2");
    } else if (gridInfo[yy][xx].type == 3) {
        var tile = document.getElementById(xx.toString()+" "+yy.toString());
        tile.classList.add("tile_3");
    } else if (gridInfo[yy][xx].type == 4) {
        var tile = document.getElementById(xx.toString()+" "+yy.toString());
        tile.classList.add("tile_4");
    } else if (gridInfo[yy][xx].type == 5) {
        var tile = document.getElementById(xx.toString()+" "+yy.toString());
        tile.classList.add("tile_5");
    } else if (gridInfo[yy][xx].type == 6) {
        var tile = document.getElementById(xx.toString()+" "+yy.toString());
        tile.classList.add("tile_6");
    } else if (gridInfo[yy][xx].type == 7) {
        var tile = document.getElementById(xx.toString()+" "+yy.toString());
        tile.classList.add("tile_7");
    } else if (gridInfo[yy][xx].type == 8) {
        var tile = document.getElementById(xx.toString()+" "+yy.toString());
        tile.classList.add("tile_8");
    } else {
        var tile = document.getElementById(xx.toString()+" "+yy.toString());
        tile.classList.add("mine_hit");
        endGame(0);
    }
    if (checkWin()) {
        endGame(1);
    }
}

function revealAdj(xx, yy) {
    reveal(xx-1,yy-1);
    reveal(xx-1,yy+1);
    reveal(xx+1,yy-1);
    reveal(xx+1,yy+1);
    reveal(xx,yy-1);
    reveal(xx,yy+1);
    reveal(xx-1,yy);
    reveal(xx+1,yy);
}


function revealAllMine() {
    for (var y = 0; y < gridInfo.length; y++) {
        for (var x = 0; x < gridInfo[y].length; x++) {
            if (gridInfo[y][x].revealOrFlag == 2 && gridInfo[y][x].type != 9) {
                var tile = document.getElementById(x.toString()+" "+y.toString());
                tile.classList.add("mine_marked");
            } else if (gridInfo[y][x].revealOrFlag == 0 && gridInfo[y][x].type == 9) {
                var tile = document.getElementById(x.toString()+" "+y.toString());
                tile.classList.add("mine");
            } else {
                continue;
            }
        }
    }
}

function checkWin(){
    for (var y = 0; y < gridInfo.length; y++) {
        for (var x = 0; x < gridInfo[y].length; x++) {
            if (gridInfo[y][x].revealOrFlag != 1 && gridInfo[y][x].type != 9) {
                return false;
            }
        }
    }
    return true;
}

/********************* Grid And Tile Related Function *********************/

function startGame() {
    gameover = 0;
    smileyLoseRecover();
    smileyWinRecover();
    clickTime = 0;
    gridInfo = [];
    if (difficultyLevel === 0) {
        buildGrid(9, 9);
        setFlag(10);
    } else if (difficultyLevel === 1) {
        buildGrid(16,16);
        setFlag(40);
    } else {
        buildGrid(30,16);
        setFlag(99);
    }
    startTimer();
}


function endGame(winOrNot) {
    stopTimer();
    gameover = 1;
    revealAllMine();
    if (winOrNot) {
        smileyWin();
        alert("Congradulation! You win! Completion time: "+timeValue);
    } else {
        smileyLose();
        alert("Sorry! You lost! Completion time: "+timeValue);
    }
}

/********************* Set Element *********************/

function setFlag(setNumber) {
    flagCount = setNumber;
    document.getElementById("flagCount").innerHTML = flagCount;
}

function smileyWin() {
    var smiley = document.getElementById("smiley");
    smiley.classList.add("face_win");
}

function smileyWinRecover() {
    var smiley = document.getElementById("smiley");
    smiley.classList.remove("face_win");
}

function smileyLose() {
    var smiley = document.getElementById("smiley");
    smiley.classList.add("face_lose");
}

function smileyLoseRecover() {
    var smiley = document.getElementById("smiley");
    smiley.classList.remove("face_lose");
}

function smileyDown() {
    var smiley = document.getElementById("smiley");
    smiley.classList.add("face_down");
}

function smileyUp() {
    var smiley = document.getElementById("smiley");
    smiley.classList.remove("face_down");
}

function smileyAddLimbo() {
    var smiley = document.getElementById("smiley");
    smiley.classList.add("face_limbo");
}

function smileyRemoveLimbo() {
    var smiley = document.getElementById("smiley");
    smiley.classList.remove("face_limbo");
}

function smileyAddLimbo(index) {
    var smiley = document.getElementById("smiley");
    smiley.classList.add("face_limbo");
}

function smileyRemoveLimbo(index) {
    var smiley = document.getElementById("smiley");
    smiley.classList.remove("face_limbo");
}

function setDifficulty() {
    var difficultySelector = document.getElementById("difficulty");
    var difficulty = event.target.selectedIndex;
    //TODO implement me
    if(difficulty == 0){
        difficultyLevel = 0;
    }
    else if(difficulty == 1){
        difficultyLevel = 1;
    }
    else{
        difficultyLevel = 2;
    }
    
}

/*************** Timer Related Function Definiation*****************/
function startTimer() {
    timeValue = 0;
    window.clearInterval(time);
    time = window.setInterval(onTimerTick, 1000);
}

function onTimerTick() {
    timeValue++;
    updateTimer();
}

function updateTimer() {
    document.getElementById("timer").innerHTML = timeValue;
}
function stopTimer() {
    clearInterval(time);
}


/*************** Mine Initilization *****************/
function randomNumber(max) {
        return Math.floor((Math.random() * max));
}

function plantMines(noMineX,noMineY) {

    var minesPlanted = 0, columns, rows, mines;
    
    if (difficultyLevel == 0) {
        columns = 9;
        rows = 9;
        mines = 10;
    } else if (difficultyLevel == 1) {
        columns = 16;
        rows = 16;
        mines = 40;
    } else {
        columns = 30;
        rows = 16;
        mines = 99;
    }

    while (minesPlanted < mines) {
        var x = randomNumber(columns);
        var y = randomNumber(rows);

        if ((x>=noMineX-1 && x<=noMineX+1)
            && (y>=noMineY-1 && y<=noMineY+1)){
            continue;
        }

        if (gridInfo[y][x].type != 9){
            gridInfo[y][x].type = 9;
            minesPlanted++;
            console.log(x+','+y);
            neighborSetup(x,y,rows,columns);
        }
    }
}

function neighborSetup(x, y, rows,cols) {
    if (x-1 >= 0 && gridInfo[y][x-1].type < 8) {
        gridInfo[y][x-1].type++;
    }
    if (x+1 < cols && gridInfo[y][x+1].type < 8) {
        gridInfo[y][x+1].type++;
    }
    if (y-1 >= 0 && gridInfo[y-1][x].type < 8) {
        gridInfo[y-1][x].type++;
    }
    if (y+1 < rows && gridInfo[y+1][x].type < 8) {
        gridInfo[y+1][x].type++;
    }
    if (y+1 < rows && x+1 < cols && gridInfo[y+1][x+1].type < 8) {
        gridInfo[y+1][x+1].type++;
    }
    if (y+1 < rows && x-1 >= 0 && gridInfo[y+1][x-1].type < 8) {
        gridInfo[y+1][x-1].type++;
    }
    if (y-1 >= 0 && x+1 < cols && gridInfo[y-1][x+1].type < 8) {
        gridInfo[y-1][x+1].type++;
    }
    if (y-1 >= 0 && x-1 >= 0 && gridInfo[y-1][x-1].type < 8) {
        gridInfo[y-1][x-1].type++;
    }

}

function createGrid(rows, cols) {
    var gameTable = document.createElement('table');
    gameTable.setAttribute('id', 'gameTable');
    gameTable.setAttribute('class', 'table table-bordered');
    for(var i = 0; i < rows; i++) {
        gameTable.appendChild(createRow(i, cols));
    }
    document.getElementById('index').appendChild(gameTable);
}

function remove(array, id)
{
    // console.log(array.some(a => a.id == id));
    arr = [];
    array.forEach(element => {
        if(element.id != id)
        {
            arr.push(element);
        }
    });

    return arr;
}

//Update Square to json object, change the background color, and push to array of alive or remove from
function updateSquare(Id, row, col) {
    var eventElement = document.getElementById(Id);
    color = eventElement.style['background-color'];
    if(color != 'grey')
    {
        eventElement.style['background-color'] = 'grey';
        alive.push({id: Id, row: row, col: col});
    }
    else 
    {
        eventElement.style['background-color'] = 'white';
        alive = [...remove(alive, Id)];
    }
    // console.log(alive);
}

function createRow(index, cols) {
    var tr = document.createElement('tr');
    rowNum = "row_" + index;
    tr.setAttribute('id', rowNum);
    for(var i = 0; i < cols; i++)
    {
        tr.appendChild(createCell(i, index));
    }
    return tr;
}

function createCell(col, row) {
    var td = document.createElement('td');
    cellNum = "row" + row + "_col" + col;
    td.setAttribute('id', cellNum);
    td.setAttribute('onclick', 'updateSquare("' + cellNum + '", ' + row + ', ' + col + ')');
    all.push({id: cellNum, row: row, col: col});
    return td;
}

function resetDom(arr) {
    reset();
    arr.forEach(element => {
        updateSquare(element.id, element.row, element.col);
    });
}

function clearBoard() {
    document.getElementById('index').innerHTML = '';
    createGrid(num_rows, num_cols);
}

function compareHistory() {
    if(q[0].length == q[2].length) {
        var b1 = q[0].reduce((acc, curr) => acc + curr);
        var b2 = q[2].reduce((acc, curr) => acc + curr);

        if(b1 == b2) {
            // add POPUP;**************************************************
        }
    }
}

function addtoHistory() {
    hist = []
    alive.forEach(element => {
        hist.push(element.row*(num_cols-1) + element.col);
    })
    if(q.length < 3)
    {
        q.enqueue(hist);
    }
    else 
    {
        q.dequeue();
        q.enqueue(hist);
    }
}

function startGame() {
    if (alive.length == 0) {
        window.alert('You must select some squares');
        return;
    }

    $(window).scrollTop(0);

    updateBoard();
}

function updateBoard() {
    if (alive.length > 0)
    {
        getBoard();
        // addtoHistory();
        // compareHistory();
        setTimeout(updateBoard, 100);
    }

    
}

function getBoard() {
    newAlive = [];
        // console.log("Up top, newAlive.length: ", newAlive.length);
    // window.alert('All length ' + all.length);
    all.forEach(element => {
        var lives = '';
        if(alive.some(a => a.id == element.id)) {
            lives = checkCell(element, true);
            if(lives == 'alive')
            {
                newAlive.push(element);
            }
        }
        else {
            lives = checkCell(element, false);
            if(lives == 'alive')
            {
                newAlive.push(element);
            }
        }
    });

    // console.log("LJLFKJSL", alive.length, 'newAlive length: ', newAlive)

    resetDom(newAlive);
}

function checkCell(element, isAlive) {
    var neighbors = getLivingNeighbors(element);
    if(isAlive)
    {
        if(neighbors == 2 || neighbors == 3) 
        {
            return 'alive';
        }

        return 'dead';
    }
    else 
    {
        if(neighbors == 3) 
        {
            return 'alive';
        }

        return 'dead';
    }
}

function getLivingNeighbors(cell) {
    ns = [];
    n = 0;
    isTop = cell.row == 0;
    isRight = cell.col == num_cols-1;
    isBottom = cell.row == num_rows-1;
    isLeft = cell.col == 0;
    if(!isTop) { ns.push(findCell((cell.row)-1, (cell.col))); }
    if(!(isTop || isRight)) { ns.push(findCell((cell.row)-1, (cell.col)+1)); }
    if(!isRight) { ns.push(findCell(cell.row , (cell.col)+1)); }
    if(!(isBottom || isRight)) { ns.push(findCell((cell.row)+1, (cell.col)+1)); }
    if(!isBottom) {ns.push(findCell((cell.row)+1, cell.col)); }
    if(!(isBottom || isLeft)) {ns.push(findCell((cell.row)+1, (cell.col)-1)); }
    if(!isLeft) {ns.push(findCell(cell.row, (cell.col)-1)); }
    if(!(isTop || isLeft)) { ns.push(findCell((cell.row)-1, (cell.col)-1)); }
    // console.log(ns.length)
    ns.forEach(neighbor => {
        if(alive.some(element => element.id == neighbor.id))
        {
            // console.log(neighbor.id, 'true')
            n += 1;
        }
    });
    // console.log(n)
    return n;
}

function findCell(row, col)
{
    // console.log(row, col);
    var index = all.findIndex(a => (a.row == row && a.col == col));
    return all[index];
}

function reset() {
    document.getElementById('index').innerHTML = '';
    alive = [];
    all = [];
    createGrid(num_rows, num_cols);
}

function randomGame() {
    reset();
    const numItems = Math.floor(Math.random() * 1740) + 1;
    for(var i = 0; i < numItems; i++) {
        var square = generateRandSquare();
        if (!alive.some(a => a.id == square.id))
        {
            updateSquare(square.id, square.row, square.col);
        }
        else 
        {
            while(alive.some(a => a.id == square.id))
            {
                square = generateRandSquare();
            }
            updateSquare(square.id, square.row, square.col);
        }
    }
}

function generateRandSquare() {
    var randRow = Math.floor(Math.random() * num_rows);
    var randCol = Math.floor(Math.random() * num_cols);
    var randId = 'row' + randRow + '_col' + randCol;
    return {id: randId, row: randRow, col: randCol};
}


function specialGame() {
    //start with a popup and listen for an h for helen
    //display a B, then go into a heart and start the game
    //eventually after a certain amount of time do another popup with a rip brigid message
}

function main()
{
    num_rows = 29;
    num_cols = 60;
    all = [];
    alive = [];
    createGrid(num_rows, num_cols);
    let q = new Queue();
}



function Queue() {
    this.elements = [];
}

Queue.prototype.enqueue = function (e) {
    this.elements.push(e);
};

// remove an element from the front of the queue
Queue.prototype.dequeue = function () {
    return this.elements.shift();
};

// check if the queue is empty
Queue.prototype.isEmpty = function () {
    return this.elements.length == 0;
};

// get the element at the front of the queue
Queue.prototype.peek = function () {
    return !this.isEmpty() ? this.elements[0] : undefined;
};

Queue.prototype.length = function() {
    return this.elements.length;
};



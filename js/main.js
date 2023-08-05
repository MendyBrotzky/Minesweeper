'use strict'

const EMPTY = ' '
const MINE = '💣'
const FLAGE = '🚩'
const LOSE_FACE = '😪'
const WIN_FACE = '😎'
var gTimerInterval

var gBoard
var gNegsCount = 0

var gLevel = {
  SIZE: 4,
  MINES: 2
}

var gGame = {
  isOn: true,
  shownCount: 0,
  markedCount: 0,
  secsPassed: 0,

}



function onInIt() {
  clearInterval(gTimerInterval)
  gGame.isOn = true
  gGame.markedCount = 0
  gGame.shownCount = 0
  gBoard = buildBoard()
  setMinesRandomly(gBoard)
  countNegsAroundCell(gBoard)
  renderBoard(gBoard)
}


function buildBoard(levelSize) {
  const board = []

  for (var i = 0; i < gLevel.SIZE; i++) {
    board[i] = []
    for (var j = 0; j < gLevel.SIZE; j++) {
      board[i][j] = {
        type: EMPTY,
        location: { i: i, j: j },
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: false

      }
    }

  }

  ///    rando mines bring back       /////
  /////////////////////////////////////////////////////////////////////
  // for(var k = 0 ; k < gLevel.MINES; k++){                      /////
  //   var currEmptyCell = findEmptyCells()                       /////
  //   board[currEmptyCell[0].i][currEmptyCell[0].j].type = MINE  /////
  /////
  // }                                                           //////
  ////////////////////////////////////////////////////////////////////////

  // board[0][1].type = MINE
  // board[0][1].isMine = true
  // board[1][3].type = MINE
  // board[1][3].isMine = true
  return board
}


function renderBoard() {

  var elBoard = document.querySelector('.board')

  var strHTML = ''
  for (var i = 0; i < gLevel.SIZE; i++) {
    strHTML += `<tr>\n`

    for (var j = 0; j < gLevel.SIZE; j++) {
      var className = getClassName({ i: i, j: j })
      strHTML += `<td class="cell ${className} "  onclick="onCellClicked(this , ${i},${j})" oncontextmenu="event.preventDefault() , addFlage(this ,${i},${j})"></td>`
    }
  }
  strHTML += `</tr>`
  elBoard.innerHTML = strHTML

}

function countNegsAroundCell(board) {
  var allTheCells = []

  for (var row = 0; row < gLevel.SIZE; row++) {
    for (var col = 0; col < gLevel.SIZE; col++) {
      allTheCells.push({ i: row, j: col })
      // console.log(allTheCells)
    }
  }

  var minesCount = 0
  for (var m = 0; m < allTheCells.length - 1; m++) {
    var rowIdx = allTheCells[m].i
    var colIdx = allTheCells[m].j

    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
      if (i < 0 || i >= gLevel.SIZE) continue
      for (var j = colIdx - 1; j <= colIdx + 1; j++) {
        if (j < 0 || j >= gLevel.SIZE) continue
        if (i === rowIdx && j === colIdx) continue
        if (board[i][j].type === MINE) {
          minesCount++
        }
      }
    }
    board[rowIdx][colIdx].minesAroundCount = minesCount
    minesCount = 0
  }
}


function onCellClicked(elCell, i, j) {
  if (gGame.isOn === false) {
    return
  }

  gTimerInterval = setInterval(timer)
  checkGameOver(gBoard)
  // if (gGame.isOn === false) {
  //   // console.log(i, j);
  //   // console.log(gBoard[i][j])
  //   gGame.isOn = true
  //   // gBoard[i][j].type = EMPTY
  //   // elCellsWithMine.innerText = gBoard[i][j].type
  //   // elCellsWithMine.style.backgroundColor = 'blue'
  //   return
  // }


  elCellsWithMine = document.querySelector(`.cell-${i}-${j}`)
  var elCellsWithMine = document.querySelector(`.cell-${i}-${j}`)
  var currCell = gBoard[i][j]
  if (currCell.isShown || currCell.isMarked) {

    return
  }


  if (currCell.type === MINE) {
    var elResetBtn = document.querySelector('.reset')
    elResetBtn.innerText = LOSE_FACE
    clearInterval(gTimerInterval)
    console.log('Game is over!');
    // checkGameOver()
    gGame.isOn = false
    elCell.innerText = currCell.type
    currCell.isShown = true
    for (var i = 0; i < gLevel.SIZE; i++) {
      for (var j = 0; j < gLevel.SIZE; j++) {
        if (gBoard[i][j].type === MINE) {
          elCellsWithMine = document.querySelector(`.cell-${i}-${j}`)
          elCellsWithMine.innerText = currCell.type
        }
      }
    }

  } else if (currCell.minesAroundCount > 0) {
    elCell.innerText = currCell.minesAroundCount
    currCell.isShown = true



  } else {
    elCell.style.backgroundColor = 'blue'
    currCell.isShown = true

  }

  if (currCell.type === EMPTY && currCell.minesAroundCount === 0 /* && !currCell.isShown */) {
    currCell.isShown = true


    var rowIdx = i
    var colIdx = j

    for (var m = rowIdx - 1; m <= rowIdx + 1; m++) {
      if (m < 0 || m >= gLevel.SIZE) continue
      for (var n = colIdx - 1; n <= colIdx + 1; n++) {
        if (n < 0 || n >= gLevel.SIZE) continue
        if (m === rowIdx && n === colIdx) continue


        var elNewCell = document.querySelector(`.cell-${m}-${n}`)
        if (gBoard[m][n].minesAroundCount > 0) {
          elNewCell.innerText = gBoard[m][n].minesAroundCount
          gBoard[m][n].isShown = true


        } else {
          elNewCell.style.backgroundColor = 'blue'
          gBoard[m][n].isShown = true

        }
        // var nRowIdx = gBoard[m][n].location.i
        // var nColIdx = gBoard[m][n].location.j

        // for (var k = nRowIdx - 1; k <= nRowIdx + 1; k++) {
        //   if (k < 0 || k >= gLevel.SIZE) continue
        //   for (var l = nColIdx - 1; l <= nColIdx + 1; l++) {
        //     if (l < 0 || l >= gLevel.SIZE) continue
        //     if (k === nRowIdx && l === nColIdx) continue
        //   }
        // }
      }
    }
  }
}


function addFlage(elCell, i, j) {
  if (gGame.isOn === false) {
    return
  }

  var currCell = gBoard[i][j]

  if (!currCell.isMarked && !currCell.isShown) {
    elCell.innerText = FLAGE
    currCell.isMarked = true
    gGame.markedCount++
    console.log('gGame.markedCount:', gGame.markedCount);
  } else if (currCell.isMarked) {
    elCell.innerText = EMPTY
    currCell.isMarked = false
    gGame.markedCount--
    console.log(gGame.markedCount);
  }
}


function checkGameOver(board) {
  if (gGame.markedCount === gLevel.MINES &&
    (gGame.shownCount === gLevel.SIZE ** 2) - gLevel.MINES) {
    gGame.isOn = false
    var elResetBtn = document.querySelector('.reset')
    elResetBtn.innerText = WIN_FACE
    console.log('you Won!')
  }
}

function getClassName(location) {
  const cellClass = 'cell-' + location.i + '-' + location.j
  return cellClass
}

function setMinesRandomly(board) {
  for (var k = 0; k < gLevel.MINES; k++) {
    var currEmptyCell = findEmptyCells()
    board[currEmptyCell[0].i][currEmptyCell[0].j].type = MINE
  }


}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}



function findEmptyCells() {
  var allTheCells = []

  for (var row = 0; row < gLevel.SIZE; row++) {
    for (var col = 0; col < gLevel.SIZE; col++) {
      allTheCells.push({ i: row, j: col })
    }
  }
  const shuffledArray = allTheCells.sort((a, b) => 0.5 - Math.random());
  // console.log(allTheCells)
  return allTheCells
}

function timer() {
  var startTime = Date.now()

  gTimerInterval = setInterval(() => {
    var elapsedTime = Date.now() - startTime
    document.querySelector('.clock').innerText = (
      elapsedTime / 1000
    ).toFixed(3)
  }, 37)
}


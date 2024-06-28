// NOTE: this example uses the chess.js library:
// https://github.com/jhlywa/chess.js

var board = null
var game = new Chess()

var course_index = 0;
var move_index = 0;

let data = null;
let moves = [];

const count = document.getElementById("count");
const dialog = document.getElementById("course_end");

async function fetchData() {
  try {
      let url = window.location.pathname;
      url = url.slice(10);
      const response = await fetch(`/moves/${url}`);
      const jsonData = await response.json();
      data = jsonData;
      for(let i = 0; i < data.len; i++){
        var array = data.moves[i].split('/').filter(function(element) {
          return element !== '';
        });
        moves.push(array);
      }
      count.textContent = `${course_index}/${data.len}`;
      check_side();
  } catch (error) {
      console.error('Error al obtener los datos:', error);
  }
}

fetchData()

function onDragStart (source, piece, position, orientation) {
  // do not pick up pieces if the game is over
  if (game.game_over()) return false

  // only pick up pieces for White
  if ((board.orientation() === 'white' && piece.search(/^b/) !== -1) ||
      (board.orientation() === 'black' && piece.search(/^w/) !== -1)) {
    return false
  }
}


function course_move () {
  if (are_next_move()){
    game.move(moves[course_index][move_index]);
    move_index ++;
    if (!are_next_move()){
      task_complete();
    }
  }
  else {
    task_complete();
  }
}

function onDrop (source, target) {

  var user_move_san = fromToToSAN(source,target)
  if (!(user_move_san === moves[course_index][move_index])){
    return 'snapback'
  }   

  // see if the move is legal
  var move = game.move({
    from: source,
    to: target,
    promotion: 'q' // NOTE: always promote to a queen for example simplicity
  })

  // illegal move
  if (move === null) return 'snapback'

  move_index ++;
  course_move()
}

// update the board position after the piece snap
// for castling, en passant, pawn promotion
function onSnapEnd () {
  board.position(game.fen())
}

function fromToToSAN(from, to) {
  const moves = game.moves({ verbose: true });
  for (let i = 0; i < moves.length; i++) {
      if (moves[i].from === from && moves[i].to === to) {
          return moves[i].san;
      }
  }
  return null;
}

function are_next_move() {
  return moves[course_index][move_index]
}

function task_complete() {
  setTimeout(function(){
  move_index = 0;
  course_index ++;
  game.reset();
  board.start();
  count.textContent = `${course_index}/${data.len}`;
  if (course_index == data.len)dialog.showModal();
  check_side();
  }, 500);
}

function check_side() {
  board.orientation(data.sides[course_index]);
  if (board.orientation() === 'black')course_move();
  board.position(game.fen());
}

var config = {
  draggable: true,
  position: 'start',
  onDragStart: onDragStart,
  onDrop: onDrop,
  onSnapEnd: onSnapEnd
}
board = Chessboard('myBoard', config)


document.getElementById("button__skip").addEventListener("click", function(event) {
  
  show_move();

})

document.getElementById("button__reset").addEventListener("click", function(event) {
  location.reload();
})


function show_move(){
  setTimeout(() => {
    if (are_next_move()){
      game.move(moves[course_index][move_index]);
      move_index ++;
      if (!are_next_move()){
        task_complete();
      }
      else{
        show_move()
      }
    }
    else {
      task_complete();
    }
    board.position(game.fen());
  }, 1000);
}
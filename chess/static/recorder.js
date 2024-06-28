// NOTE: this example uses the chess.js library:
// https://github.com/jhlywa/chess.js

var board = null
var game = new Chess()
var $pgn = $('#pgn')
var $side = $('#side')

function onDragStart (source, piece, position, orientation) {
  // do not pick up pieces if the game is over
  if (game.game_over()) return false

  // only pick up pieces for the side to move
  if ((game.turn() === 'w' && piece.search(/^b/) !== -1) ||
      (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
    return false
  }
}

function onDrop (source, target) {
  // see if the move is legal
  var move = game.move({
    from: source,
    to: target,
    promotion: 'q' // NOTE: always promote to a queen for example simplicity
  })

  // illegal move
  if (move === null) return 'snapback'

  $pgn.html(game.pgn())

}

// update the board position after the piece snap
// for castling, en passant, pawn promotion
function onSnapEnd () {
  board.position(game.fen())
}

var config = {
  draggable: true,
  position: 'start',
  orientation: $side[0].innerText ,
  onDragStart: onDragStart,
  onDrop: onDrop,
  onSnapEnd: onSnapEnd
}

board = Chessboard('myBoard', config)
game.load_pgn($pgn[0].innerText)
board.position(game.fen())

underline()

document.getElementById("button__new").addEventListener("click", function(event) {

  let url = window.location.pathname;
  url = url.slice(9);
  let end = url.indexOf("/");
  let task = url.slice(end+1);
  url = url.slice(0, end);
  

  fetch(`/new/${url}`,{
    method : "POST"
  })
  .then(response=>response.json())
  .then(data=>{
    pk = data.id;
	url = `/courses/${url}/${pk}`
    history.pushState(null, "", url);
  })
  .then(data=>{
	const container = document.querySelector("#courses__list");
	const course = document.createElement("li");
	const link = document.createElement("a");
	const last_item = container.querySelector("#courses__list li:last-child");
	const last_link = last_item.querySelector('a');
	last_link.style.textDecoration = "none";
	link.href = url;
	link.textContent = parseInt(last_link.textContent) + 1;
	link.className = "courses__link";
	link.id = parseInt(task) + 1;
	course.className = "courses__item"
	course.appendChild(link);
	container.appendChild(course);
  })
  .then(data=>{
	underline();
  })
  
  board.start();
  game.reset();
  $pgn.html(game.pgn());

})


document.getElementById("button__switch").addEventListener("click", function(event){

	board.flip();


})

document.getElementById("button__reset").addEventListener("click", function(event){

	board.start();
	game.reset();
	$pgn.html(game.pgn())

})

document.getElementById("button__save").addEventListener("click", function(event){

	let orientation = board.orientation();


	const moves = game.history();
	const pgn = game.pgn();

	let url = window.location.pathname;
	url = url.slice(9);
	let end = url.indexOf("/");
	
	let task = url.slice(end)

	url = url.slice(0, end);

	fetch(`/save/${url}${task}`,{
		method : "POST",
		body: JSON.stringify({
			"side" :  orientation,
			"moves" : moves,
			"pgn" : pgn
		})
	})

})

document.getElementById("button__delete").addEventListener("click", function(event){


	let url = window.location.pathname;
	url = url.slice(9);
	let end = url.indexOf("/");
	
	let task = url.slice(end)

	url = url.slice(0, end);

	fetch(`/delete/${url}${task}`,{
		method : "POST"
	})
	.then(a=>{location.reload();})

})

function underline() {
	let url = window.location.pathname;
	url = url.slice(9);
	let end = url.indexOf("/");
	let task = url.slice(end+1);

	var task_li = document.getElementById(task);
	task_li.style.textDecoration = "underline";
}
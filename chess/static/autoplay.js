var board = Chessboard('myBoard', {
    draggable: false,
    position: 'start'
});



const thresholdWidth = 1000;

var game = new Chess();


const moves = ['e4','c5','Nf3','d6','d4','cxd4','Nxd4','Nf6','f3','e5','Nb3','Be7','c4','a5','Be3','a4','Nc1','O-O','Nc3','Qa5','Qd2','Na6','Be2','Nc5','O-O','Bd7','Rb1','Rfc8','b4','axb3','axb3','Qd8','Nd3','Ne6','Nb4','Bc6','Rfd1','h5','Bf1','h4','Qf2','Nd7','g3','Ra3','Bh3','Rca8','Nc2','R3a6','Nb4','Ra5','Nc2','b6','Rd2','Qc7','Rbd1','Bf8','gxh4','Nf4','Bxf4','exf4','Bxd7','Qxd7','Nb4','Ra3','Nxc6','Qxc6','Nb5','Rxb3','Nd4','Qxc4','Nxb3','Qxb3','Qe2','Be7','Kg2','Qe6','h5','Ra3','Rd3','Ra2','R3d2','Ra3','Rd3','Ra7','Rd5','Rc7','Qd2','Qf6','Rf5','Qh4','Rc1','Ra7','Qxf4','Ra2+','Kh1','Qf2','Rc8+','Kh7','Qh6+'];
  
  

function animateMoves(index) {
    if (index < moves.length) {
        setTimeout(function() {
            game.move(moves[index]);
            board.position(game.fen());
            if (window.innerWidth > thresholdWidth) {
                animateMoves(index + 1);
            }
        }, 1500);
    }
}


animateMoves(0);
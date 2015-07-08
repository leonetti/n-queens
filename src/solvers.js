/*           _
   ___  ___ | |_   _____ _ __ ___
  / __|/ _ \| \ \ / / _ \ '__/ __|
  \__ \ (_) | |\ V /  __/ |  \__ \
  |___/\___/|_| \_/ \___|_|  |___/

*/

// hint: you'll need to do a full-search of all possible arrangements of pieces!
// (There are also optimizations that will allow you to skip a lot of the dead search space)
// take a look at solversSpec.js to see what the tests are expecting


// return a matrix (an array of arrays) representing a single nxn chessboard, with n rooks placed such that none of them can attack each other
window.findSolution = function( row, n, board, conflictType, callback ){
  // base case if you reach end of rows
  if( row === n ){

    // increment solutionCount by one or return spliced array
    callback()
    //stop
    return;

  }

  // iterate through each board
  for( var i = 0; i < n; i++ ){
    //toggle piece
    board.togglePiece( row, i );
    //recurse through further solutions if board doesn't have any conflicts
    if( !board[conflictType]() ){
      findSolution( row + 1, n, board, conflictType, callback);
    }
    //toggle piece back
    board.togglePiece( row, i );
  }

}

window.findNRooksSolution = function(n) {
  var board = new Board({n: n});
  var solution = [];
  findSolution(0, n, board, 'hasAnyRooksConflicts', function(){
     solution = board.rows().map(function(row){
       return row.slice();
     });
  });
  return solution;
};



// return the number of nxn chessboards that exist, with n rooks placed such that none of them can attack each other
window.countNRooksSolutions = function(n) {
  var solutionCount = 0;
  var board = new Board( { n: n } );
  



  findSolution(0, n, board, 'hasAnyRooksConflicts', function(){
    solutionCount++;
  });

  console.log('Number of solutions for' + n + 'rooks:', solutionCount);
  return solutionCount;
};



// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function(n) {
  var board = new Board({n: n});
  var solution = board.rows();
  findSolution(0, n, board, 'hasAnyQueensConflicts', function(){
     solution = board.rows().map(function(row){
       return row.slice();
     });
  });
  return solution;
};


// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function(n) {
  var solutionCount = 0;
  var board = new Board( { n: n } );


  findSolution(0, n, board, 'hasAnyQueensConflicts', function(){
    solutionCount++;
  });

  return solutionCount;
};

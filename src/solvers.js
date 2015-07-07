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

window.findNRooksSolution = function(n) {
  // create board
  var board = new Board({n: n});

  var checkEachArray = function(currentRow){
    for(var i=0; i<currentRow.length; i++){
      currentRow[i] = 1;
      if(board.hasAnyRooksConflicts()){
        currentRow[i] = 0;
      }
    }
  }

  for(var i=0; i<board.rows().length; i++){
    checkEachArray(board.rows()[i]);
  }

  return board.rows();
};



// return the number of nxn chessboards that exist, with n rooks placed such that none of them can attack each other
window.countNRooksSolutions = function(n) {
  var solutionCount = 1;

  while (n>1) {
    solutionCount *= n;
    n--;
  }

  console.log('Number of solutions for ' + n + ' rooks:', solutionCount);
  return solutionCount;
};



// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function(n) {
  var board = new Board({n: n});
  var queens = 0;
  var iterator = 0;
  var foundSolution;

  if(n===0){
    return [];
  }

  var checkEachArray = function(currentBoard){
    for(var i=0; i<n; i++){
      var currentRow = currentBoard.rows()[i];

      for(var j=0; j<currentRow.length; j++){
        currentRow[j] = 1;
        queens++;
        if(board.hasAnyQueensConflicts()){
          currentRow[j] = 0;
          queens--;
        }
      }
    }
    console.log(queens);
    console.dir(board);
    if(queens === n){
      foundSolution = board.rows();
    } else {
      board = new Board({n: n});
      iterator++;
      queens = 0;
      if(iterator < n){
        board.attributes[0][iterator] = 1;
        checkEachArray(board);
      }
    }


  };


  board.rows()[0][iterator] = 1;

  checkEachArray(board);

  

  
  
  // recursive function(board, rowIndex, colIndex, queensOnBoard)
      // check if Queens conflict at rowIndex, colIndex
      // if no conflict, set board at rowIndex and colIndex
        // queensOnBoard += 1
        // recursive function(board, rowIndex)
      // else if conflict, recursive function(board, rowIndex, colIndex + 1)



  // do{
  //   for (var i=0; i < board.rows().length; i++) {
  //     checkEachArray(board.rows()[i], index);
  //   }
  //   index++;
  // }while(queens !== n);

  console.log('Single solution for ' + n + ' queens:', JSON.stringify(foundSolution));
  return foundSolution;
};


// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function(n) {
  var solutionCount = undefined; //fixme

  console.log('Number of solutions for ' + n + ' queens:', solutionCount);
  return solutionCount;
};

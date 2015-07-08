// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function() {

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;','color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;','color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    rows: function() {
      return _(_.range(this.get('n'))).map(function(rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    togglePiece: function(rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function() {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function(rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function() {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function(rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },


/*
         _             _     _
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
    / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
    \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
    |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)
 */
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    // test if a specific row on this board contains a conflict
    hasRowConflictAt: function(rowIndex) {
      var row = this.get(rowIndex);
      var count = 0;

      for( var i = 0; i < row.length; i++ ) {
        count += row[i];
      }

      return count > 1;
    },

    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function() {
      var size = this.get('n');

      for( var i = 0; i < size; i++ ) {
        if( this.hasRowConflictAt(i) ) {
          return true;
        }
      }

      return false;
    },



    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function(colIndex) {
      var size = this.get('n');
      var count = 0;

      for( var i = 0; i < size; i++ ) {
        var row = this.get(i);
        count += row[colIndex];
      }

      return count > 1;
    },

    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function() {
      var size = this.get('n');

      for( var i = 0; i < size; i++ ) {
        if( this.hasColConflictAt(i) ) {
          return true;
        }
      }

      return false;
    },



    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    hasMajorDiagonalConflictAt: function(majorDiagonalColumnIndexAtFirstRow) {
      var size = this.get('n');
      var count = 0;
      var rowIdx = 0;
      var colIdx = majorDiagonalColumnIndexAtFirstRow;

      for( ; rowIdx < size && colIdx < size; rowIdx++, colIdx++ ){
        if( colIdx >= 0 ) {
          var row = this.get(rowIdx);
          count += row[colIdx];
        }
      }

      return count > 1;
    },

    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function() {
      var size = this.get('n');

      for( var i = 1 - size; i < size; i++ ) {
        if( this.hasMajorDiagonalConflictAt(i) ) {
          return true;
        }
      }

      return false;
    },



    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function(minorDiagonalColumnIndexAtFirstRow) {
      var size = this.get('n');
      var count = 0;
      var rowIdx = 0;
      var colIdx = minorDiagonalColumnIndexAtFirstRow;

      for( ; rowIdx < size && colIdx >= 0; rowIdx++, colIdx-- ) {
        if( colIdx < size ) {
          var row = this.get(rowIdx);
          count += row[colIdx];
        }
      }

      return count > 1;
    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function() {
      var size = this.get('n');

      for( var i = (size * 2) - 1; i >= 0; i-- ) {
        if( this.hasMinorDiagonalConflictAt(i) ) {
          return true;
        }
      }

      return false;
    }

    /*--------------------  End of Helper Functions  ---------------------*/


  });

  var makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };

}());




// // This file is a Backbone Model (don't worry about what that means)
// // It's part of the Board Visualizer
// // The only portions you need to work on are the helper functions (below)

// (function() {

//   window.Board = Backbone.Model.extend({

//     initialize: function (params) {
//       if (_.isUndefined(params) || _.isNull(params)) {
//         console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
//         console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;','color: blue;', 'color: black;', 'color: grey;');
//         console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;','color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
//       } else if (params.hasOwnProperty('n')) {
//         this.set(makeEmptyMatrix(this.get('n')));
//       } else {
//         this.set('n', params.length);
//       }
//     },

//     rows: function() {
//       return _(_.range(this.get('n'))).map(function(rowIndex) {
//         return this.get(rowIndex);
//       }, this);
//     },

//     togglePiece: function(rowIndex, colIndex) {
//       this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
//       this.trigger('change');
//     },

//     _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
//       return colIndex - rowIndex;
//     },

//     _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
//       return colIndex + rowIndex;
//     },

//     hasAnyRooksConflicts: function() {
//       return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
//     },

//     hasAnyQueenConflictsOn: function(rowIndex, colIndex) {
//       return (
//         this.hasRowConflictAt(rowIndex) ||
//         this.hasColConflictAt(colIndex) ||
//         this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
//         this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
//       );
//     },

//     hasAnyQueensConflicts: function() {
//       return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
//     },

//     _isInBounds: function(rowIndex, colIndex) {
//       return (
//         0 <= rowIndex && rowIndex < this.get('n') &&
//         0 <= colIndex && colIndex < this.get('n')
//       );
//     },


// /*
//          _             _     _
//      ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
//     / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
//     \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
//     |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

//  */
//     /*=========================================================================
//     =                 TODO: fill in these Helper Functions                    =
//     =========================================================================*/

//     // ROWS - run from left to right
//     // --------------------------------------------------------------
//     //
//     // test if a specific row on this board contains a conflict
//     hasRowConflictAt: function(rowIndex) {
//       //get the smaller (row) array in rows()
//       var row = this.rows()[rowIndex];
//       // set a variable called number of pieces, iterate through the row and count the num of pieces
//       var numPieces = 0;

//       for(var i=0; i<row.length; i++){
//         if(row[i] === 1){
//           numPieces++;
//           if(numPieces>1){
//             return true;
//           }
//         }
//       }
//       // conditional statement if num>1 return true, else return false
//       return false;
//     },

//     // test if any rows on this board contain conflicts
//     hasAnyRowConflicts: function() {
//       //define variable conflict = false
//       var conflict = false;
//       //define variable that gets all the rows
//       var rows = this.rows();
//       //iterate through all rows, apply previous function
//       for(var i = 0; i < rows.length; i++){
//         //if previous function is true, set conflict = true
//         if(this.hasRowConflictAt(i)){
//           conflict = true;
//         }
//       }
//       return conflict; 
//     },



//     // COLUMNS - run from top to bottom
//     // --------------------------------------------------------------
//     //
//     // test if a specific column on this board contains a conflict
//     hasColConflictAt: function(colIndex) {
//       // get var that stores rows
//       var rows = this.rows();
//       var count = 0;
//       for (var i=0; i<rows.length; i++) {
//       // iterate through that array, check the column index of that array
//         if (rows[i][colIndex] === 1) {
//           count++;
//         }
//         // count++ if it equals 1
//       }
//       // if count > 1, return false
//       if (count > 1) {
//         return true;
//       }
//       return false; 
//     },

//     // test if any columns on this board contain conflicts
//     hasAnyColConflicts: function() {
//       // get the rows in an array
//       var rows = this.rows();
//       // create a variable conflict = false;
//       var conflict = false;
//       // iterate the previous function over each array 
//       for (var i=0; i < rows.length; i++) {
//         // check if previous function returns true
//         if (this.hasColConflictAt(i)) {
//           conflict = true;
//         }
//       }
//       return conflict; 
//     },



//     // Major Diagonals - go from top-left to bottom-right
//     // --------------------------------------------------------------
//     //
//     // test if a specific major diagonal on this board contains a conflict
//     hasMajorDiagonalConflictAt: function(majorDiagonalColumnIndexAtFirstRow) {
//       //if number is negative ... deal with later

//       // get the rows
//       var rows = this.rows();
//       var count = 0;
//       // iterate through the rows, with the column starting at the index given
//       for (var i=0; i < rows.length; i++){

//       // check the nedxt row, with the column equaling column+1 (if column+1 is > length of row, return)
//          if(majorDiagonalColumnIndexAtFirstRow>=0 && rows[i][majorDiagonalColumnIndexAtFirstRow] !== undefined && (rows[i][majorDiagonalColumnIndexAtFirstRow] === 1)){
//            count++;
//          }
//          majorDiagonalColumnIndexAtFirstRow+=1;
//       }
//       if(count>1){
//         return true;
//       }
//       // check if count is greater than 1
//       return false; 
//     },

//     // test if any major diagonals on this board contain conflicts
//     hasAnyMajorDiagonalConflicts: function() {
//       var result = false;
//       var rows = this.rows();
//       for (var i=(-1 * rows.length+1); i < rows.length; i++) {
//         if (this.hasMajorDiagonalConflictAt(i)) {
//           result = true;
//         }
//       }
//       return result;
//     },



//     // Minor Diagonals - go from top-right to bottom-left
//     // --------------------------------------------------------------
//     //
//     // test if a specific minor diagonal on this board contains a conflict
//     hasMinorDiagonalConflictAt: function(minorDiagonalColumnIndexAtFirstRow) {
//       var rows = this.rows();
//       var count = 0;
//       for(var i=0; i<rows.length; i++){
//         if(minorDiagonalColumnIndexAtFirstRow >=0 && minorDiagonalColumnIndexAtFirstRow < rows[i].length && rows[i][minorDiagonalColumnIndexAtFirstRow] === 1){
//           count++;
//           if(count > 1){
//             break;
//           }
//         }
//         minorDiagonalColumnIndexAtFirstRow--;
//       }
//       return count > 1;
//     },

//     // test if any minor diagonals on this board contain conflicts
//     hasAnyMinorDiagonalConflicts: function() {
//       var result = false;
//       var rows = this.rows();

//       for(var i=0; i<=((rows.length-1)*2); i++){
//         if(this.hasMinorDiagonalConflictAt(i)){
//           result = true;
//           break;
//         }
//       }

//       return result;
//     }

//     /*--------------------  End of Helper Functions  ---------------------*/


//   });

//   var makeEmptyMatrix = function(n) {
//     return _(_.range(n)).map(function() {
//       return _(_.range(n)).map(function() {
//         return 0;
//       });
//     });
//   };

// }());

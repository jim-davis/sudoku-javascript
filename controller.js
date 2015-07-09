// this class implements the controller.
// In particular, it solves the puzzle.
// requires utils.

function new_Controller(model, view) {
  var ret = new Object();

  // protected data
  ret.model = model;
  ret.view = view;
  ret.ignoreNotifications = false;

  // public methods
  ret.initializeModel = Controller_InitializeModel;
  ret.notifyCellValue = Controller_NotifyCellValue;
  ret.propagateCellChoice = Controller_PropagateCellChoice;
  ret.eliminateSets = Controller_EliminateSets;
  ret.solve = Controller_Solve;
  ret.workHarder = Controller_WorkHarder;
  ret.findValuesWithOnlyOnePossibleCell = 
     Controller_FindValuesWithOnlyOnePossibleCell;
  ret.eliminateByLineIntersection = Controller_EliminateByLineIntersection;

  // initialization code 

  // when created, tell the model that we are the controller
  model.setController(ret);

  return ret;
}

// initialize the model from the view
function Controller_InitializeModel () {
  this.ignoreNotifications = true;
  for (var r = 0; r < 9; r++) {
    for (var c = 0; c < 9; c++) {
      this.model.setValue(r,c,this.view.getCellValue(r,c));
    }
  }
  this.ignoreNotifications = false;
}

// solve the puzzle.
function Controller_Solve () {
  this.initializeModel()

  addMessage("Propagating cell choices");

  // propagate the initial values
  for (var r = 0; r < 9; r++) {
    for (var c = 0; c < 9; c++) {
      if (this.model.getValue(r,c) != null) {
        this.propagateCellChoice(r,c,this.model.getValue(r,c));
      }
    }
  }

  addMessage("Done propagating");

  if (! model.isSolved()) {
    this.workHarder();
  }
}

function Controller_WorkHarder() {
  var progress = true;
  while (progress) {
    progress = false;
    var p = false;
    p = this.findValuesWithOnlyOnePossibleCell();
    addMessage("Values with only one possible cell... " + (p ? "helped" : " no help"));
    progress = progress || p;
    p = this.eliminateSets(3);
    addMessage("Eliminating sets of (3)... " + (p ? "helped" : " no help"));
    progress = progress || p;

   // and if there exists a value found in this row (or column),
   // and this row or column is the only such in the box that has the value
   // then that value must occur in one of the cells that is both
   // in the row (or column) and in the box; hence it may be eliminated
   // from other cells in the row (or column) that lie outside the box.
   // I thank Ms. Thea van Bree for pointing out this method.
   p = this.eliminateByLineIntersection();
   addMessage("Eliminating by line intersection... " + (p ? "helped" : " no help"));

    progress = progress || p;

  }
  return progress;
}


// a cell has been set.
function Controller_NotifyCellValue (r, c, v) {
  if (this.view) {
    this.view.setCellValue(r,c,v);
  }
  if (! this.ignoreNotifications) {
    this.propagateCellChoice(r, c, v);
  }
}

// when we know that cell r,c has value v, this affects
// the possible values of other cells in the same row, column, or box.
function Controller_PropagateCellChoice (r, c, v) {

  // no other cell can have the same value.
  // this function, applied to a cell, removes v as a possible value
  // of that cell (if the cell is not the one at r,c).
  // We're making good use of Javascript's ability to define functions
  // at run-time, and the use of closures. 
  function noOtherCellCanHaveValue(cell) {
     if (! cell.atPos(r,c)) {
        cell.excludeValue(v);
     }
   }

  foreach (this.model.rowCells(r, c), noOtherCellCanHaveValue);
  foreach (this.model.columnCells(r,c),noOtherCellCanHaveValue);
  foreach (this.model.boxCells(r,c), noOtherCellCanHaveValue);

  // In addition, now that we have eliminated some possible
  // values from some cells, it may be the case that we can
  // find a set of two cells in a row, column, or box such
  // that the set of possible values in those two cells is
  // of length two.  For example, we know that those two cells
  // contain 2 or 5, but we don't know which one has the 2 and
  // which has the 5.  But regardless of that, we know that
  // 2 and 5 can't be anywhere else in the same row (column, etc)
  this.eliminateSets(2);

}

// search for groups of cells that have a common set of 
// possible values of size no more than n.  When you find one,
// eliminate those values as possibilities from the other cells.
// returns true if any progress was made
function Controller_EliminateSets (n) {
  var madeProgress = false;
  // for each row, column and box
  foreach (this.model.getCellGroups(),
   function (cg) {
    // cg is the set of cells in the row, column or box
   
    // find subsets that have a common set of possible values
    // where the size of the common set is <= 2
    foreach (cellsWithCommonPossibilities(cg, n),
     function (ccp) {
        // ccp is the set of cells with common possibilities
	var commonValues = commonPossibilities(ccp);
	// no other cells in the same row (column, etc) can have
	// any of those values.
        foreach (cg.subtract(ccp),
          function (cell) {
            // if we found a cell that had that value in its possibility list
            if (cell.possible.intersect(commonValues).length > 0) {
              // remove it,
              cell.excludeValues(commonValues); 
              // and note that we made some progress.
              madeProgress = true;
           }
          });
        });
    });
  return madeProgress;
}

// every possible value (1-9) must occur exactly once in every
// cell group.  if there is a cell group where there is exactly
// one cell with value v as a possible value, then that
// cell *must* the the one that has v
function Controller_FindValuesWithOnlyOnePossibleCell() {
  var madeProgress = false;
  foreach (this.model.getCellGroups(),
   function (cg) {
    for (var v = 1; v <= 9; v++) {
      var cgs = cellsWithPossibleValue(cg, v);
      if (cgs.length == 1) {
        var cell = cgs[0];
        if (cell.value == null) {
          madeProgress = true;
          cell.setValue(v);
        }
      }
    }
    }); 
  return madeProgress;
}


// given cg a group of cells (a row, column, or box) and
// the value n, return the set of all subsets of cg
// where the size of the union of the possible values in
// the subset is no more than n.
function cellsWithCommonPossibilities (cg, n) {
  var ret = new Set();
  var cells = cellsWithPossibilitiesSize(cg, n);
  if (cells.length >= n) {
     ret = 
      cells.chooseWithoutReplacement(n).removeIf (
         function (cellSet) {
           return commonPossibilities(cellSet).length > n;
         });
   }
  return ret;
}


// given a set of cells, 
// return the subset that have
// a possibility size of no more than n
function cellsWithPossibilitiesSize(cells, n) {
  return cells.removeIfNot ( function (c) {
    return  c.possible.length > 1 &&
            c.possible.length <= n;});
}


// given a set of cells,
// return the union of their possibilites 
function commonPossibilities (cells) {
  var arr = new Set();
  foreach (cells,
   function (c) {
      arr = arr.union(c.possible);
   });
  return arr;
}

// return the subset of cells where v is a possible value
function cellsWithPossibleValue (cells, v) {
  return cells.removeIfNot(function (x) {return x.hasPossibleValue(v);});
}


function Controller_EliminateByLineIntersection () {
  var madeProgress = false;
  // for each line (row or column)
  //   for each box that includes the line
  //     for each x such that x is in 
  //      the set of possible values in cells in the intersection of the line
  //           and the box and
  //     x is not in the possible values of the cells in the box outside the line
  //     x can not be in any cell in the line outside the box
  foreach (this.model.allLines(), 
       function (line) {
         foreach (this.model.boxesContainingCells(line),
              function (box) {
                foreach (this.model.possibleValuesInCells(line.intersect(box)),
                     function (v) {

                        if (! this.model.possibleValuesInCells(box.subtract(line)).contains(v)) {
                  foreach (line.subtract(box),
                    function (cell) {
                      if (cell.possible.contains(v)) {
                         madeProgress = true;
                        cell.excludeValue(v);
                      }
                    });

                  }

                 // if the value (which is found in the portion of the line
                 // within this box) is not found in the remainder of the line
                 // outside the box, then it MUST be in the portion of the line
                 // within the box, which means that it CAN NOT be in the
                 // box that is outside of the line.
                  if (! this.model.possibleValuesInCells(line.subtract(box)).contains(v)) {

                    foreach (box.subtract(line),
                      function (cell) {
                       if (cell.possible.contains(v)) {
                          madeProgress = true;
                          cell.excludeValue(v);
                       }
                       });

                   }
                  });
                });
              });

  return madeProgress;

}

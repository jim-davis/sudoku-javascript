// Class that models a board.  We use the "model view controller"
// design pattern.  This class is the model, it records the state
// of the board but has no knowledge at all about how to display it.

// Note that the style of object-oriented programming is
// different from the usual Javascript approach.
// The constructor for a class is called new_Class, and returns
// a new Object with all the members (attributes and methods) of
// that class.  But the prototype attribute is not set.
// All the methods are defined as top-level functions, and assigned
// to the object.  The more common approach is to assign an anonymous
// function to the prototype of the object
// foo.prototype.method = function () {...}
// but this is difficult to trace and debug in some frameworks.

// requires utils


function new_Model () {
  var ret = new Object();

  // data
  ret.cells = null;
  ret.controller = null;
  ret.cellGroups = null;

  // public methods
  ret.getValue = Model_GetValue;
  ret.setValue = Model_SetValue;
  ret.getCell = Model_GetCell;
  ret.rowCells = Model_RowCells;
  ret.columnCells = Model_ColumnCells;
  ret.boxCells = Model_BoxCells;
  ret.setController = Model_SetController;
  ret.allLines      = Model_AllLines;
  ret.getCellGroups = Model_GetCellGroups;
  ret.sendCellValueNotification = Model_SendCellValueNotification;
  ret.boxesContainingCells = Model_BoxesContainingCells;
  ret.possibleValuesInCells = Model_PossibleValuesInCells;
  ret.showState = Model_ShowState;
  ret.isSolved = Model_IsSolved;
  ret.initialize = Model_Initialize;

  ret.initialize();
  return ret;
}

function Model_Initialize () {
 this.cells = makeCellsArray(this);
 this.cellGroups = makeCellGroups(this.cells);
}

function Model_GetCell (i, j) {
  return this.cells[i][j];
}

// get the value in cell (i,j);
function Model_GetValue (i, j) {
  return this.cells[i][j].value;
}

// set the value in cell (i,j);
function Model_SetValue (i, j, v) {
  this.cells[i][j].setValue(v);
}

// tell the controller that a cell has been set to a value
function Model_SendCellValueNotification (r, c, v) {
  if (this.controller) {
    this.controller.notifyCellValue(r,c,v);
  }
}


// return the set of all cells on row i
function Model_RowCells (i, j) {
  var arr = new Set();
  for (var c = 0; c < 9; c++) {
     arr.push(this.cells[i][c]);
  }
  return arr;
}

// return the set of all cells on column j
function Model_ColumnCells (i, j) {
  var arr = new Set();
  for (var r = 0; r < 9; r++) {
   arr.push(this.cells[r][j]);
  }
  return arr;
}

// return the set of all cells in the box that contains (i,j)
function Model_BoxCells (i, j) {
  var arr = new Set();
  for (var r = (Math.floor(i / 3) * 3); r < (Math.floor(i / 3) * 3) + 3; r++) {
   for (var c = (Math.floor(j / 3) * 3) ; c < (Math.floor(j / 3) * 3) + 3; c++) {
      arr.push(this.cells[r][c]);
   }
  }
  return arr;
}

// set the controller for this model
function Model_SetController (controller) {
  this.controller = controller;
}

// return all the cell groups for the board.  a cell group is a set 
// of all cells in a single, row, column or grid.  According to the
// rules of Sudoku, every digit must appear exactly once in any cell 
// group.
function Model_GetCellGroups () {
  return this.cellGroups;
}

// return set of all line (rows and columns)
function Model_AllLines () {
  var arr = new Set();
  for (var r = 0; r < 9; r++) {
    arr.push(makeRowCellGroup(this.cells, r));
  }
  for (var c = 0; c < 9; c++) {
    arr.push(makeColumnCellGroup(this.cells, c));
  }
  return arr;
}

// show the state of the model in the "show state" display
// This is a debugging tool, so it writes directly to the
// showstate display.  Note this is a different set of
// cells than the "view"
function Model_ShowState () {
  if (this.controller.view) {
    for (var iRow = 0; iRow < 9; iRow++) {  
      for (var iCol = 0; iCol < 9; iCol++) {
        this.controller.view.showCellState(this.cells[iRow][iCol]);
      }
    }
  }
}

function Model_IsSolved () {
  for (var iRow = 0; iRow < 9; iRow++) {  
    for (var iCol = 0; iCol < 9; iCol++) {
      if (this.getValue(iRow,iCol) == null) {
        return false;
      }
    }
  }
  return true;
}

// given a set of cells, return the union of all possible values in those cells
function Model_PossibleValuesInCells(cells) {
  var ret = new Set();
  foreach (cells, 
     function (cell) {
       ret = ret.union(cell.possible);
     });
  return ret;
}

// given a set of cells, return the set of boxes such that
// each cell is in one of the boxes.
function Model_BoxesContainingCells (cells) {
  var ret = new Set();
  foreach (cells, 
    function (cell) {
       var box = cell.model.boxCells(cell.row, cell.col);
       if (! ret.contains (box)) {
         ret.push(box);
       }
     });
  return ret;
}



// make a square two dimensional array of Cell objects
// in javascript, arrays have one dimension so this is an array of arrays.
function makeCellsArray (model) {
    var ret = new Array(9);
    for (var iRow = 0; iRow < 9; iRow++) {
        var row = new Array(9);
        for (var iCol = 0; iCol < 9; iCol++) {
          row[iCol] = new_Cell(iRow, iCol, model);
        }
	ret[iRow] = row;
    }
    return ret;
}

// build the set of cell groups
function makeCellGroups (cells) {
  var arr = new Set();
  for (var r = 0; r < 9; r++) {
    arr.push(makeRowCellGroup(cells, r));
  }
  for (var c = 0; c < 9; c++) {
    arr.push(makeColumnCellGroup(cells, c));
  }
  for (var r = 0; r < 3; r++) {
    for (var c = 0 ; c < 3; c++) {
      arr.push(makeBoxCellGroup(cells, r, c));
    }
  }
  return arr;
}

function makeRowCellGroup(cells, r) {
  var arr = new Set();
  for (var c = 0; c < 9; c++) {
    arr.push(cells[r][c]);
  }
  return arr;
}

function makeColumnCellGroup(cells, c) {
  var arr = new Set();
  for (var r = 0; r < 9; r++) {
    arr.push( cells[r][c]);
  }
  return arr;
}
  
function makeBoxCellGroup(cells, r, c) {
  var arr = new Set();
  for (var i = r * 3; i < r * 3 + 3; i++) {
    for (var j = c * 3; j < c * 3 + 3; j++) {
      arr.push(cells[i][j]);
    }
  }
  return arr;
}

// This object models a single Cell.
// A Cell has coordinates (row, col)
// it has a value (which is initially null, unknown)
// it has a set of possible values.  
// The method excludeValue removes a value from the set of possible
// values.  If the set becomes length 1, then the value is set
// by process of elimination, and the controller is informed of this.

function new_Cell (iRow, iCol, model) {
  var ret = new Object();

  // data
  ret.row = iRow;
  ret.col = iCol;
  ret.model = model;
  ret.value = null;
  ret.possible = new Set();
  for (var i = 1; i <= 9; i++) {
    ret.possible.push(i);
  }

  // public methods
  ret.toString  = Cell_toString;
  ret.getValue = Cell_GetValue;
  ret.setValue = Cell_SetValue;
  ret.excludeValue = Cell_ExcludeValue;
  ret.excludeValues = Cell_ExcludeValues;
  ret.hasPossibleValue = Cell_HasPossibleValue;
  ret.atPos = Cell_AtPos;

  ret.equalp = Cell_Equalp;

  return ret;
}

function Cell_toString () {
  return "[Cell " + this.row + "," + this.col + "]";
}

function Cell_Equalp (c2) {
  return this.row == c2.row && this.col == c2.col;
}

function Cell_GetValue () {
  return this.value;
}

var checkCarefully = true;

function DuplicateValueException (where, cell, v) {
  this.message = "Attempt to set " + cell + " to value " + v + " already in " + where;
  this.cell = cell;
}

function Cell_SetValue (v) {
  var old = this.value;
  if (checkCarefully  && v) {
    var myRow = this.row;
    var myCol = this.col;
    function isOtherWithV (c) {
      return (c.row != myRow || c.col != myCol) && (c.value == v);
    }
    if (! this.model.rowCells(this.row, this.col).removeIfNot(isOtherWithV).emptyp()) {
      throw new DuplicateValueException("row", this, v);
    }

    if (! this.model.columnCells(this.row, this.col).removeIfNot(isOtherWithV).emptyp()) {
      throw new DuplicateValueException("column", this, v);
    }

    if (! this.model.boxCells(this.row, this.col).removeIfNot(isOtherWithV).emptyp()) {

      throw new DuplicateValueException("box", this, v);
    }
  }
  this.value = v;
  if (v != null) {
    this.possible= new Set([v]);
  }
  if (v != old) {
    this.model.sendCellValueNotification(this.row, this.col, this.value);
  }
}

// If the cell does not already have a value,
// remove value v from the set of possible values.
// if this leaves only one possible value, set the value to the one
// remaining value
function Cell_ExcludeValue (v) {
  if (this.value == null) {
    var pos = ArrayFind(this.possible, v);
    if (pos > -1) {  
      this.possible.splice(pos,1);
      if (this.possible.length == 1) {
        this.setValue(this.possible[0]);
       }
    }
  }
}

// return index in array of value v, or -1 if not found.
function ArrayFind (arr, v) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] == v) {
      return i;
    }
  }
  return -1;
}

// remove a set of values from the set of possible values
function Cell_ExcludeValues (vs) {
  for (var i = 0; i < vs.length; i++) {
    this.excludeValue(vs[i]);
  }
}

function Cell_HasPossibleValue (v) {
  return this.possible.contains(v);
}


// true if the position of this cell is r,c
function Cell_AtPos (r, c) {
  return this.row == r && this.col == c;
}


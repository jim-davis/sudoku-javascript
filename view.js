// this class implements the View.
// Note that some of the view functionality is
// implemented in the main script of the main page.

function new_View (model) {
  var ret = new Object();

  // data
  // the DOM element that shows the board
  ret.board = document.getElementById("board");
  ret.model = model;

  // public methods
  ret.getCellValue = View_GetCellValue;
  ret.setCellValue = View_SetCellValue;
  ret.getCell      = View_GetCell;
  ret.showCellState = View_ShowCellState;
  ret.getStateCell = View_GetStateCell;

  return ret;
}

function View_GetCellValue(r,c) {
  var v = this.getCell(r,c).value;
  if (v == "") {v = null;}
  return v;
}

// set the value displayed in the cell.
function View_SetCellValue(r,c,v) {
  var elt = this.getCell(r,c);
  elt.value = v;
}

function View_GetCell(r,c) {
  return document.getElementById("b" + (r + 1) + (c + 1));
}

function View_ShowCellState (cell) {
  var elt = this.getStateCell(cell.row, cell.col);
  elt.innerHTML = new CellStateGenerator(cell.possible).generate();
}


function View_GetStateCell(iRow, iCol) {
  var id = "s" + (iRow + 1) + (iCol + 1);
  return document.getElementById(id);
}


// ---------------

function CellStateGenerator (possible) {
  this.possible = possible;
  this.sb = new StringBuilder();
}

CellStateGenerator.prototype.generate = function () {
  this.sb.append("<TABLE class='cellState' border='0' cellpadding='0' cellspacing='0'>");

  this.sb.append("<TR>")
  this.addCellChoice(1);
  this.addCellChoice(2);
  this.addCellChoice(3);
  this.sb.append("</TR>")

  this.sb.append("<TR>")
  this.addCellChoice(4);
  this.addCellChoice(5);
  this.addCellChoice(6);
  this.sb.append("</TR>")

  this.sb.append("<TR>")
  this.addCellChoice(7);
  this.addCellChoice(8);
  this.addCellChoice(9);
  this.sb.append("</TR>")

  this.sb.append("</TABLE>")
  return this.sb.toString();
}

CellStateGenerator.prototype.addCellChoice = function (v) {
  if (this.possible.contains(v)) {
    this.sb.append("<TD class='cc' width='16'>");
    this.sb.append(v);
    this.sb.append("</TD>");
  } else {
    this.sb.append("<TD class='cr' width='16'>");
    this.sb.append(v);
    this.sb.append("</TD>");
  }
}

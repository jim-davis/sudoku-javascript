function highlightInputs() {
  for (var i = 1; i <= 9; i++) {
    for (var j = 1; j <=9; j++) {
      var elt = document.getElementById("b" + i + j);
      if (elt.value != "") {
	hCellChanged(elt);
      }
    }
  }
}

highlightInputs()
//--------------

// does not solve this one
document.getElementById("b13").value=9;
document.getElementById("b16").value=6;
document.getElementById("b21").value=8;
document.getElementById("b26").value=2;
document.getElementById("b29").value=7;
document.getElementById("b34").value=8;
document.getElementById("b37").value=3;
document.getElementById("b43").value=1;
document.getElementById("b44").value=2;
document.getElementById("b47").value=6;
document.getElementById("b51").value=9;
document.getElementById("b52").value=4;
document.getElementById("b54").value=1;
document.getElementById("b56").value=5;
document.getElementById("b58").value=8;
document.getElementById("b59").value=3;
document.getElementById("b63").value=6;
document.getElementById("b67").value=1;
document.getElementById("b66").value=4;
document.getElementById("b73").value=8;
document.getElementById("b76").value=1;
document.getElementById("b81").value=5;
document.getElementById("b84").value=4;
document.getElementById("b89").value=9;
document.getElementById("b94").value=7;
document.getElementById("b97").value=5;


//-----------------------

var line = model.columnCells(0,0);
var boxes = this.model.boxesContainingCells(line);
boxes.length;

var box = boxes[1];
var pv = this.model.possibleValuesInCells(line.intersect(box));

box.subtract(line);

this.model.possibleValuesInCells(box.subtract(line)).sort()

this.model.possibleValuesInCells(box.subtract(line)).contains(3);

//-----------

// Solves this one

document.getElementById("b12").value= 8;
document.getElementById("b14").value= 1;
document.getElementById("b19").value= 4;
document.getElementById("b25").value= 8;
document.getElementById("b29").value= 2;
document.getElementById("b31").value= 1;
document.getElementById("b33").value= 4;
document.getElementById("b35").value= 6;
document.getElementById("b37").value= 7;
document.getElementById("b43").value= 5;
document.getElementById("b46").value= 2;
document.getElementById("b51").value= 3;
document.getElementById("b59").value= 6;
document.getElementById("b64").value= 6;
document.getElementById("b67").value= 9;
document.getElementById("b73").value= 3;
document.getElementById("b75").value= 9;
document.getElementById("b77").value= 4;
document.getElementById("b79").value= 8;
document.getElementById("b81").value= 5;
document.getElementById("b85").value= 2;
document.getElementById("b91").value= 9;
document.getElementById("b96").value= 5;
document.getElementById("b98").value= 7;

//----

// does not solve

document.getElementById("b19").value= 3;
document.getElementById("b22").value= 4;
document.getElementById("b24").value= 9;
document.getElementById("b25").value= 8;
document.getElementById("b32").value= 7;
document.getElementById("b49").value= 6;
document.getElementById("b51").value= 4;
document.getElementById("b55").value= 1;
document.getElementById("b57").value= 8;
document.getElementById("b63").value= 6;
document.getElementById("b64").value= 5;
document.getElementById("b65").value= 9;
document.getElementById("b68").value= 1;
document.getElementById("b69").value= 2;
document.getElementById("b71").value= 5;
document.getElementById("b77").value= 6;
document.getElementById("b78").value= 7;
document.getElementById("b82").value= 6;
document.getElementById("b85").value= 2;
document.getElementById("b87").value= 4;
document.getElementById("b93").value= 3;
document.getElementById("b97").value= 1;


function highlightInputs() {
  for (var i = 1; i <= 9; i++) {
    for (var j = 1; j <=9; j++) {
      var elt = document.getElementById("b" + i + j);
      if (elt.value != "") {
	hCellChanged(elt);
      }
    }
  }
}

highlightInputs()

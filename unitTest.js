function beginTests () {
  document.write("<OL>");
}

function endTests () {
  document.write("</OL>");
}

var FAIL = "&nbsp;FAIL";

function testAssert (message, value)  {
  document.write("<LI>");
  document.write(message);
  if (value) {
    document.write(".");
  } else {
       document.write(FAIL);
  }
  document.write("</LI>");
}


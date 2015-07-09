// utility functions 

// equalp (the p is for predicate, it's a naming convention from Lisp.
// Ruby users would call it "equal?")
function equalp (a, b) {
  switch (typeof(a)) {
   case "object":
      if (a == null) {
        return b == null;
      } else {
        if (a.equalp) {
          return a.equalp(b);
        } else {
          return a == b;
        }
      }
   default:
     return a == b;
  }
}

// objects can override this, and they should
Object.prototype.equalp = function (o2) {
  return this == o2;
}


// Two arrays are equalp if they are the same length and each element is
// recursively (equalp) to the corresponding other element
Array.prototype.equalp = function (a2) {
  if (this.length != a2.length) {
    return false;
  }
  for (var i = 0; i < this.length; i++) {
    if (! equalp(this[i], a2[i])) {
      return false;
    }
  }
  return true;
}

function Set (elements) {
  ret = new Array();
  if (elements) {
    for (var i = 0; i < elements.length; i++) {
      ret.push(elements[i]);
    }
  }

  ret.isSet     = true;
  ret.emptyp    = Set_Emptyp;
  ret.equalp    = Set_Equalp;
  ret.contains  = Set_Contains;
  ret.union     = Set_Union;
  ret.intersect = Set_Intersect;
  ret.subtract  = Set_Subtract;
  ret.remove    = Set_Remove;
  ret.removeIf  = Set_RemoveIf;
  ret.removeIfNot  = Set_RemoveIfNot;
  ret.chooseWithoutReplacement = Set_ChooseWithoutReplacement
  return ret;
}

function Set_Emptyp () {
  return this.length == 0;
}

function Set_Equalp (s2) {
  if (this.length != s2.length) {
    return false;
  }

  for (var i = 0; i < this.length; i++) {
    if (! s2.contains(this[i])) {
      return false;
    }
  }
  return true;
}


function Set_Contains (e) {
  for (var i = 0; i < this.length; i++) {
    if (equalp(this[i], e)) {return true;}
  }
  return false;
}


function Set_Union (s2) {
  var ret = new Set(this);
  for (var i = 0; i < s2.length; i++) {
    if (! ret.contains(s2[i])) {
      ret.push(s2[i]);
    }
  }
  return ret;
}

function Set_Intersect (s2) {
  return this.removeIfNot(function (e) {return s2.contains(e);});
}

// return new Set that has all elements of this not in s2
function Set_Subtract (s2) {
  return this.removeIf(function (e) {return s2.contains(e);});
}

// return a new set that is the elements of s without e
function Set_Remove (e) {
  var ret = new Set(this);
  for (var i = 0; i < ret.length; i++) {
    if (equalp(ret[i],e)) {
      ret.splice(i,1);
      break;
   }
  }
  return ret;
}

// return new Set with all elements of this set except those where predicate
// function f is true
function Set_RemoveIf (f) {
  var ret = new Set();
  for (var i = 0; i < this.length; i++) {
    if (f(this[i])) {
    } else {
      ret.push(this[i]);
   }
  }
  return ret;
}

// return new Set with all elements of this set except those where predicate
// function f is false
function Set_RemoveIfNot (f) {
  var ret = new Set();
  for (var i = 0; i < this.length; i++) {
    if (f(this[i])) {
      ret.push(this[i]);
    } else {
   }
  }
  return ret;
}


// return the set of all sets that can
// be formed by choosing n different elements from s
function Set_ChooseWithoutReplacement (n) {
  var ret = new Set();
  if (this.length > 0) {
    if (n == 1) {
      for (var i = 0; i < this.length; i++) {
        ret.push(new Set([this[i]]));
      }
    } else {
        var ss = this.remove(this[0]).chooseWithoutReplacement(n - 1);
        for (var j = 0; j < ss.length; j++) {
          ss[j].push(this[0]);
          ret.push(ss[j]);
        }

        var ss = this.remove(this[0]).chooseWithoutReplacement(n);
        for (var j = 0; j  < ss.length; j++) {
          ret.push(ss[j]);
        }
    }
  }
  return ret;
}



// returns true if function f is true for any member of array arr
function any (arr, f) {
  for (var i = 0; i < arr.length; i++) {
    if (f(arr[i])) {
      return true;
    }
  }
  return false;
}

// apply function f to each element of arr.  Called for side-effect.
function foreach (arr, f) {
  for (var i = 0; i < arr.length; i++) {
    f(arr[i]);
  }
}


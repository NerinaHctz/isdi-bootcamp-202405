console.log("TEST objects");

console.log("CASE add elements to object");

var o = new Object();

o[0] = 10;
o[1] = 20;
o[2] = 30;
o.length = 3;
console.log(o);

console.log("CASE remove last element form object");

var o = new Object();

o[0] = 10;
o[1] = 20;
o[3] = 30;
o.length = 3;

console.log(o);
delete o[2];
//o.length = o.length - 1;
//o.length -= 1;
o.length--;

console.log(o);

console.log("CASE remove last 2 elements from object");

var colors = new Object();

colors[0] = "red";
colors[1] = "green";
colors[2] = "blue";
colors[3] = "yellow";
colors.length = 4;

console.log(colors);

delete colors[3];
delete colors[2];
colors.length = colors.length - 2;

console.log(colors);
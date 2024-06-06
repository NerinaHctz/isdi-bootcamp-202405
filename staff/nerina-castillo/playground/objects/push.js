console.log("TEST push");

console.log("CASE push an element to objects");

var cars = new Object();

cars[0] = { brand: "ferrari", model: "gta", year: 1990 };
cars[1] = { brand: "lamborgini", model: "murcielago", year: 2010 };
cars[2] = { brand: "fiat", model: "500", year: 2017 };
cars.length = 3;

console.log(cars);
console.log(cars.length);

//cars.push({ brand: "ford", model: "fiesta", year: 2005 });

console.log(cars);

console.log(cars.length);

cars.push = function (element) {
  this[this.length] = element;
  this.length++;
  return this.length;
};

cars.push({ brand: "ford", model: "fiesta", year: 2005 });

console.log(cars);
console.log(cars.length);

console.log("CASE multiple push to an object");

var animals = { 1: "cat", 2: "dog", 3: "cow", length: 4 };

console.log(animals);

console.log(animals.length);

animals.push = function () {
  for (i = 0; i < arguments.length; i++) {
    var argument = arguments[i];
    this[this.length++] = argument;
  }
};
animals.push("chicken", "rabbit", "pig");

console.log(animals);
console.log(animals.length);

# cyclops

Take an array of arbitrary data and generate a function that emulates it! (in javascript).

## Usage

```js
var data = [0.5, 0.55, 0.7, 0.71, 0.44, 0.42, 0.14, 0.24, 0.46, 0.66];
var poly = cyclops.generatePoly(data, 5); // polynomial of degree 5 (ax^5 + bx^4 + cx^3 + dx^2 + ex + f)
var cubic = cyclops.generateCubic(data); // cubic spline interpolation between points
var index = numeric.linspace(0, 1, data.length);

// OUTPUT
console.log("Polyfit")
for (x = 0; x < index.length; x++) {
  console.log("  "+poly(index[x]));   // --> pretty close!
}
console.log("\n")
console.log("Cubic splines")
for (x = 0; x < index.length; x ++) {
  console.log("  "+cubic(index[x]));  // --> even better!
}
```

output:

```js
Polyfit
  0.49753846153845366
  0.5613146853146758
  0.688261072261069
  0.6824335664335701
  0.5284475524475605
  0.32024708624709897
  0.1898741258741481
  0.23623776223779203
  0.4538834498835058
  0.6617622377623107

Cubic splines
  0.5
  0.55
  0.7
  0.71
  0.44
  0.42
  0.14
  0.24
  0.46
  0.66
```
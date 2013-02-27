# cyclops

Take an array of arbitrary data and generate a function that emulates it! (in javascript).

## Usage

```js
var data = [0.5, 0.55, 0.7, 0.71, 0.44, 0.42, 0.14, 0.24, 0.46, 0.66];
var poly = cyclops.generatePoly(data, 5); // polynomial of degree 5 (ax^5 + bx^4 + cx^3 + dx^2 + ex + f)
var cubic = cyclops.generateCubic(data); // cubic spline interpolation between points

// OUTPUT
console.log("Polyfit")
for (x = 0; x < 1; x += 0.1) {
  console.log("  "+poly(x));   // --> pretty close!
}
console.log("\n")
console.log("Cubic splines")
for (x = 0; x < 1; x += 0.1) {
  console.log("  "+cubic(x));  // --> even better!
}
```

output:

```js
Polyfit
  0.49753846153845366
  0.5469146698636265
  0.6702748706013941
  0.7017862202202815
  0.6034278256783288
  0.42292968750001037
  0.25171164285316205
  0.18282230862590243
  0.2688780245035325
  0.4800017960455172
  0.6617622377623178

Cubic splines
  0.5
  0.5399240688124307
  0.669696455789863
  0.745937926008139
  0.5346342167961522
  0.4331415094339623
  0.31386872660007403
  0.12491184757676649
  0.2850642989271179
  0.4808364217536071
  0.6599999999999998
```
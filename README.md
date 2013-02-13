# cyclops

Take an array of arbitrary data and generate a function that emulates it (in javascript).

## Usage

```js
var data = [0.5, 0.55, 0.7, 0.71, 0.44, 0.42, 0.14, 0.24, 0.46, 0.66];
var fit = cyclops.generateFit(data, 5); // polynomial of degree 5 (ax^5 + bx^4 + cx^3 + dx^2 + ex + f)
for (x = 0; x < 1; x += 0.1) {
  console.log(fit(x)); // --> pretty close!
}
```
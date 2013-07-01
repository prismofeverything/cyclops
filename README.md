# cyclops

Take an array of arbitrary data and generate a function that emulates it! (in javascript).

## Usage

The trickiest part of using Cyclops is acquiring your data.  It should be of the form:

```js
var data = {
  position: {   // for example, could be any property
    duration: 1.5,
    startTime: 0.3,
    keys: [{
      time: 0,
      value: [12, 9, -4],
      hasTangents: true,  
      in: {  // in describes the nature of the curve as it enters the keyframe
        type: "bezier",
        influence: "10",
        tangent: [3, -4]  // does not have to have tangents, only recognized if "hasTangents" is true
      },
      out: {  // out describes the curve as it is leaving the keyframe
        type: "bezier",
        influence: "80",
        tangent: [-3, 8] 
      }
    },
    {  // you can have any number of keyframes
      time: 0.3, ... 
    }, ... ]
  },
  rotation: { ... }  // you can have any number of properties in parallel, all with the same format
}
```

Once you have some data defined, you can generate a function which emulates your data as a continuous function:


```js
var curve = cyclops.loadCurve(data);
curve.position.func(0.5);  // interpolates into your data normalized between 0 and 1
                           // There will be an interpolation function for each property in the original data
```


// Keyframe data format:

var myTweenData = {

	"position" : {
		"duration" : 1.2,
		"startTime" : 0,
		"keys" : [
			{
				"time" : 0.0,
				"value" : [9,5,1],
				"in" : {
					"type" : "bezier",
					"influence" : 30,
					"speed" : 9.3
				},
				"out" : {
					"type" : "bezier",
					"influence" : 40,
					"speed" : 9.3
				}
			},
			{
				"time" : 0.2,
				"value" : [3,2,2],
				"in" : {
					"type" : "bezier",
					"influence" : 80,
					"speed" : 9.3
				},
				"out" : {
					"type" : "bezier",
					"influence" : 60,
					"speed" : 9.3
				}
			},
			{
				"time" : 1.0,
				"value" : [5,10,5],
				"in" : {
					"type" : "bezier",
					"influence" : 70,
					"speed" : 9.3
				},
				"out" : {
					"type" : "bezier",
					"influence" : 30,
					"speed" : 9.3
				}
			}
		]
	},

	"opacity" : {
		"duration" : 1.2,
		"startTime" : 0.25,
		"keys" : [
			{
				"time" : 0.0,
				"value" : [9],
				"in" : {
					"type" : "bezier",
					"influence" : 10.0,
					"speed" : 9.3
				},
				"out" : {
					"type" : "bezier",
					"influence" : 60.0,
					"speed" : 9.3
				}
			},
			{
				"time" : 1.0,
				"value" : [3],
				"in" : {
					"type" : "bezier",
					"influence" : 30.0,
					"speed" : 9.3
				},
				"out" : {
					"type" : "bezier",
					"influence" : 90.0,
					"speed" : 9.3
				}
			}
		]
	}
};


// Using the api:

// var foo = cyclops.loadTween(myTweenData);
// foo.position.func(0.3);

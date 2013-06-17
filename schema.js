
// Keyframe data format:

var myTweenData = {

	"position" : {
		"originalDuration" : 1.2,
		"keys" : [
			{
				"time" : 0.1,
				"value" : [9,2,1],
				"in" : {
					"type" : "bezier",
					"influence" : 0.2,
					"speed" : 9.3
				},
				"out" : {
					"type" : "bezier",
					"influence" : 0.2,
					"speed" : 9.3
				}
			}
		]
	},

	"opacity" : {
		"originalDuration" : 1.2,
		"keys" : [
			{
				"time" : 0.1,
				"value" : [9],
				"in" : {
					"type" : "bezier",
					"influence" : 0.2,
					"speed" : 9.3
				},
				"out" : {
					"type" : "bezier",
					"influence" : 0.2,
					"speed" : 9.3
				}
			}
		]
	}
};


// Using the api:

var foo = cyclops.loadTween(myTweenData);
foo.position.func(0.3);

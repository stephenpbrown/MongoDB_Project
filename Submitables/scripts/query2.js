// Gets 3 detectorids and stores them in detectors
var detectors = null;
detectors = db.freeway_detectors.find( { locationtext : "Foster NB" }, {detectorid : 1} ).toArray();

// Get all the detectorids in the proper form
var detectorids = detectors.map(function (x) { return x.detectorid});

// Finds all the data matching the starttime and the detectorids
var data = null
data = db.freeway_loopdata.find({ 
	$and: [
		{detectorid: { $in: detectorids } }, 
		{starttime: { "$gte" : ISODate("2011-09-21"), "$lt" : ISODate("2011-09-22")}}
	]
}).toArray();

// Insert the array into a collection and then sum the volumes
db.volumes.insert(data);
var results = db.volumes.aggregate([ { $group: { _id: null, summedVolume: {$sum: "$volume"}}}]);

// Prints the results
print("Summed volumes: " + results.map(function (x) { return x.summedVolume}));

// Free up the collection to save space
db.volumes.drop();
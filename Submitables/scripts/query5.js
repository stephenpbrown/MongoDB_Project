// Find the highwayid for NORTH
var highwayID = db.highways.find( { direction: "NORTH" } ).toArray();

// Find all detectorids for highwayid
var detectorIDs = db.freeway_detectors.find( { highwayid: highwayID[0].highwayid } ).toArray();

// Find station info for the lengths
var stationInfo = db.freeway_stations.find( { highwayid : highwayID[0].highwayid}).toArray();

// Get all the detectorids in the proper form
var detectorids = detectorIDs.map(function (x) { return x.detectorid});

// Get all the data based off the detectorids and times
var data = db.freeway_loopdata.find( 
	{ $and: [
		{ detectorid: { $in: detectorids } }, 
		{ $or: [ 
			{starttime: { "$gte" : ISODate("2011-09-21T07:00:00Z"), "$lte" : ISODate("2011-09-21T09:00:00Z")}}, 
			{starttime: { "$gte" : ISODate("2011-09-21T16:00:00Z"), "$lte" : ISODate("2011-09-21T18:00:00Z")}}
		]}]}
).toArray();

// Find the sum of the lengths
var summedLengths = 0
stationInfo.map(function (x) { summedLengths += x.length});

db.travelTimes.insert(data);

var results = db.travelTimes.aggregate([ 
	{ "$group": { 
		"_id" : null,
		"avgSpeed" : { "$avg": "$speed" }
	}},
	{"$project": { "result_in_minutes" : { "$multiply": [60, { "$divide" : [summedLengths, "$avgSpeed"]}]}}}
]);

// Print the results
results.forEach(printjson);

// Free up the collection to save space
db.travelTimes.drop();
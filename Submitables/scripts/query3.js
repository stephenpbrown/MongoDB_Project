// Find the stationID for Foster NB
var stationInfo = db.freeway_stations.find( { locationtext : "Foster NB" }).toArray();

// Find all the detectorIDs associated with the stationID
var detectorIDs = db.freeway_detectors.find( { stationid : stationInfo[0].stationid }, { detectorid : 1}).toArray();

// Get all the detectorids in the proper form
var detectorids = detectorIDs.map(function (x) { return x.detectorid});

// Use the detectorIDs to find all the data in freeway_loopdata
var data = db.freeway_loopdata.find({ 
	$and: [{ 
		detectorid: { $in: detectorids } }, 
		{starttime: { "$gte" : ISODate("2011-09-21"), "$lt" : ISODate("2011-09-22")}
	}]
}).toArray();

// Create collection and insert data into it to be used to aggregate with
db.travelTimes.insert(data);

// Aggregate the data and calculate the travel time for 5 minute intervals
var results = db.travelTimes.aggregate([ 
	{ "$group": { 
		"_id" : { 
			"hour": { "$hour": "$starttime" },
			"5_minute_intervals" : { "$subtract": [ 
				{ "$minute": "$starttime" }, 
				{ "$mod": [ {"$minute": "$starttime"}, 5] }]
			}
		}, 
		"avgSpeed" : { "$avg": "$speed" }
	}},
	{"$project": { "result_in_seconds" : { "$multiply": [3600, { "$divide" : [stationInfo[0].length, "$avgSpeed"]}]}}}
]);

// Print the results
results.forEach(printjson);

// Free up the collection to save space
db.travelTimes.drop();
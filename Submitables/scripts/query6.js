// The station we're going to
var toStation = db.freeway_stations.find( { locationtext : "Columbia to I-205 NB" } ).toArray();

// The station we're going from
var fromStation = db.freeway_stations.find( { locationtext: "Johnson Cr NB" } ).toArray();

// Initialize variable to hold route
var route = "";

// Loop through and find all downstream stationids until you find the station you're going to
for(var i = fromStation[0].stationid; i != toStation[0].stationid;){

	var cursor = db.freeway_stations.find({ stationid : i});
	
	if(cursor.hasNext()){
		route += cursor[0].locationtext + "\n";
		i = cursor[0].downstream;
	}
}
route += toStation[0].locationtext;

// Prints out the final route by locationtext
print(route);
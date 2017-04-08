// Finds all speeds greater than 100 and sums the number returned
var results = db.freeway_loopdata.find( { speed : { $gt : 100 } } ).count();

// Print the results
print("Number of speeds > 100 MPH: " + results);
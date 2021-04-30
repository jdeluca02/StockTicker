var http = require('http');
var port = process.env.PORT || 3000;
var fs = require('fs');
var qs = require('querystring');

http.createServer(function (req,res)
{	
	//Load home page
	 if (req.url === "/") {  
	 	file = 'index.html';  
	 	fs.readFile(file, function(err, txt) {  
	 		res.writeHead(200, {'Content-Type': 'text/html'});           
	 		res.write(txt);          
	 		res.end();  
	 	});  
	 }

	//Get form data
	else if (req.url === "/process") {
		res.writeHead(200, {'Content-Type': 'text/html'});
		var pdata = "";
		req.on('data', data => {
			pdata += data.toString();
		});
		
		req.on('end', () => {
			pdata = qs.parse(pdata);
			search = pdata['search'];
			type = pdata['c_or_t'];


			res.write("You are searching for " + search + "<br><br>");
			res.write("Your results are: " + "<br>");

			
			
			//Connect to database
			var mongo = require('mongodb');
			var MongoClient = mongo.MongoClient;
			const url = "mongodb+srv://jdeluc02:Tufts2021@cluster.g81rs.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

			MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {    
				if(err) { 
					console.log("Connection err: " + err); 
					return; 
				}
			
 
				var dbo = db.db("stocks");    
				var collection = dbo.collection("companies");   
			
			    //Call the query
			    if (type == "Company") {
			    	theQuery = {company: search};
			    }
			    if (type == "Ticker") {
			    	theQuery = {ticker: search};
			    }
			    
				collection.find(theQuery).toArray(function(err, items) {  
					if (err) {
						console.log("Error: " + err);  
					} 
					else {
						if (items.length == 0){
							res.write("None found! Either check your search for spelling mistakes, or the search you're looking for doesn't exist!");
						}
						else {
							for (i=0; i<items.length; i++) {
								res.write(items[i].company + " has ticker " + items[i].ticker + "<br>");  
							}
						}
						res.end();
					}     
					db.close();
		        });
	        });
		});
	}
	else{
		res.writeHead(200, {'Content-Type': 'text/html'});
		res.write ("Unknown page request");
		res.end();  
	}
}).listen(port);

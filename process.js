//docuemnt.write(hello);
//var http = require('http');
//var port = process.env.PORT || 3000;
//var fs = require('fs');
//var qs = require('querystring');
//
//http.createServer(function (req,res)
//{	
//	//Load home page
//	 if (req.url === "/") {  
//	 	file = 'stock.html';  
//	 	fs.readFile(file, function(err, txt) {  
//	 		res.writeHead(200, {'Content-Type': 'text/html'});           
//	 		res.write(txt);          
//	 		res.end();  
//	 	});  
//	 }
//
//	//Get form data
//	else if (req.url === "/") {
//		res.writeHead(200, {'Content-Type': 'text/html'});
//		var pdata = "";
//		req.on('data', data => {
//			pdata += data.toString();
//		});
//		
//		req.on('end', () => {
//			pdata = qs.parse(pdata);
//			search = pdata['search'];
//			type = pdata['c_or_t'];
//
//
//			res.write("You are searching for " + search + "<br><br>");
//			res.write("Your results are: " + "<br>");
//
//			
//			
//			//Connect to database
//			var mongo = require('mongodb');
//			var MongoClient = mongo.MongoClient;
//			const url = "mongodb+srv://jdeluc02:Tufts2021@cluster.g81rs.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
//
//			MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {    
//				if(err) { 
//					console.log("Connection err: " + err); 
//					return; 
//				}
//			
// 
//				var dbo = db.db("stocks");    
//				var collection = dbo.collection("companies");   
//			
//			    //Call the query
//			    if (type == "Company") {
//			    	theQuery = {Company: search};
//			    }
//			    if (type == "Ticker") {
//			    	theQuery = {Ticker: search};
//			    }
//			    
//				collection.find(theQuery).toArray(function(err, items) {  
//					if (err) {
//						console.log("Error: " + err);  
//					} 
//					else {
//						if (items.length == 0){
//							res.write("None found! Either check your search for spelling mistakes, or the search you're looking for doesn't exist!");
//						}
//						else {
//							for (i=0; i<items.length; i++) {
//								res.write(items[i].Company + " has ticker " + items[i].Ticker + "<br>");  
//							}
//						}
//						res.end();
//					}     
//					db.close();
//		        });
//	        });
//		});
//	}
//	else{
//		res.writeHead(200, {'Content-Type': 'text/html'});
//		res.write ("Unknown page request");
//		res.end();  
//	}
//}).listen(port);

var http = require("http");
var fs = require("fs");
var qs = require("querystring");


const MongoClient = require('mongodb').MongoClient;
const url = "mongodb+srv://jdeluc02:Tufts2021@cluster.g81rs.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

  MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
  if(err) { return console.log(err); return;}
  //var port = 8080
  var port = process.env.PORT || 3000;
  
  http.createServer(function (req, res) 
    {
  	  
  	  if (req.url == "/")
  	  {
  		  file = 'stock.html';
  		  fs.readFile(file, function(err, txt) {
      	  res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(txt);
            res.end();
  		  });
  	  }
  	  else if (req.url == "/process")
  	  {
  		 res.writeHead(200, {'Content-Type':'text/html'});
  		 pdata = "";
  		 req.on('data', data => {
             pdata += data.toString();
           });
  
  		// when complete POST data is received
  		req.on('end', () => {
  			pdata = qs.parse(pdata);
            var dbo = db.db("stocks");
            
            if (pdata["c_or_t"] == "ticker") {
                res.write("Input ticker symbol: " + pdata["text"] + "<br>");
                var query = ({"ticker": pdata["text"]});
                var filter = {projection: {"name": 1, "ticker": 1, "_id":0}};
                dbo.collection("companyList").find(query, filter).toArray(function(err, result) {
                    if (err) {
                        res.write("Please input a valid ticker symbol.");
                        throw err;
                    }
                    for (var i = 0; i < result.length; i++) {
                        res.write("Company Name: " + result[i]["name"] + "<br>");
                    }
                    res.end();
                });
            }
            else if (pdata["c_or_t"] == "company") {
                res.write("Input company name: " + pdata["text"] + "<br>");
                var query = ({"name": pdata["text"]});
                var filter = {projection: {"name": 1, "ticker": 1, "_id":0}};
                dbo.collection("companyList").find(query, filter).toArray(function(err, result) {
                    if (err) {
                        res.write("Please input a valid company name.");
                        throw err;
                    }
                    res.write("Ticker Symbol: " + result[0]["ticker"]);
                    res.end();
                });
            }
  		});
  	  }
  	  else 
  	  {
  		  res.writeHead(200, {'Content-Type':'text/html'});
  		  res.write ("Unknown page request");
  		  res.end();
  	  }
  }).listen(port);
});
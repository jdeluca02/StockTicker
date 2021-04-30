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
  		  file = 'index.html';
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
                dbo.collection("companies").find(query, filter).toArray(function(err, result) {
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
                dbo.collection("companies").find(query, filter).toArray(function(err, result) {
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

//var http = require('http');
//var port = process.env.PORT || 3000;
//var fs = require('fs');
//var querystring = require('querystring');
//
//http.createServer(function (req,res)
//{	
//	//Load home page
//	 if (req.url === "/") {  
//	 	file = 'index.html';  
//	 	fs.readFile(file, function(err, txt) {  
//	 		res.writeHead(200, {'Content-Type': 'text/html'});           
//	 		res.write(txt);          
//	 		res.end();  
//	 	});  
//	 }
//
//	//Get form data
//	else if (req.url === "/process") {
//		res.writeHead(200, {'Content-Type': 'text/html'});
//		var pdata = "";
//		req.on('data', data => {
//			pdata += data.toString();
//		});
//		
//		req.on('end', () => {
//			pdata = querystring.parse(pdata);
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
//			const url = "mongodb+srv://emmacary17:CBSWP151515@cluster0.dzzcs.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
//
//			MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {    
//				if(err) { 
//					console.log("Connection err: " + err); 
//					return; 
//				}
//			
// 
//				var dbo = db.db("companies");    
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

//var http=require('http');
//var url =require('url');
//var MongoClient = require('mongodb').MongoClient;
//var port = process.env.PORT || 3000;
//
//const uri = "mongodb+srv://jdeluc02:Tufts2021@cluster.g81rs.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
//var companyname = "";
//var ticker = "";
//http.createServer(function(req,res){
// if (req.url === '/favicon.ico') {
//    	     res.writeHead(200, {'Content-Type': 'image/x-icon'} );
//    	     console.log('favicon requested');
//    	     return;
//        }
//
// 	res.writeHead(200,{'Content-Type':'text/html'});
//
//	var qobj = url.parse(req.url,true);
//	var txt = qobj.query.name; 
//	MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true},function(err, db) {
// 		 if (err) {
//       			console.log(err);
//			return;
//      		 } 
//  	 	var dbo = db.db("stocks");
//
//     dbo.collection("companies").findOne({ $or: [{company: txt}, {ticker: txt}]} , (err, result) => {
//   
//  	 if (result == null) {
//  		  res.write("Company Name or Stock Ticker was not found.");
//  		  return;
//  	 }
//
//      companyname = result.company;
//      ticker = result.ticker;
//      res.write("Company Name: " + companyname + "\n" + "Company Ticker: " + ticker);
//      db.close();
//    })
// 	 });
// 
//  }).listen(port);
var express=require("express"); 
var bodyParser=require("body-parser");
var http = require ("http"); 
var db_url = require ("url");
var port = process.env.PORT || '3000';

const MongoClient = require('mongodb').MongoClient;
const url = "mongodb+srv://jdeluc02:Tufts2021@cluster.g81rs.mongodb.net/stocks?retryWrites=true&w=majority";
var app = express();
const path = require('path');


http.createServer(function (request, response) {
  response.writeHead(200, {'Content-Type': 'text/html'});
  response.write("<html><head><style type='text/css'>.col {  \
              display: inline-block; \
              width:40px;\
              border: 1px solid #333;\
            } \
            body { \
              background-color: palegreen;\
              text-align: center;\
            </style></head>");
  response.write("<h1>Your Company and Stock Ticker Results:</h1><br/>");

  var query;
  var qobj = db_url.parse(request.url, true).query;
  var input = qobj.choose;
  var val = qobj.input_val;
  

  if(input == 1) {
      query = { 
        Company: val
      };
  }
  else if (input == 2) {
    query = { 
      Ticker: val 
    };
  }
  MongoClient.connect(url, 
    function(err, db) {
      if (err) {
        response.write("<body> Your Search is invalid");
        response.end("</body></html>");
      }
      var dbo = db.db("companies");
      dbo.collection("companies").find(query).toArray(async(err, results) => {
        if (err) {
          response.write("<body> ERROR! Search was not valid!");
          response.end("</body></html>");
          db.close();
      }
      else
      {
        var r = "";
        await results.forEach(function(item) {
          r += "<b>Company: </b>" + item.Company + ", <b> Stock Ticker: </b>" + item.Ticker + "<br/>";
          // r += "<br/>";
        }
      );

      if (results.length === 0) {
        r = "Sorry, there were no matching results found!";
      }
      response.end(r);
      }
      response.end("</body></html>");
      db.close();
  }
);           
}); 
}).listen(port);
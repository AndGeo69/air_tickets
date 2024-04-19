var express = require('express');
var app = express();
var fs = require("fs");
var Amadeus = require('amadeus');
const { response } = require('express');

var amadeus = new Amadeus({
   clientId: '6uaFbEluEriPi7HST1wX71zl7UGmbk38',
   clientSecret: '75oacFIC17q62nwA'
 });

 // use these headers for every call
 // in order to be accepted by browsers
app.use(function (req, res, next) {
   res.header('X-XSS-Protection', 0);
   res.header('Access-Control-Allow-Origin', "*");
   next();
});

app.get('/getFlights', function (req, res) {
   console.log("Received call from client.");
   console.log("Sending: " + req.query['departure'] + " " + req.query['arrival'] + " " + req.query['date']);
   
   var originLocationCode = req.query['departure'];
   var destinationLocationCode = req.query['arrival'];
   var departureDate = req.query['date'];

   amadeus.shopping.flightOffersSearch.get({
      originLocationCode: originLocationCode,
      destinationLocationCode: destinationLocationCode,
      departureDate: departureDate,
      adults: '1'
  }).then(function(response){
    console.log(response.data);
    saveResponseAsJson(response.data, originLocationCode, destinationLocationCode, departureDate);
    prinJsonFromFile();
  }).catch(function(responseError){
    console.log(responseError.code);
  });

res.status(200).send(req.query['departure'] + " " + req.query['arrival'] + " " + req.query['date']);
})

app.get('/airportSearch/', function (req, res, next) {
   // For testing only. TODO REMOVE COMMENTS
   var jsonData = {
      "el": {
         "address": {
            "cityName": "ORDOS"
         },
         "iataCode": "ORD"
      }
   };
   res.status(200).send(jsonData);
   // amadeus.referenceData.locations.get({
   //    keyword: req.query.term,
   //    subType: 'AIRPORT,CITY'
   // }).then(function (response) {
   //    res.json(response.data);
   //    console.log(response.data.iataCode);
   // }).catch(function (error) {
   //    console.log("error");
   //    console.log(error.response);
   // });
}); 

function saveResponseAsJson(responseData, originLocationCode, destinationLocationCode, departureDate) {
   var jsonFlightData = JSON.stringify(responseData);
   fs.writeFile('amadeus_json/flightData_' + originLocationCode + '_' + destinationLocationCode + ' ' + departureDate + '.json', jsonFlightData, 'utf8', (err) => {
      if (err) throw err;
      console.log('JSON has been saved!');
   });
}

function prinJsonFromFile() {
   console.log("Reading json file...");
   fs.readFile('amadeus_json/flightData_ORD_MUC_2023-02-24.json', 'utf8', function readFileCallback(err, data) {
      if (err) {
         console.log(err);
      } else {
         obj = JSON.parse(data);
         console.log(obj);
      }
   });
}

var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("Your booking company app listening at http://%s:%s", host, port)
})
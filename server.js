const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const PORT = 3000;
var googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyA965Ub9-kBTqCFwE5ySfP9hXp07Yh-MEk'
});
var fs = require('fs');


/** @function autoUpdate() - automated function that is called when
@function init() is called. This function then automates the data to
be updated on a 24 hour basis
*/

function autoUpdate(){
  console.log("checked");
  var request = require('request');
  setInterval(function(){
    request('https://script.googleusercontent.com/macros/echo?user_content_key=mOuED-W9TuQoE1bFzetzUmLBZksfwChhZWoMHqafVn05uUrIQ8riWv0FxR8bpjWnCDdRFeXBVdxw-A2y7Py72SsKy0SSeeooOJmA1Yb3SEsKFZqtv3DaNYcMrmhZHmUMWojr9NvTBuBLhyHCd5hHa1ZsYSbt7G4nMhEEDL32U4DxjO7V7yvmJPXJTBuCiTGh3rUPjpYM_V0PJJG7TIaKpyL-ijJ-ZEyPjb-IzDCQSDSKG7_zsK1EKAvX-WKjzxZzzWANPnCMp7MZS2N5kd6RbVmMFv4gF1-vE-iev1o-8vDIEB_jcADA_w&lib=MbpKbbfePtAVndrs259dhPT7ROjQYJ8yx', function (error, response, body) {
      if (!error && response.statusCode == 200) {
        updateData(body);
      }
    })
  }, 86400000);

}


/** @function updateData() - updates the alumni JSON file for new users
*/

function updateData(data){
  console.log(data);
  //obtain json file
  setIntervalAPI(data, 1000);

}

/** @function getGeoloc() - uses Google Map's geocoding function to make geolocation
requests based on a string address. The string is inputed from the alumni json
that is pulled from the json data passed down from the request method
*/

function getGeoloc(location, data, pos){
  googleMapsClient.geocode({
    address: location
  }, function(err, response) {
    if (!err) {
      var temp = (response.json.results[0].geometry.location);
      console.log(temp);
      data.TAResponses[pos].lat = temp.lat;
      data.TAResponses[pos].lng = temp.lng;
    }

  });
}


/** @function setIntervalAPI() - a modified function of setInterval() to process
new Alumni Content
*/

function setIntervalAPI(data, delay){
  var count = 0;
  data = JSON.parse(data);
  console.log(data.TAResponses.length);
  var interval = setInterval( () => {
    if(count === data.TAResponses.length){
      clearInterval(interval)
      console.log("Completed");
      data = JSON.stringify(data);
      fs.writeFile('./data/alumni.json', data, 'utf8', (err) =>{
        if (err) throw err;
      })
    }
    else{
      getGeoloc(data.TAResponses[count].Current_Location, data, count);
      count++;
    }
  }, delay);
}


/** @function readJSONFile - posts the local alumni.json file to allow GET Requests
of the file to be obtained at the route /api/getAlumni
*/

function readJSONFile(filename, callback) {
  fs.readFile(filename, function (err, data) {
    if(err) {
      callback(err);
      return;
    }
    try {
      callback(null, JSON.parse(data));
    } catch(exception) {
      callback(exception);
    }
  });
}


/** @function init() - Initializes automated loop for updating JSON file
*/

function init(){
  console.log("initiated");
  autoUpdate();
}

//body parser for JSON files
app.use(bodyParser.json());

// //allows Cross Origin Requests to obtain JSON data
// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });

app.use('/', express.static('./public'))

//allows requesting of ./data/alumni.json file
app.get('/api/getAlumni', (req,res, next) => {
  readJSONFile('./data/alumni.json', function (err, json) {
    if(err) { throw err; }
    res.send(json)
  });
});

app.listen(PORT, () => {
  console.log("Server Running on port 3000")
  init();
})

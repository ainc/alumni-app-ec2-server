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
    request('https://script.googleusercontent.com/macros/echo?user_content_key=K1E85EiRkGvkNnkwdiT6jmlX9xSU6hUvetLTNzpCcd_jSC2GpNbwZfr0KcbLfJdiHrUouVDeG7bCkVA0V_Fi5YMBTitaxVEdOJmA1Yb3SEsKFZqtv3DaNYcMrmhZHmUMWojr9NvTBuBLhyHCd5hHa1ZsYSbt7G4nMhEEDL32U4DxjO7V7yvmJPXJTBuCiTGh3rUPjpYM_V0PJJG7TIaKp1q6LyBxbset-sbB7gU77AXzTewdOjiNZcuPDH50tUN-GOHXQiXJz0ANQ8AP0ES9ozQJv8DXWa1hoIgY-huuTFg&lib=MbpKbbfePtAVndrs259dhPT7ROjQYJ8yx', function (error, response, body) {
      if (!error && response.statusCode == 200) {
        updateData(body);
      }
    })
  }, 86400000);

}


/** @function updateData() - updates the alumni JSON file for new users
*/

function updateData(data){

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
      data.Form1[pos].lat = temp.lat;
      data.Form1[pos].lng = temp.lng;
    }

  });
}


/** @function setIntervalAPI() - a modified function of setInterval() to process
new Alumni Content
*/

function setIntervalAPI(data, delay){
  var count = 0;
  data = JSON.parse(data);
  console.log(data.Form1.length);
  var interval = setInterval( () => {
    if(count === data.Form1.length){
      clearInterval(interval)
      console.log("Completed");
      data = JSON.stringify(data);
      fs.writeFile('./data/alumni.json', data, 'utf8', (err) =>{
        if (err) throw err;
      })
    }
    else{
      getGeoloc(data.Form1[count].location, data, count);
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

//allows Cross Origin Requests to obtain JSON data
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

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

var express = require('express');
var app = express();
var fs = require('fs');
var csvWriter = require('csv-write-stream');


// for user study testing purpose
// var trialStarted = false;

// for actual user study
var trialStarted = true;
var outputFile = 'trials.csv';
var sendHeader = true;


app.post('/', function (req, res) {
    debugger;
    res.send('Hello World!')
});

function getParameterByName(name, url) {
    if (!url) {
        url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}


app.get('/', function (req, res) {

    var buf = new Buffer([
        0x47, 0x49, 0x46, 0x38, 0x39, 0x61, 0x01, 0x00, 0x01, 0x00,
        0x80, 0x00, 0x00, 0xff, 0xff, 0xff, 0x00, 0x00, 0x00, 0x2c,
        0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x00, 0x02,
        0x02, 0x44, 0x01, 0x00, 0x3b]);


    res.send(buf, { 'Content-Type': 'image/gif' }, 200);

    console.log(req.url);

    var obj = {
        logTimestamp: (new Date()).getTime(),
        graphType: null,
        task: null,
        questionKey: null,
        correct: false,
        duration: null,
        y1: null,
        v1: null,
        y2: null,
        v2: null,
        y3: null,
        v3: null,
        y4: null,
        v4: null,
        query: req.url
    };

    var query = req.query;

    if (query.hasOwnProperty("graphType")) {
        obj.graphType = query["graphType"];
    }
    else {
        console.log("Missing 'graphType' query param");
        return;
    }

    if (query.hasOwnProperty("task")) {
        obj.task = query["task"];
    }
    else {
        console.log("Missing 'task' query param");
        return;
    }


    if (query.hasOwnProperty("questionKey")) {
        obj.questionKey = query["questionKey"];
    }
    else {
        console.log("Missing 'questionKey' query param");
        return;
    }

    if (query.hasOwnProperty("duration")) {
        obj.duration = query["duration"];
    }
    else {
        console.log("Missing 'duration' query param");
        return;
    }

    if (query.hasOwnProperty("correct")) {
        obj.correct = query["correct"];
    }

    if (query.hasOwnProperty("y1")) {
        obj.y1 = query["y1"];
    }
    if (query.hasOwnProperty("v1")) {
        obj.v1 = query["v1"];
    }

    if (query.hasOwnProperty("y2")) {
        obj.y2 = query["y2"];
    }
    if (query.hasOwnProperty("v2")) {
        obj.v2 = query["v2"];
    }

    if (query.hasOwnProperty("y3")) {
        obj.y3 = query["y3"];
    }
    if (query.hasOwnProperty("v3")) {
        obj.v3 = query["v3"];
    }

    if (query.hasOwnProperty("y4")) {
        obj.y4 = query["y4"];
    }
    if (query.hasOwnProperty("v4")) {
        obj.v4 = query["v4"];
    }

    if (trialStarted == false) {
        console.log(obj);
        return;
    }


    var writer = csvWriter({sendHeaders: sendHeader});
    writer.pipe(fs.createWriteStream(outputFile, {'flags': 'a'}));
    writer.write(obj);
    writer.end();

    sendHeader = false;

});


app.listen(3000, function () {
    console.log('User study server is listening on port 3000!')
});
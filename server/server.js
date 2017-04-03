var express = require('express');
var app = express();
var fs = require('fs');
var csvWriter = require('csv-write-stream');


var trialStarted = false;
var outputFile = 'trials.csv';



app.post('/', function (req, res) {
    debugger;
    res.send('Hello World!')
});

app.get('/', function (req, res) {

    var buf = new Buffer([
        0x47, 0x49, 0x46, 0x38, 0x39, 0x61, 0x01, 0x00, 0x01, 0x00,
        0x80, 0x00, 0x00, 0xff, 0xff, 0xff, 0x00, 0x00, 0x00, 0x2c,
        0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x00, 0x02,
        0x02, 0x44, 0x01, 0x00, 0x3b]);


    res.writeHead(200, {'Content-Type': 'image/gif' });
    res.end(buf, 'binary');
    res.send(buf, { 'Content-Type': 'image/gif' }, 200);

    console.log(req.url);

    var obj = {
        logTimestamp: (new Date()).getTime(),
        graphType: null,
        questionKey: null,
        correct: false,
        duration: null
    };

    var query = req.query;

    if (query.hasOwnProperty("graphType")) {
        obj.graphType = query["graphType"];
    }
    else {
        console.log("Missing 'graphType' query param");
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

    if (trialStarted == false) {
        console.log(obj);
        return;
    }



    var writer = csvWriter();
    writer.pipe(fs.createWriteStream(outputFile, {'flags': 'a'}));
    writer.write(obj);
    writer.end();

});


app.listen(3000, function () {
    console.log('User study server is listening on port 3000!')
});
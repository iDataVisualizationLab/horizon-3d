var fs = require('fs');
var parse = require('csv-parse');

var csvWriter = require('csv-write-stream');

var filename = "trials.csv";

var dataSummary = {

};

// remove rows and cols in odd index, starting from 0
var convertToJsonArray = function () {

    var skipHeader = true;
    fs.createReadStream(filename)
        .pipe(parse({delimiter: ','}))
        .on('data', function(csvrow) {
            if (skipHeader == true) {
                skipHeader = false;
                return;
            }

            var graphType = csvrow[2];

            var numYears = +csvrow[1];
            var correct = (csvrow[5].toLowerCase() == "true");
            var duration = +csvrow[6]; // ms

            if (!dataSummary.hasOwnProperty(numYears)) {
                dataSummary[numYears] = {};
            }

            if (!dataSummary[numYears].hasOwnProperty(graphType)) {
                dataSummary[numYears][graphType] = {
                    count: 0,
                    correct: 0,
                    duration: 0,
                    accuracyPercentage: 0,
                    averageTime: 0
                }
            }

            dataSummary[numYears][graphType].count ++;
            dataSummary[numYears][graphType].duration += duration;

            if (correct == true) {
                dataSummary[numYears][graphType].correct ++;
            }

            var total =  dataSummary[numYears][graphType].count;
            var correct =  dataSummary[numYears][graphType].correct;
            var totalTime = dataSummary[numYears][graphType].duration;


            if (total != 0) {
                dataSummary[numYears][graphType].accuracyPercentage = (correct * 100) / total;
                dataSummary[numYears][graphType].averageTime = totalTime / total;
            }

        })
        .on('end',function() {

            console.log(dataSummary);
            console.log("done");
        });
};

convertToJsonArray();


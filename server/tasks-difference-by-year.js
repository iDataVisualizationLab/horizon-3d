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
            var task = csvrow[3];

            if (task != 'Task1' && task != 'Task2') {
                console.log("Error in task data. ");
                console.log(csvrow);
                return;
            }

            if (!dataSummary.hasOwnProperty(numYears)) {
                dataSummary[numYears] = {};
            }

            if (!dataSummary[numYears].hasOwnProperty(graphType)) {
                dataSummary[numYears][graphType] = {};
            }

            var tempTasks = dataSummary[numYears][graphType];

            if (!tempTasks.hasOwnProperty(task)) {
                tempTasks[task] = {
                    count: 0,
                    correct: 0,
                    duration: 0,
                    accuracyPercentage: 0,
                    averageTime: 0
                }
            }

            tempTasks[task].count ++;
            tempTasks[task].duration += duration;

            if (correct == true) {
                tempTasks[task].correct ++;
            }

            var total =  tempTasks[task].count;
            var correct =  tempTasks[task].correct;
            var totalTime = tempTasks[task].duration;


            if (total != 0) {
                tempTasks[task].accuracyPercentage = (correct * 100) / total;
                tempTasks[task].averageTime = totalTime / total;
            }

        })
        .on('end',function() {
            var tasks;
            for(var numYr in dataSummary) {
                for(var gType in dataSummary[numYr]) {
                    tasks = dataSummary[numYr][gType];
                    tasks['accuracyDifference'] = tasks['Task1'].accuracyPercentage -  tasks['Task2'].accuracyPercentage;
                    tasks['timeDifference'] = tasks['Task2'].averageTime -  tasks['Task1'].averageTime;
                }
            }

            console.log(dataSummary);

            console.log("done");
        });
};

console.log({test: {test: {test: {est: 100}}}});

convertToJsonArray();


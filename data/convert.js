var fs = require('fs');
var parse = require('csv-parse');
// var jsonfile = require('jsonfile');
var csvWriter = require('csv-write-stream');


// remove rows and cols in odd index, starting from 0
var convertToJsonArray = function () {

    var skipHeader = true;

    var rowIndex = 0;

    var file = 'ogallala.original.csv';

    var writer = csvWriter();
    writer.pipe(fs.createWriteStream(file));

    fs.createReadStream('ascii_2013all.original.csv')
    .pipe(parse({delimiter: ','}))
    // fs.createReadStream('ascii_2013all.optimized-2-2.csv')
    //     .pipe(parse({delimiter: ','}))
        .on('data', function(csvrow) {
            if (skipHeader == true) {
                skipHeader = false;
                rowIndex ++;
                return;
            }

            var obj;

            for(var i =0; i< csvrow.length; i++) {
                obj = {
                    lat: i,
                    lon: rowIndex,
                    sat: +csvrow[i]
                };

                writer.write(obj);
            }

            rowIndex++;

        })
        .on('end',function() {

            writer.end();

            console.log("done");
        });
};

convertToJsonArray();

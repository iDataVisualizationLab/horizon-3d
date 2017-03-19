var fs = require('fs');
var parse = require('csv-parse');
var csvWriter = require('csv-write-stream')

// remove rows and cols in odd index, starting from 0
var convertToJsonArray = function () {

    var writer = csvWriter();
    var skipHeader = true;

    writer.pipe(fs.createWriteStream('ogallala.saturated.thickness.csv'));




    // fs.createReadStream('ascii_2013all.original.csv')
    fs.createReadStream('ascii_2013all.optimized-2-2.csv')
        .pipe(parse({delimiter: '\t'}))
        .on('data', function(csvrow) {
            if (skipHeader == true) {
                skipHeader = false;

                return;
            }

            console.log(csvrow);

        })
        .on('end',function() {
            writer.end();

        });
};

convertToJsonArray();

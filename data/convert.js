var fs = require('fs');
var parse = require('csv-parse');
var jsonfile = require('jsonfile');


// remove rows and cols in odd index, starting from 0
var convertToJsonArray = function () {

    var skipHeader = true;

    var rowIndex = 0;

    var file = 'ogallala.json';
    var dataJson = [];

    // fs.createReadStream('ascii_2013all.original.csv')
    // .pipe(parse({delimiter: '\t'}))
    fs.createReadStream('ascii_2013all.optimized-2-2.csv')
        .pipe(parse({delimiter: ','}))
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

                dataJson.push(obj);


            }

            rowIndex++;

        })
        .on('end',function() {
            jsonfile.writeFile(file, dataJson, function (err) {

                if (err != null) {
                    console.error(err)
                }
            });

            console.log("done");
        });
};

convertToJsonArray();

var graphTypes = ['merged', 'multiple', 'horizon'];
// level 200
// 12x255; 45x43; 55x236


// level above 600
// 60x72, 54x59, 57x56
var locations = [
    [
        {
        lat: 57,
        lon: 56,
        sat: null
        },
        {
            lat: 12,
            lon: 255,
            sat: null
        },
        {
            lat: 55,
            lon: 236,
            sat: null
        },
        {
            lat: 60,
            lon: 72,
            sat: null
        },
    ],
    [
        {
            lat: 60,
            lon: 72,
            sat: null
        },
        {
            lat: 118,
            lon: 57,
            sat: null
        },
        {
            lat: 45,
            lon: 53,
            sat: null
        },
        {
            lat: 12,
            lon: 255,
            sat: null
        }
    ],
    [
        {
            lat: 60,
            lon: 72,
            sat: null
        },
        {
            lat: 118,
            lon: 57,
            sat: null
        },
        {
            lat: 55,
            lon: 236,
            sat: null
        },
        {
            lat: 60,
            lon: 72,
            sat: null
        }
    ]
];

var startTime = (new Date()).getTime();

var trialLocationIndex = (100 * Math.round(Math.random())) % (locations.length);
var trialLocation = locations[trialLocationIndex];

function nextLocations() {
    trialLocationIndex = (100 * Math.round(Math.random())) % (locations.length);
    trialLocation = locations[trialLocationIndex];
}

var queryParamUrl = 'lat1=' + trialLocation[0].lat + '&lon1=' + trialLocation[0].lon + '&lat2=' + trialLocation[1].lat + '&lon2=' + trialLocation[1].lon + '&lat3=' + trialLocation[2].lat + '&lon3=' + trialLocation[2].lon + '&lat4=' + trialLocation[3].lat + '&lon4=' + trialLocation[3].lon;
var graphTypeToFile = {
    merged: 'task2/ogallala.merged.3-years.html?' + queryParamUrl,
    multiple: 'task2/ogallala.small.multiple.html?' + queryParamUrl,
    horizon: 'task2/ogallala.horizon.single.surface.html?' + queryParamUrl
};

var currentQuestionIndex = -1;
var currentGraphTypeIndex = 0;
var graphType = graphTypes[currentGraphTypeIndex];


function handleQuestionConfirm() {
    // debugger;
    if (currentQuestionIndex > -1) {
        // handle logging
        fireLogging(graphType);
    }

    currentQuestionIndex ++;
    displayQuestion();

}

function nextGraphType() {
    currentQuestionIndex = 0;
    currentGraphTypeIndex ++;

    if (currentGraphTypeIndex == graphTypes.length) {
        alert("You are done");

        return;
    }


    nextLocations();

    queryParamUrl = 'lat1=' + trialLocation[0].lat + '&lon1=' + trialLocation[0].lon + '&lat2=' + trialLocation[1].lat + '&lon2=' + trialLocation[1].lon + '&lat3=' + trialLocation[2].lat + '&lon3=' + trialLocation[2].lon + '&lat4=' + trialLocation[3].lat + '&lon4=' + trialLocation[3].lon;
    graphTypeToFile = {
        merged: 'task2/ogallala.merged.3-years.html?' + queryParamUrl,
        multiple: 'task2/ogallala.small.multiple.html?' + queryParamUrl,
        horizon: 'task2/ogallala.horizon.single.surface.html?' + queryParamUrl
    };

    currentGraphTypeIndex = currentGraphTypeIndex % graphTypes.length;
    graphType = graphTypes[currentGraphTypeIndex];

    startTime = (new Date()).getTime();
}

function displayGraphType(graphType) {
    if (!graphTypeToFile.hasOwnProperty(graphType)) {
        alert("Not found fine representation for this graph type: " + graphType);
        return;
    }


    d3.select("#graphType")
        .text("Graph type: " + graphType);

    var file = graphTypeToFile[graphType];
    var iframe = document.getElementById('graph');
    var src = iframe.getAttribute('src');
    if (file != src) {
        d3.select('#graph').attr('src', file);
    }
}

function displayQuestion() {

    if (currentQuestionIndex >= questionsAndAnswers.length) {

        nextGraphType();
    }


    var questionAnswer =  questionsAndAnswers[currentQuestionIndex];

    d3.select("#question")
        .text(questionAnswer.question.text);


    d3.select("#answer")
        .selectAll('*')
        .remove();


    if (graphType == graphTypes[0]) {
        d3.select("#answer").selectAll('span')
            .data(questionAnswer.answer).enter()
            .append('span')
            .html(function (d) {
                return '<input type="radio" name="answer" value="' + d.key  + '"/> <span style="color:' + d.color + '">'+ d.text + '</span>' +
                    '<span style="font-weight: bold; color:' + d.helpColor + '">' + d.help + '</span>' +
                    '<br/>';
            });
    }
    else {
        d3.select("#answer").selectAll('span')
            .data(questionAnswer.answer).enter()
            .append('span')
            .html(function (d) {
                return '<input type="radio" name="answer" value="' + d.key  + '"/>'+ d.text +
                    '<span style="font-weight: bold; color:' + d.helpColor + '">' + d.help + '</span>' +

                    '<br/>';
            });
    }

    displayGraphType(graphType);

}

handleQuestionConfirm();



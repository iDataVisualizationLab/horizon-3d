var graphTypes = ['merged', 'multiple', 'horizon'];
var locations = [
    {
        lat: 20,
        lon: 1,
        sat: null

    },

    {
        lat: 18,
        lon: 23,
        sat: null
    },

    {
        lat: 57,
        lon: 56,
        sat: null
    },

    {
        lat: 63,
        lon: 74,
        sat: null
    }
];

var trialLocationIndex = (locations.length -1) * Math.round(Math.random());
var trialLocation = locations[trialLocationIndex];

var graphTypeToFile = {
    merged: 'task1/ogallala.merged.3-years.html?lat=' + trialLocation.lat + '&lon=' + trialLocation.lon ,
    multiple: 'task1/ogallala.small.multiple.html?lat=' + trialLocation.lat + '&lon=' + trialLocation.lon ,
    horizon: 'task1/ogallala.horizon.single.surface.html?lat=' + trialLocation.lat + '&lon=' + trialLocation.lon
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

    currentGraphTypeIndex = currentGraphTypeIndex % graphTypes.length;
    graphType = graphTypes[currentGraphTypeIndex];


}

function displayGraphType(graphType) {
    if (!graphTypeToFile.hasOwnProperty(graphType)) {
        alert("Not found fine representation for this graph type: " + graphType);
        return;
    }

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

    d3.select("#answer").selectAll('span')
        .data(questionAnswer.answer).enter()
        .append('span')
        .html(function (d) {
            return '<input type="radio" name="answer" value="' + d.key  + '"/> ' + d.text + '<br/>';
        });


    displayGraphType(graphType);

}

handleQuestionConfirm();



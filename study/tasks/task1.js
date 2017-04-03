var graphTypes = ['merged', 'multiple', 'horizon'];
var graphTypeToFile = {
    merged: 'ogallala.merged.3-years.html',
    multiple: 'ogallala.small.multiple.html',
    horizon: 'ogallala.horizon.single.surface.html'
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



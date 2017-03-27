var graphTypeMerged = "merged";
var graphTypeSmallMultiple = "multiple";
var graphTypeHorizon = "horizon";
var graphTypes = [graphTypeMerged, graphTypeSmallMultiple, graphTypeHorizon];


var currentQuestionIndex = -1;
var currentGraphTypeIndex = 0;
var graphType = graphTypes[currentGraphTypeIndex];


function handleQuestionConfirm() {

    if (!questionsAndAnswers.hasOwnProperty(graphType)) {
        alert("No questions on this graph type");

        return;
    }
    // debugger;
    if (currentQuestionIndex > -1) {
        // handle logging
        fireLogging();
    }


    currentQuestionIndex ++;
    displayQuestion(currentQuestionIndex);


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

function fireLogging() {


    if (!questionsAndAnswers.hasOwnProperty(graphType)) {
        console.log("Nothing to log. Invalid graph type: " + graphType);
        return;
    }

    var graphTypeQuestions = questionsAndAnswers[graphType];

    if (currentQuestionIndex >= graphTypeQuestions.length) {
        console.log("Nothing to log. graph type: " + graphType + "; has invalid question index:" + currentQuestionIndex);
        return;
    }

    var questionAnswer =  graphTypeQuestions[currentQuestionIndex];
    var a = d3.select('#answer').select('input[name="answer"]:checked').node().value;
    // d3.select('input[name="group-stack"]:checked').node().value;


    var httpGetAsync = function httpGetAsync(theUrl, callback)
    {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function() {
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {

                if (!!callback) {
                    callback(xmlHttp.responseText);
                }
            }

        };
        xmlHttp.open("GET", theUrl, true); // true for asynchronous
        xmlHttp.send(null);
    };

    var myUrl = httpURLBase + '?test=myVarValue';
    httpGetAsync(myUrl);
    console.log(questionAnswer);
    console.log(a);
}

function displayQuestion(currentQuestionIndex) {

    if (!questionsAndAnswers.hasOwnProperty(graphType)) {
        alert("No questions on this graph type to display");

        return;
    }

    var graphTypeQuestions = questionsAndAnswers[graphType];

    if (currentQuestionIndex >= graphTypeQuestions.length) {
        nextGraphType();
    }


    var questionAnswer =  graphTypeQuestions[currentQuestionIndex];

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
        })
}

handleQuestionConfirm();


//
// var choices = ["Number of measurements", "Average over time", "Standard deviation", "Sudden increase", "Sudden decrease"];
// var averageChoices = [numNeighbor +" Neighbor", "County"];
// var wellDomain = {};
//
// var select =d3.select("#selectDiveOption")
//     .append('select')
//     .attr('class','select')
//     .attr('id','selectRadiusStrategyOption')
//     .on('change',changeSelection);
//
// var selectAverage =d3.select("#averageDivOption")
//     .append('select')
//     .attr('class','select')
//     .on('change',changeAverage);
//
// var options = select
//     .selectAll('option')
//     .data(choices).enter()
//     .append('option')
//     .text(function (d) { return d; });



function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}

var locations = [
    {
        x: 100,
        y: 250
    },

    {
        x: 150,
        y: 200
    },

    {
        x: 100,
        y: 300
    }
];

var trialLocationIndex = 2* Math.round(Math.random());
var trialLocation = locations[trialLocationIndex];

console.log(trialLocation);

var httpURLBase = 'http://localhost:3000';
var userId = guid();
var questionsAndAnswers =  [
        {
            question: {
                key: "t1q1",
                text: "What year has highest saturated thickness?"
            },
            answer: [
                {
                    key: "t1q1a1",
                    text:  "Year 2011"
                }
                ,
                {
                    key: "t1q1a2",
                    text:  "Year 2012"
                }
                ,
                {
                    key: "t1q1a3",
                    text:  "Year 2013"
                }
            ]
        }
];


function fireLogging(graphType) {


    var graphTypeQuestions = questionsAndAnswers;

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

    var myUrl = httpURLBase + '?user=' + userId + '&graphType=' + graphType + '&task=Task1&questionKey=' + questionAnswer.question.key + '&correct=1' + '&duration=20';
    httpGetAsync(myUrl);
    console.log(questionAnswer);
    console.log(a);
}

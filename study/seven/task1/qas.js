
function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}

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
                    key: "2011",
                    text:  "Year 2011 (black dot)"
                }
                ,
                {
                    key: "2012",
                    text:  "Year 2012 (red dot)"
                }
                ,
                {
                    key: "2013",
                    text:  "Year 2013 (green dot)"
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

    var iframe = document.getElementById("graph");
    var win = iframe.contentWindow;
    var correct = win.maxYear.year == a;

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

    var endTime = (new Date()).getTime();
    var dur = endTime - startTime;
    var myUrl = httpURLBase + '?user=' + userId + '&graphType=' + graphType + '&task=Task1&questionKey=' + questionAnswer.question.key + '&correct=' + correct + '&duration=' + dur;
    httpGetAsync(myUrl);
    console.log(questionAnswer);
    console.log(a);
}

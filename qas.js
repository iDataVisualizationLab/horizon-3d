
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
        },


        {
            question: {
                key: "t1q2",
                text: "What location has highest saturated thickness"
            },
            answer: [
                {
                    key: "answer1",
                    text:  "Location 1 year 2011"
                }
                ,
                {
                    key: "answer2",
                    text:  "Location 2 year 2012"
                }
                ,
                {
                    key: "answer3",
                    text:  "Location 3 year 2013"
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

    var myUrl = httpURLBase + '?user=' + userId + 'graphType=' + graphType + '&q=' + questionAnswer.question.key + '&a=' + a;
    httpGetAsync(myUrl);
    console.log(questionAnswer);
    console.log(a);
}

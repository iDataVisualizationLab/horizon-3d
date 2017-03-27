
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
var questionsAndAnswers =  {
    horizon: [
        {
            question: {
                key: "t1q1",
                text: "What is the highest value?"
            },
            answer: [
                {
                    key: "t1q1a1",
                    text:  "This is answer 1"
                }
                ,
                {
                    key: "t1q1a2",
                    text:  "This is answer 2"
                }
                ,
                {
                    key: "t1q1a3",
                    text:  "This is answer 3"
                }
            ]
        },


        {
            question: {
                key: "t1q2",
                text: "What is the lowest value?"
            },
            answer: [
                {
                    key: "answer1",
                    text:  "This is answer 2"
                }
                ,
                {
                    key: "answer2",
                    text:  "This is answer 2"
                }
                ,
                {
                    key: "answer3",
                    text:  "This is answer 3"
                }
            ]
        }
    ],
    merged: [
        {
            question: {
                key: "t1q1",
                text: "What is the highest value?"
            },
            answer: [
                {
                    key: "t1q1a1",
                    text:  "This is answer 1"
                }
                ,
                {
                    key: "t1q1a2",
                    text:  "This is answer 2"
                }
                ,
                {
                    key: "t1q1a3",
                    text:  "This is answer 3"
                }
            ]
        },


        {
            question: {
                key: "t1q2",
                text: "What is the lowest value?"
            },
            answer: [
                {
                    key: "answer1",
                    text:  "This is answer 2"
                }
                ,
                {
                    key: "answer2",
                    text:  "This is answer 2"
                }
                ,
                {
                    key: "answer3",
                    text:  "This is answer 3"
                }
            ]
        }
    ],
    multiple: [
        {
            question: {
                key: "t1q1",
                text: "What is the highest value?"
            },
            answer: [
                {
                    key: "t1q1a1",
                    text:  "This is answer 1"
                }
                ,
                {
                    key: "t1q1a2",
                    text:  "This is answer 2"
                }
                ,
                {
                    key: "t1q1a3",
                    text:  "This is answer 3"
                }
            ]
        },


        {
            question: {
                key: "t1q2",
                text: "What is the lowest value?"
            },
            answer: [
                {
                    key: "answer1",
                    text:  "This is answer 2"
                }
                ,
                {
                    key: "answer2",
                    text:  "This is answer 2"
                }
                ,
                {
                    key: "answer3",
                    text:  "This is answer 3"
                }
            ]
        }
    ]
};


function fireLogging(graphType) {


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

    var myUrl = httpURLBase + '?user=' + userId + 'graphType=' + graphType + '&q=' + questionAnswer.question.key + '&a=' + a;
    httpGetAsync(myUrl);
    console.log(questionAnswer);
    console.log(a);
}

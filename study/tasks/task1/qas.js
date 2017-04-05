
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
var cTen = d3.scale.category10();
var colorRange = cTen.range();

var questionsAndAnswers =  [
        {
            question: {
                key: "t1q1",
                text: "What year has highest saturated thickness?"
            },
            answer: [
                {
                    key: "2010",
                    text:  "Year 2010 (yellow dot)",
                    color: colorRange[0]

                }
                ,
                {
                    key: "2014",
                    text:  "Year 2014 (red dot)",
                    color: colorRange[1]

                }
                ,
                {
                    key: "2016",
                    text:  "Year 2016 (green dot)",
                    color: colorRange[2]

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

    debugger;

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
    var maxStr = convertMaxYeartoQueryString(win.maxYear);
    var myUrl = httpURLBase + '?user=' + userId + '&graphType=' + graphType + '&task=Task1&questionKey=' + questionAnswer.question.key + '&correct=' + correct + '&duration=' + dur + "&selected=" + a + maxStr;
    httpGetAsync(myUrl);
    console.log(questionAnswer);
    console.log(a);
}

function convertMaxYeartoQueryString(maxYear) {
    var str = '';
    var val;
    var yr;
    for (i=1; i<= 10; i++) {
        val =  "v" + i;
        yr = "y" + i;
        if (!maxYear.hasOwnProperty(val) || !maxYear.hasOwnProperty(yr)) {
            console.log("Error, not found year " + yr + "; val:" + val);
            break;
        }
        str += '&' + val + "=" + maxYear[val] + "&" + yr + "=" + maxYear[yr]
    }


    return str;
}
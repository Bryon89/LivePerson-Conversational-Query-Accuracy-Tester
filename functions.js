var bearertoken;
var vbresponse;
var vbqueryresponse;

//This makes a quick API call to VoiceBase to check if the Bearer token is valid. It will print a success or failure response on the page.
function validateBearerToken() {
  window.bearertoken = document.getElementById("bearertoken").value;
  var settings = {
    "crossDomain": true,
    "url": "https://apis.voicebase.com/v3/media",
    "method": "GET",
    "headers": {
      "accept": "application/json",
      "Authorization": `Bearer ${bearertoken}`
    },
    "processData": false,
    "contentType": false,
    success: function(data) {
      document.getElementById(`btvalidationresponse`).innerHTML = "Success, this is a valid Bearer Token.";
      },
    error: function(nodata) {
      document.getElementById(`btvalidationresponse`).innerHTML = "Error, this is an invalid Bearer Token. Try Again.";
    }
  }
  $.ajax(settings).done(function (response) {
    console.log(response);
  });
}

//This makes the query API request to VoiceBase and collects the query results.
function queryAPIRequest() {
  var settings = {
    "crossDomain": true,
    "url": "https://apis.voicebase.com/v3/analytics/vbql",
    "method": "POST",
    "headers": {
      "accept": "application/json",
      "Authorization": `Bearer ${bearertoken}`
    },
    "data": document.getElementById("Query").value,
    "processData": false,
    "contentType": false,
    success: function(data) {
      window.vbqueryresponse = data;
      document.getElementById(`querylog`).innerHTML = document.getElementById("Query").value;
      document.getElementById(`Accuracy`).innerHTML = "X%";
      document.getElementById(`Total`).innerHTML = "10";
      document.getElementById(`TP`).innerHTML = "W";
      document.getElementById(`TN`).innerHTML = "X";
      document.getElementById(`FP`).innerHTML = "Y";
      document.getElementById(`FN`).innerHTML = "Z";
      document.getElementById(`FN`).innerHTML = vbqueryresponse.rows[0].mediaId;
      var arr = [];
      for (var i = 0; i < 5; i++)
      {
      arr.push({ val: vbqueryresponse.rows[i].mediaId});     
      };
      arr.forEach(function(entry) {
        console.log(entry);
      });
      document.getElementById(`allhits`).innerHTML = arr;
    },
    error: function(nodata) {
      document.getElementById(`querylog`).innerHTML = "The query API had an error.";
    }
  }
  $.ajax(settings).done(function (response) {
    console.log(response);
  });
}

/* This is needed for csv reading */
const form = document.querySelector("#csvScoresForm");
const csvFileInput = document.querySelector("#csvScores");
const csvtextArea = document.querySelector("#csvResult");

form.addEventListener("submit", function (e) {
  e.preventDefault();
  const file = csvFileInput.files[0];
  const reader = new FileReader();

  reader.onload = function (e) {
    const csvArray = csvToArr(e.target.result, ",");
    console.log("textarea: ", csvtextArea);
    csvtextArea.value = JSON.stringify(csvArray, null, 4).replace(/\\r/g, "");
    console.log(csvArray);
  };

  reader.readAsText(file);
});

function csvToArr(stringVal, splitter) {
  const [keys, ...rest] = stringVal
    .trim()
    .split("\n")
    .map((item) => item.split(splitter));

  const formedArr = rest.map((item) => {
    const object = {};
    keys.forEach((key, index) => (object[key] = item.at(index)));
    return object;
  });
  return formedArr;
}
/* end needed for csv reading */


//Proably not needed
function outputResults() {
    var divContents = document.getElementById("Accuracy").innerHTML = 'Accuracy: X%';
    var divContents = document.getElementById("Total").innerHTML = 'Total Scored Calls:';

    var divContents = document.getElementById("TP").innerHTML = 'True Positives: Y';
    var divContents = document.getElementById("TN").innerHTML = 'True Negatives: Z';

    var divContents = document.getElementById("FP").innerHTML = 'False Positives: ZA';
    var divContents = document.getElementById("FN").innerHTML = 'False Negatives: ZB';

    var divContents = document.getElementById("querylog").innerHTML = 'SELECT * by whatever blah blah';
}

//Just using to show that we have the mediaIds from the query
function printjobs() {
  var i = 0;
        document.getElementById(`mediaId0`).innerHTML = vbresponse.media[0].mediaId;
}
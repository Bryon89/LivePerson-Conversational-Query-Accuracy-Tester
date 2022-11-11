//Global Variables
var bearertoken;
var vbresponse;
var vbqueryresponse;
var humanScores = [];

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


//Calculate Accuracy, TP, FP, TN, FN
function calculateAccuracy(hitMediaIds, humanScores) {


  var TP = calcTP(hitMediaIds, humanScores);
  var TN = calcTN(hitMediaIds, humanScores);
  var FP = calcFP(hitMediaIds, humanScores);
  var FN = calcFN(hitMediaIds, humanScores);

  var Accuracy = ((TP+TN)/(TP+TN+FP+FN));
  var Total = TP + TN + FP + FN;

  console.log("TP IS");
  console.log(TP);
  console.log("TN IS");
  console.log(calcTN(hitMediaIds, humanScores));
  console.log("FP IS");
  console.log(calcFP(hitMediaIds, humanScores));
  console.log("FN IS");
  console.log(calcFN(hitMediaIds, humanScores));

  document.getElementById(`TP`).innerText = TP;
  document.getElementById(`TN`).innerText = TN;
  document.getElementById(`FP`).innerText = FP;
  document.getElementById(`FN`).innerText = FN;
  document.getElementById(`Accuracy`).innerText = Accuracy;
  document.getElementById(`Total`).innerText = Total;

}

function calcTP(hitMediaIds, humanScores) {
  var i = 0;
  var TP = 0;

  while (i < humanScores.length) {
    if (humanScores[i].score == 1) {
      var j = 0;
      while (j < hitMediaIds.length) {
        if (humanScores[i].mediaId == hitMediaIds[j]) {
          TP++;
          j++;
        }
        j++;
        }
      i++; 
      } else {
        i++;
      }
    } 
    return TP;
}

function calcFN(hitMediaIds, humanScores) {
  var i = 0;
  var FN = 0;

  while (i < humanScores.length) {
    if (humanScores[i].score == 1) {
      var j = 0;
      var DQ = 0;
      while (j < hitMediaIds.length) {
        if (humanScores[i].mediaId == hitMediaIds[j]) {
          j++;
        } else if (humanScores[i].mediaId != hitMediaIds[j]) {
          DQ++;
          j++;
        }
        }
        if (DQ == j) {
          FN++;
        }
      i++; 
      } else {
        i++;
      }
    } 
    return FN;
}

function calcTN(hitMediaIds, humanScores) {
  var i = 0;
  var TN = 0;

  while (i < humanScores.length) {
    if (humanScores[i].score == 0) {
      var j = 0;
      var DQ = 0;
      while (j < hitMediaIds.length) {
        if (humanScores[i].mediaId == hitMediaIds[j]) {
          j++;
        } else if (humanScores[i].mediaId != hitMediaIds[j]) {
          j++;
          DQ++;
        }
        }
        if (DQ == j) {
          TN++;
        }
      i++; 
      } else {
        i++;
      }
    } 
    return TN;
}

function calcFP(hitMediaIds, humanScores) {
  var i = 0;
  var FP = 0;

  while (i < humanScores.length) {
    if (humanScores[i].score == 0) {
      var j = 0;
      var dq = 0;
      while (j < hitMediaIds.length) {
        if (humanScores[i].mediaId == hitMediaIds[j]) {
          j++;
          FP++;
        }
        j++;
        }
      i++; 
      }
      i++;
    } 
    return FP;
}

//This makes the query API request to VoiceBase and collects the query results.
function queryAPIRequest() {
  var settings = {
    "crossDomain": true,
    "url": "https://apis.voicebase.com/v3/analytics/vbql?limit=999",
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
      var hits = [];
      hits = vbqueryresponse.rows;
      var i = 0;
      var hitMediaIds = [];
      while (i < hits.length) {
        hitMediaIds[i] = vbqueryresponse.rows[i].mediaId;
        console.log(vbqueryresponse.rows[i].mediaId);
        i++;
      }
      document.getElementById(`querylog`).innerText = document.getElementById("Query").value;
      calculateAccuracy(hitMediaIds, humanScores);

      var arr = [];
      for (var i = 0; i < 5; i++)
      {
      arr.push({ val: vbqueryresponse.rows[i].mediaId});     
      };
      arr.forEach(function(entry) {
        console.log(entry);
      });
      document.getElementById(`allhits`).innerText = hitMediaIds;
    },
    error: function(nodata) {
      document.getElementById(`querylog`).innerText = "The query API had an error.";
    }
  }
  $.ajax(settings).done(function (response) {
    console.log(response);
  });
}

/* Read  csv and add scores to global humanScores array */
const form = document.querySelector("#csvScoresForm");
const csvFileInput = document.querySelector("#csvScores");
const csvtextArea = document.querySelector("#csvResult");

form.addEventListener("submit", function (e) {
  e.preventDefault();
  const file = csvFileInput.files[0];
  const reader = new FileReader();

  reader.onload = function (e) {
    const csvArray = csvToArr(e.target.result, ",");
    csvArray.value = JSON.stringify(csvArray, null, 2).replaceAll("\\r","");
    humanScores = JSON.parse(csvArray.value);
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
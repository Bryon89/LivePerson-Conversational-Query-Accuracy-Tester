    var bearertoken;
    var vbresponse;
    var vbqueryresponse;

    function saaveBT() {
        window.bearertoken = document.getElementById("bearertoken").value;
        alert(bearertoken);
    }

    function saveQuery() {
        var query = document.getElementById("Query").value;
        alert(query);
    }

    function outputResults() {
        var divContents = document.getElementById("Accuracy").innerHTML = 'Accuracy: X%';
        var divContents = document.getElementById("Total").innerHTML = 'Total Scored Calls:';

        var divContents = document.getElementById("TP").innerHTML = 'True Positives: Y';
        var divContents = document.getElementById("TN").innerHTML = 'True Negatives: Z';

        var divContents = document.getElementById("FP").innerHTML = 'False Positives: ZA';
        var divContents = document.getElementById("FN").innerHTML = 'False Negatives: ZB';

        var divContents = document.getElementById("querylog").innerHTML = 'SELECT * by whatever blah blah';
    }

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
          document.getElementById(`validationresponse`).innerHTML = "Success, this is a valid Bearer Token.";
          },
        error: function(nodata) {
          document.getElementById(`validationresponse`).innerHTML = "Error, this is an invalid Bearer Token. Try Again.";
        }
      }
      $.ajax(settings).done(function (response) {
        console.log(response);
      });
    }

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
          document.getElementById(`Accuracy`).innerHTML = "Accuracy: X%";
          document.getElementById(`Total`).innerHTML = "Total Scored Calls:";
          document.getElementById(`TP`).innerHTML = "True Positives: W";
          document.getElementById(`TN`).innerHTML = "True Negatives: X";
          document.getElementById(`FP`).innerHTML = "False Positives: Y";
          document.getElementById(`FN`).innerHTML = "False Negatives: Z";
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

    //probably not needed?
    function printjobs() {
      var i = 0;
            document.getElementById(`mediaId0`).innerHTML = vbresponse.media[0].mediaId;
    }
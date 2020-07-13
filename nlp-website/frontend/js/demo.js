$(document).ready(function () {
  //This function called when the button is clicked

  function compareString(s1, s2, splitChar) {
    if (typeof splitChar == "undefined") {
      splitChar = " ";
    }
    var string1 = new Array();
    var string2 = new Array();

    string1 = s1.split(splitChar);
    string2 = s2.split(splitChar);
    var diff = new Array();

    if (s1.length > s2.length) {
      var long = string1;
    } else {
      var long = string2;
    }
    for (x = 0; x < long.length; x++) {
      if (string1[x] != string2[x]) {
        diff.push(string2[x]);
      }
    }

    return diff;
  }

  var oldVal = "";
  $("#note").on("change keyup paste", function () {
    //   $("#btn").click(function () {
    // val() method is used to get the values from
    // textarea and stored in txt variable
    var currentVal = $(this).val();
    if (currentVal == oldVal) {
      return; //check to prevent multiple simultaneous triggers
    }
    if (currentVal.split(" ").length != oldVal.split(" ").length) {
      var txt = $("#note").val();
      // var d = compareString(currentVal.split(), oldVal).join(" ");
      get_entity(txt);
    }
    oldVal = currentVal;
  });
  //   });

  function get_entity(txt) {
    $.ajax({
      url: "http://127.0.0.1:5000/getEntites",
      type: "post",
      dataType: "json",
      data: JSON.stringify({
        text: txt,
      }),
    }).done(function (data) {
      get_definition(data);
    });
  }

  function get_definition(entity) {
    $.ajax({
      url: "http://127.0.0.1:5000/getDefinition",
      type: "post",
      dataType: "json",
      data: JSON.stringify(entity),
    }).done(function (data) {
      var res = data["result"];
      for (var key in res) {
        btn = get_button(key);
        btn.onclick = function () {
          $("#def").html(res[key]);
          document.body.removeChild(btn);
        };
        // var btn = document.createElement("BUTTON");
        // btn.innerHTML = "enter the definition of ".concat(entity["eng"][i]);
        // document.body.appendChild(btn);
        // // $("#entity").html("enter the definition of ".concat(data["eng"]));
      }

      console.log(data);
      // $("#def").html(data["result"][entity["chn"][0]]);
    });
  }

  function get_button(ent) {
    var btn = document.createElement("BUTTON");
    btn.innerHTML = "enter the definition of ".concat(ent);
    document.body.appendChild(btn);
    return btn;
  }
});

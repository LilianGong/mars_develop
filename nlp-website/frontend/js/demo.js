$(document).ready(function () {
  function compareString(s1, s2, splitChar) {
    if (typeof splitChar == "undefined") {
      splitChar = " ";
    }
    var string1 = new Set(s1.split(splitChar));
    var string2 = new Set(s2.split(splitChar));

    var diff = new Set([...string1].filter((x) => !string2.has(x)));
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
      // var d = currentVal.localeCompare(oldVal);
      var diff = [...compareString(currentVal, oldVal)].join(" ");
      get_entity(diff);
      oldVal = currentVal;
    }
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
          show_def(res[key]);
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

  function show_def(def) {
    var box = document.createElement("BOX");
    box.innerHTML = def;
    document.body.appendChild(box);
  }
});

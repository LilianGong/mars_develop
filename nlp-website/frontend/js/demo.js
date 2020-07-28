$(document).ready(function () {
  var oldVal = "";
  $(".notes").focus();
  $(".notes").on("change keyup paste", function ner_detection() {
    var currentVal = $(this).val();
    if (currentVal == oldVal) {
      return;
    }
    if (currentVal.split(" ").length != oldVal.split(" ").length) {
      // var d = currentVal.localeCompare(oldVal);
      var diff = [...compareString(currentVal, oldVal)].join(" ");
      get_entity(diff);
      oldVal = currentVal;
    }
  });

  function compareString(s1, s2, splitChar) {
    if (typeof splitChar == "undefined") {
      splitChar = " ";
    }
    var string1 = new Set(s1.split(splitChar));
    var string2 = new Set(s2.split(splitChar));

    var diff = new Set([...string1].filter((x) => !string2.has(x)));
    return diff;
  }

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
          document.getElementById("btn_container").removeChild(btn);
          var txt = next_textarea();
          at_teacher();
        };
      }

      console.log(data);
      // $("#def").html(data["result"][entity["chn"][0]]);
    });
  }

  function get_button(ent) {
    var btn = document.createElement("BUTTON");
    btn.innerHTML = "enter the definition of ".concat(ent);
    document.getElementById("btn_container").appendChild(btn);
    btn.classList.add("entitybtn");
    btn.id = "entitybtn";
    return btn;
  }

  function show_def(def) {
    var box = document.createElement("BOX");
    box.innerHTML = def;
    document.getElementById("container").appendChild(box);
    box.classList.add("defbox");
  }

  function next_textarea() {
    var txt = document.createElement("TEXTAREA");
    document.getElementById("container").appendChild(txt);
    txt.classList.add("next_notes");
    txt.id = "note";
    txt.rows = 1;
    txt.cols = 30;
    $("#note").focus();
    return txt;
  }

  function at_teacher() {
    var oldVal = "";
    $("#note").on("change keyup paste", function ner_detection() {
      var currentVal = $(this).val();
      if (oldVal == currentVal) {
        return;
      }
      if (currentVal.includes("@")) {
        btn = get_teacher_btn();
        btn.onclick = function () {
          document.getElementById("container").removeChild(btn);
          show_at_teacher();
          var txt = document.createElement("TEXTAREA");
          document.getElementById("container").appendChild(txt);
          txt.classList.add("next_notes");
          txt.id = "note_2";
          txt.rows = 1;
          txt.cols = 30;
          $("#note_2").focus();
        };
        oldVal = currentVal;
      }
    });
  }

  function get_teacher_btn() {
    var btn = document.createElement("BUTTON");
    btn.innerHTML = "Prof. Wang";
    document.getElementById("container").appendChild(btn);
    btn.classList.add("entitybtn");
    btn.id = "teacherbtn";
    return btn;
  }

  function show_at_teacher() {
    var text = $("#note").val();
    var note = document.getElementById("note");
    note.value = text.concat(" Prof. Wang");
    note.style.color = "#be5683";
  }
});

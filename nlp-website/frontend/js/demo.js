$(document).ready(function () {
  function getSelectedText() {
    var text = "";
    if (typeof window.getSelection != "undefined") {
      text = window.getSelection().toString();
    } else if (
      typeof document.selection != "undefined" &&
      document.selection.type == "Text"
    ) {
      text = document.selection.createRange().text;
    }
    return text;
  }

  text = document.getElementById("problem");
  text.addEventListener("mouseup", function () {
    highlighting();
    text.removeEventListener("mouseup", arguments.callee);
  });

  // document.onmouseup = doSomethingWithSelectedText;
  // document.onkeyup = doSomethingWithSelectedText;

  function highlighting() {
    var selectedText = getSelectedText();
    if (selectedText) {
      // text = document.getElementById("problem");
      var x = 0;
      var y = 0;
      text.addEventListener("mousemove", function () {
        if ((x == 0) & (y == 0)) {
          x = event.screenX;
          y = event.screenY;
          text.removeEventListener("mousermove", arguments.callee);
          btn = get_highlight_btn(x, y);
          btn.onclick = function () {
            highlight(selectedText);
            c = document.getElementById("htext");
            c.removeChild(btn);
          };
        }
      });
    }
  }

  function get_highlight_btn(x, y) {
    var btn = document.createElement("BUTTON");
    btn.innerHTML = "highlight";
    c = document.getElementById("htext");
    c.appendChild(btn);
    btn.classList.add("highlightbtn");
    btn.id = "highlightbtn";
    btn.style.position = "absolute";
    console.log(x);
    console.log(y);
    btn.style.left = x;
    btn.style.top = y;
    // btn.style.right = x + 5 + "px";
    // btn.style.bottom = x + 5 + "px";
    return btn;
  }

  function highlight(text) {
    var inputText = document.getElementById("problem");
    var innerHTML = inputText.innerHTML;
    var index = innerHTML.indexOf(text);
    if (index >= 0) {
      innerHTML =
        innerHTML.substring(0, index) +
        "<span class='highlight'>" +
        innerHTML.substring(index, index + text.length) +
        "</span>" +
        innerHTML.substring(index + text.length);
      inputText.innerHTML = innerHTML;
    }
  }

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
          var tbn_container = document.createElement("div");
          tbn_container.classList.add("btn_container");
          tbn_container.id = "tbn_container";
          document.getElementById("container").appendChild(tbn_container);
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
    document.getElementById("tbn_container").appendChild(txt);
    txt.classList.add("next_notes");
    txt.id = "note";
    txt.rows = 1;
    txt.cols = 15;
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
          document.getElementById("tbn_container").removeChild(btn);
          show_at_teacher();
          var txt = document.createElement("TEXTAREA");
          document.getElementById("container").appendChild(txt);
          txt.classList.add("next_notes");
          txt.id = "note_2";
          txt.rows = 1;
          txt.cols = 20;
          $("#note_2").focus();
        };
        oldVal = currentVal;
      }
    });
  }

  function get_teacher_btn() {
    var btn = document.createElement("BUTTON");
    btn.innerHTML = "Professor Wang";
    document.getElementById("tbn_container").appendChild(btn);
    btn.classList.add("entitybtn");
    btn.id = "teacherbtn";
    return btn;
  }

  function show_at_teacher() {
    var text = $("#note").val();
    var note = document.getElementById("note");
    note.value = text.concat(" Professor Wang");
    note.style.color = "#be5683";
  }
});

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
  h_count = 0;
  text.addEventListener("mouseup", function () {
    highlighting();
    // text.removeEventListener("mouseup", arguments.callee);
  });

  // document.onmouseup = doSomethingWithSelectedText;
  // document.onkeyup = doSomethingWithSelectedText;

  var old_text = ""
  function highlighting() {
    var selectedText = getSelectedText();
    if (selectedText) {
      var x = 0;
      var y = 0;
      text.addEventListener("mousemove", function () {
        if ((x == 0) & (y == 0)) {
          var position = text.getBoundingClientRect();
          var px = position.left;
          var py = position.top;
          x = event.pageX - px;
          y = event.pageY - py;
          text.removeEventListener("mousermove", arguments.callee);
          hcbtn = get_highlight_btn(x, y);
          a = get_highlight(selectedText, hcbtn[0]);
          b = get_highlight(selectedText, hcbtn[1]);
          c = get_highlight(selectedText, hcbtn[2]);
          d = get_highlight(selectedText, hcbtn[3]);
          e = show_note_area(selectedText, hcbtn[4], y);
          console.log(old_text);
          console.log(selectedText);
            // if (old_text!=selectedText) {
            //   var hbtn = document.getElementById('hbtn_box');
            //   var parent = hbtn.parentNode;
            //   parent.removeChild(hbtn);
            // }
          old_text = selectedText;
        }
      });
    }
  }

  function get_highlight(selectedText, button) {
    button.onclick = function () {
      highlight(selectedText, button);
      c = document.getElementById("htext");
      c.removeChild(hcbtn[5]);
    };
  }

  function get_highlight_btn(x, y) {
    var div = document.createElement("BOX");
    document.getElementById("htext").append(div);
    div.classList.add("hbtn_box");
    div.id = "hbtn_box";

    // yellow button
    var ybtn = document.createElement("BUTTON");
    div.appendChild(ybtn);
    ybtn.id = "yellow_btn";
    ybtn.classList.add("highlightbtn");

    // blue button
    var bbtn = document.createElement("BUTTON");
    div.appendChild(bbtn);
    bbtn.id = "blue_btn";
    bbtn.classList.add("highlightbtn");

    // red button
    var rbtn = document.createElement("BUTTON");
    div.appendChild(rbtn);
    rbtn.id = "red_btn";
    rbtn.classList.add("highlightbtn");

    // green button
    var gbtn = document.createElement("BUTTON");
    div.appendChild(gbtn);
    gbtn.id = "green_btn";
    gbtn.classList.add("highlightbtn");

    //  comment button
    var cbtn = document.createElement("BUTTON");
    div.appendChild(cbtn);
    cbtn.id = "comment_btn";
    cbtn.classList.add("commentbtn");

    console.log(x);
    console.log(y);
    div.style.left = x - 100 + "px";
    div.style.top = y + 14 + "px";
    hcbtn = [ybtn, bbtn, rbtn, gbtn, cbtn, div];
    return hcbtn;
  }

  function highlight(text, elm) {
    var inputText = document.getElementById("problem");
    var innerHTML = inputText.innerHTML;
    var index = innerHTML.indexOf(text);
    if (index >= 0) {
      _id = "hlight".concat(h_count.toString());
      h_count += 1;
      var css = "<span class='highlight' id = ".concat(_id, ">");
      innerHTML =
        innerHTML.substring(0, index) +
        css +
        innerHTML.substring(index, index + text.length) +
        "</span>" +
        innerHTML.substring(index + text.length);
      inputText.innerHTML = innerHTML;
      if (elm != "none") {
        var color = getComputedStyle(elm).backgroundColor;
      } else {
        var color = "#ffc400";
      }

      document.getElementById(_id).style.backgroundColor = color;
      document.getElementById(_id).style.opacity = "0.5";
    }
  }

  n_count = 0;

  function autosize() {
    var el = this;
    setTimeout(function () {
      el.style.cssText = "height:auto; padding:0";
      el.style.cssText = "height:" + el.scrollHeight + "px";
    }, 5);
  }

  function show_note_area(text, button, y) {
    button.onclick = function () {
      // create note container
      var n_container = document.createElement("div");
      n_container.classList.add("note_container");
      n_container.id = "note_container".concat(n_count.toString());
      document.getElementById("container").appendChild(n_container);
      n_container.style.top = y + "px";

      // create button container
      var div = document.createElement("div");
      div.classList.add("btn_container");
      div.id = "btn_container".concat(n_count.toString());
      n_container.appendChild(div);

      // create note text area
      var note = document.createElement("textarea");
      var parent = "btn_container".concat(n_count.toString());
      document.getElementById(parent).appendChild(note);
      note.classList.add("notes");
      note.id = "notes".concat(n_count.toString());
      note.placeholder = "Type your thoughts about it...";
      var oldVal = "";
      c = document.getElementById("htext");
      c.removeChild(hcbtn[5]);
      console.log(getComputedStyle(hcbtn[0]).backgroundColor);
      highlight(text, "none");

      // create line area
      var line = document.createElement("box");
      document.getElementById("clickable_container").appendChild(line);
      line.classList.add("lines");
      line.id = "line".concat(n_count.toString());
      var rect = note.getBoundingClientRect();
      line.style.top = y + "px";
      line.style.left = rect.right + "px";

      n_count += 1;

      $(".notes").focus();
      var note = document.getElementById(
        "notes".concat((n_count - 1).toString())
      );
      note.addEventListener("keydown", autosize);

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
    };
  }

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
          btn.parentNode.removeChild(btn);
          // document.getElementById("btn_container").removeChild(btn);
          var tbn_container = document.createElement("div");
          tbn_container.classList.add("btn_container");
          tbn_container.id = "tbn_container";
          document
            .getElementById("note_container".concat((n_count - 1).toString()))
            .appendChild(tbn_container);
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
    var parent = "btn_container".concat((n_count - 1).toString());
    document.getElementById(parent).appendChild(btn);
    btn.classList.add("entitybtn");
    btn.id = "entitybtn";
    return btn;
  }

  function show_def(def) {
    var box = document.createElement("BOX");
    box.innerHTML = def;
    document
      .getElementById("note_container".concat((n_count - 1).toString()))
      .appendChild(box);
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
    txt.addEventListener("keydown", autosize);
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
          document
            .getElementById("note_container".concat((n_count - 1).toString()))
            .appendChild(txt);
          // txt.classList.add("next_notes");
          txt.id = "note_2";
          txt.rows = 1;
          txt.cols = 20;
          $("#note_2").focus();
          txt.addEventListener("keydown", autosize);
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
    note.style.color = "#5b70e7";
  }
});

$(document).ready(function () {
  hightlight_text();

  function highlight_text() {
    var selectedText = getSelectedText();
    if (selectedText) {
      text = document.getElementById("problem");
      text.addEventListener("mouseup", function () {
        highlighting(text, "mousemove", event, function () {});
      });
    }
  }

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

  function highlighting(element, event, e, listener) {
    var x = 0;
    var y = 0;
    element.addEventListener(event, function () {
      if ((x == 0) & (y == 0)) {
        x = event.clientX;
        y = event.clientY;
        element.removeEventListener(event, arguments.callee);
        btn = get_highlight_btn(x, y);
        btn.onclick = function () {
          highlight(selectedText);
          c = document.getElementById("problem");
          c.removeChild(btn);
        };
      }
    });
  }

  function get_highlight_btn(x, y) {
    var btn = document.createElement("BUTTON");
    btn.innerHTML = "add highlight";
    // c = document.getElementById("problem");
    // c.appendChild(btn);
    btn.classList.add("entitybtn");
    btn.id = "highlightbtn";
    btn.style.position = "relative";
    btn.style.left = x;
    btn.style.top = y;
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
});

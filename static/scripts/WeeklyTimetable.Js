function consoleText(words, id, colors) {
  if (colors === undefined) colors = ['#fff'];
  var visible = true;
  var con = document.getElementById('console');
  var letterCount = 0;
  var x = 1;
  var waiting = false;
  var target = document.getElementById(id);
  target.setAttribute('style', 'color:' + colors[0]);

  function type() {
    if (letterCount === 0 && waiting === false) {
      waiting = true;
      target.innerHTML = words[0].substring(0, letterCount);
      window.setTimeout(function() {
        var usedColor = colors.shift();
        colors.push(usedColor);
        var usedWord = words.shift();
        words.push(usedWord);
        x = 1;
        target.setAttribute('style', 'color:' + colors[0]);
        letterCount += x;
        waiting = false;
        type(); // Start typing again after a pause
      }, 1000);
    } else if (letterCount <= words[0].length && waiting === false) {
      target.innerHTML = words[0].substring(0, letterCount);
      letterCount += x;
      window.setTimeout(type, 120); // Type the next character after a short pause
    } else {
      // Hide the underscore once the word is fully typed
      con.style.display = 'none';
    }
  }

  type(); // Call the type function once on page load
}

// Call the consoleText function with your desired text and colors
consoleText(['Weekly Timetable'], 'text', ['black']);

/*------------------------------------------------------------------Quotes------------------------------------------------------------------*/  

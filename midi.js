// A "Node List" of elements with the "key" class
var nodeList = document.querySelectorAll('.key');

// Now it is an array, and we can use methods such as 'map', 'filter', and 'reduce'
var keys = [].slice.call(nodeList);

var keyBindings = [];

function playSound(hertz) {
  // Initialize the sound engine
  var audioCtx = new AudioContext();
  var oscillator = audioCtx.createOscillator();
  oscillator.frequency.value = hertz;
  oscillator.start();
  var g = audioCtx.createGain();
  oscillator.connect(g);
  g.connect(audioCtx.destination);
  //g.gain.exponentialRampToValueAtTime(1, audioCtx.currentTime + 1);

  // stopping the sound requires that we have access to this variable
  return  [g, audioCtx];
}

function stopSound(drivers) {
  //soundEngine.stop();
  drivers[0].gain.exponentialRampToValueAtTime(0.00001, drivers[1].currentTime + 1);
  return null;
}


document.addEventListener('keydown', function(e) {
  var keyPressed = e.key;

  var bindMatch = keyBindings.filter(function(binding) {
    return binding.key === keyPressed;
  });

  // exit out of function if you did not press a key
  // that is associated with the keyboard
  if (!bindMatch[0]) {
    return;
  }

  soundEngine = playSound(bindMatch[0].hertz);

  var key = document.querySelector('.key[data-hertz="'+bindMatch[0].hertz+'"]');
  key.classList.add("pressed");

  document.addEventListener('keyup', function(e) {
    if (e.key === keyPressed) {
      key.classList.remove("pressed");
      stopSound(soundEngine);
    }
  });
});

keys.forEach(function(key, i) {
  var soundEngine = null;

  keyBindings.push({
    key: key.dataset.trigger,
    hertz: key.dataset.hertz
  });

  key.addEventListener('mousedown', function() {
    key.classList.add("pressed");
    soundEngine = playSound(key.dataset.hertz);
  });

  key.addEventListener('mouseup', function() {
    setTimeout(function() {
      stopSound(soundEngine);
    }, 200);
    key.classList.remove("pressed");
  });
});

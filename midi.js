// execution lifecycle:
// const keyBindings = createKeyBindings();
//   for each keyElement, newKeyBinding()
//     for each keyBinding, newOscillator()
//
// Then, assign event handlers for mouse and keys which
// only interact with the keyBindings' play() and stop() functions
//
// A keyBinding becomes an audio controller for its oscillator.
// The event handler will call keyBinding.play(),
// and keyBinding.play invokes its own oscillator's start() function


// helper function for selecting all of the key elements
function selectElements(selector) {
  return [].slice.call(document.querySelectorAll(selector));
}

// initializes the ability to play a sound using javascript's
// built in synthesis library
// it returns an object (dictionary) that has two properties:
// - start(): begins playing a sound
// - stop(): stops playing a sound
function newOscillator(hertz) {
  const audioCtx = new AudioContext();

  const attack = 1;
  const release = 1;

  // initialize pitch
  const oscillator = audioCtx.createOscillator();
  oscillator.frequency.value = Number(hertz, 10);
  oscillator.start();

  // initialize volume
  const oscillatorVolume = audioCtx.createGain();
  oscillatorVolume.gain.linearRampToValueAtTime(0, 0);

  // Wire it all together
  // oscillator -> gain -> guitar amp (audioCtx)
  oscillator.connect(oscillatorVolume);
  oscillatorVolume.connect(audioCtx.destination);

  return {
    start: function() {
      // first, in case we're overlapping with a release, cancel the release ramp
      oscillatorVolume.gain.cancelScheduledValues(audioCtx.currentTime);

      // now, make sure to set a "scheduling checkpoint" of the current value
      oscillatorVolume.gain.setValueAtTime(
        oscillatorVolume.gain.value,
        audioCtx.currentTime
      );

      // NOW, set the ramp
      oscillatorVolume.gain.linearRampToValueAtTime(1, audioCtx.currentTime + attack);
    },
    stop: function() {
      // first, in case we're overlapping with an attack, cancel the attack ramp
      oscillatorVolume.gain.cancelScheduledValues(audioCtx.currentTime);

      // now, make sure to set a "scheduling checkpoint" of the current value
      oscillatorVolume.gain.setValueAtTime(
        oscillatorVolume.gain.value,
        audioCtx.currentTime
      );

      // NOW, set the ramp
      oscillatorVolume.gain.linearRampToValueAtTime(0, audioCtx.currentTime + release);
    }
  }
}

// this returns an object that we'll use to match with the event key or mouse click
// returns an object with these properties:
// - element: used to later initialize mouse events
// - trigger: used to later initialize keydown and keyup events
// - play: used for both key and mouse events
// - stop: used for both key and mouse events
function newKeyBinding(keyElement) {
  let isPressed = false;
  const oscillator = newOscillator(keyElement.dataset.hertz);

  return {
    element: keyElement,
    trigger: keyElement.dataset.trigger,
    play: function() {
      if (isPressed) {
        return;
      }

      isPressed = true;
      oscillator.start();
      keyElement.classList.add('pressed');
    },
    stop: function() {
      isPressed = false;
      oscillator.stop();
      keyElement.classList.remove('pressed');
    }
  };
}

// loops through all of our key elements and
// creates a key binding for each one
function createKeyBindings() {
    const keyElements = selectElements('.key');
    const bindings = [];

    keyElements.forEach(key => {
      bindings.push(newKeyBinding(key));
    });

    return bindings;
}

// play sound on mouse click & stop sound on mouse release
function createClickEventListeners(keyBindings) {
  keyBindings.forEach(({element, play, stop}) => {
    element.addEventListener('mousedown', play);
    element.addEventListener('mouseup', stop);
  });
}

// play sound on key down
document.addEventListener('keydown', e => {
  const keyPressed = e.key;

  const keyMatch = keyBindings
    // looks for a match
    .filter(({trigger}) => trigger === keyPressed)
    // returns single element instead of array
    .reduce((prev, cur) => cur, false);

  if (!keyMatch) {
    return;
  }

  keyMatch.play();
});

// stop sound on key down
document.addEventListener('keyup', e => {
  const keyPressed = e.key;

  const keyMatch = keyBindings
    // looks for a match
    .filter(({trigger}) => trigger === keyPressed)
    // returns single element instead of array
    .reduce((prev, cur) => cur, false);

  if (!keyMatch) {
    return;
  }

  keyMatch.stop();
});

const keyBindings = createKeyBindings();
createClickEventListeners(keyBindings);

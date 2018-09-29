var keyData = {
	q: {
		sound: new Howl({
  		urls: ['sounds/boom.wav']
		})
	},
	w: {
		sound: new Howl({
  		urls: ['sounds/clap.wav']
		})
	},
	e: {
		sound: new Howl({
  		urls: ['sounds/hihat.wav']
		})
	},
	r: {
		sound: new Howl({
  		urls: ['sounds/kick.wav']
		})
	},
  a: {
    sound: new Howl({
      urls: ['sounds/snare.wav']
    })
  },
  s: {
    sound: new Howl({
      urls: ['sounds/ride.wav']
    })
  },
    d: {
    sound: new Howl({
      urls: ['sounds/tink.wav']
    })
  },
  f: {
    sound: new Howl({
      urls: ['sounds/tom.wav']
    })
  }
};


function selectElements(selector) {
  return [].slice.call(document.querySelectorAll(selector));
}

function createKeyBindings() {
    const keyElements = selectElements('.pad');
    const bindings = [];

    keyElements.forEach(key => {
      bindings.push(newKeyBinding(key));
    });

    return bindings;
}

function newKeyBinding(keyElement) {
  let isPressed = false;
  //const oscillator = newOscillator(keyElement.dataset.hertz);

  return {
    element: keyElement,
    trigger: keyElement.dataset.trigger,
    play: function() {
      if (isPressed) {
        return;
      }

      isPressed = true;
      //oscillator.start();
      keyElement.classList.add('pressed');
    },
    stop: function() {
      isPressed = false;
      //oscillator.stop();
      keyElement.classList.remove('pressed');
    }
  };
}

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

  if(keyData[e.key]){
    keyData[e.key].sound.play();
  }

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

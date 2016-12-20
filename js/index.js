let series=[];
let count = 1;
const keys = document.querySelectorAll('.key');
let strictModeActive = false;
let currentIndex = 0;
const options = [{ 
    keycode: 65, 
    url: "https://s3.amazonaws.com/freecodecamp/simonSound1.mp3"
  }, 
  { keycode: 83, 
    url: "https://s3.amazonaws.com/freecodecamp/simonSound2.mp3"
  },
  { keycode: 68, 
    url: "https://s3.amazonaws.com/freecodecamp/simonSound3.mp3"
  },
  { keycode: 70, 
    url: "https://s3.amazonaws.com/freecodecamp/simonSound4.mp3"
  }];

function turnOnKeys(){ // turn on the keys and mouse eventListeners
  keys.forEach(key => {
    key.addEventListener('click',playsoundMouse);
  })
  window.addEventListener('keydown', playsoundKey); 
}

function turnOffKeys(){ // turn off the keys and mouse eventListeners
   keys.forEach(key => {
    key.removeEventListener('click',playsoundMouse);
  })
  window.removeEventListener('keydown', playsoundKey); 
}

function buttonBreak(interval){
  turnOffKeys();
  
  setTimeout(turnOnKeys, interval);
}

function startGame(){
  setRestart();
  
  makeMove(count);
  
  turnOnKeys();  
}

function setRestart(){
  let start = document.getElementById('start');
  start.innerHTML = 'Restart';
  start.classList.add('restart');
  start.removeEventListener('click', startGame);
  start.addEventListener('click', restartGame);
}

function makeMove(count) {
  displayCount(count);
  series.push(options[Math.floor(Math.random()*4)]);
  playSeries();
}  

function displayCount(count){
  let countDisplay = "0" + count;
  document.getElementById('count').childNodes[0].innerHTML = countDisplay.slice(-2); 
}
   
function playSeries(){
  turnOffKeys(); 
  console.log(series);
  let audio = new Audio(series[0]["url"]);
  let index=1; 
  function playNext() {
    if(index < series.length) {
      audio.src = series[index]["url"];
      audio.load(); 
      audio.play();
      document.querySelector(`.key[data-key="${series[index]["keycode"]}"]`).classList.add('pressed');
      index ++;
    } else {
    audio.removeEventListener('ended', playNext, false);
       turnOnKeys();
      }
    }
  audio.addEventListener('ended', playNext);
  audio.play();

  document.querySelector(`.key[data-key="${series[0]["keycode"]}"]`).classList.add('pressed');
}

function restartGame(){
  document.getElementById('overlay').classList.add('hidden');   document.getElementById('reset').removeEventListener('click', restartGame);
  series = [];
  currentIndex = 0;
  count = 1;
  setTimeout(startGame, 1500);
}

function toggleStrictMode(){
  let strict = document.getElementById('strict').classList;

    strictModeActive = strict.toggle('strict');
};

function playsoundKey(e){
  playsound(e.keyCode);
}

function playsoundMouse(e){
  let keyClicked = this.attributes["data-key"].value;
  playsound(keyClicked);
};

function playsound(keycode){
  const audio = document.querySelector(`audio[data-key="${keycode}"]`);
  const key = document.querySelector(`.key[data-key="${keycode}"]`);
  if (!audio) return;
  audio.currentTime = 0;
  
  if (currentIndex < series.length){ // not pressed too many keys.
    if (keycode == series[currentIndex]["keycode"]){ // right key
      currentIndex++;
      audio.play();
      key.classList.add('pressed');
      if (currentIndex === series.length) {
        count++;
        if (count == 21){
          document.getElementById('overlay').classList.remove('hidden');
          document.getElementById('reset').addEventListener('click', restartGame);
        } else {
          buttonBreak(1500);
          setTimeout(makeMove, 1500, count);
          currentIndex = 0;
        }
      }
    } else { // wrong key
      audio.play();
      let buttons = document.querySelectorAll('button');
      buttons.forEach(function(button) {
        button.classList.add('error');
        button.addEventListener('transitionend', removeError);
      });
      displayCount("!!");
      setTimeout(displayCount, 300, count);
      if (strictModeActive) { // start again
        restartGame();
      } else { // show current sequence again
        currentIndex = 0;
        buttonBreak(1500);
        setTimeout(playSeries, 1500);
      }
    }
  } 
}

function removeError(){
  this.classList.remove('error');
}

function removeTransition(e){
  this.classList.remove('pressed');
};

keys.forEach(key => {  
  key.addEventListener('transitionend', removeTransition);
});

document.getElementById('start').addEventListener('click', startGame);
document.getElementById('strict').addEventListener('click', toggleStrictMode);
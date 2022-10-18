import Virus from './virus/virus.js';

const canvas = document.getElementById('game');

const timeElapsed = document.getElementById('time-elapsed');
const timerCallback = function () {
    timeElapsed.innerText = (this.currentTime / 1000).toFixed(2);
};

const scorePercentage = document.getElementById('score-percentage');
const scoreCallback = function () {
    scorePercentage.innerText = (this.percentage);
};

const failGained = document.getElementById('fail-gained');
const failCallback = function () {
    failGained.innerText = this.failGain;
};

const end = document.getElementById('end');
const endScore = end.querySelector('.score');
const endTime = end.querySelector('.time');
const endCallback = function () {
    end.classList.remove('hide');

    endScore.innerText = (this.percentage);
    endTime.innerText = timeElapsed.innerText;
};

const highscoreButton = end.querySelector('.highscore');
const highscore = document.getElementById('highscore');

const instruction = document.getElementById('instruction');
const playForm = document.getElementById('play-form');

const pause = document.getElementById('pause');
const resume = pause.querySelector('.continue');
const pauseCallback = function () {
    if (this.paused)
        return pause.classList.remove('hide');

    pause.classList.add('hide');
};

const virus = new Virus({canvas, timerCallback, endCallback, scoreCallback, pauseCallback, failCallback});

virus.volume = 0;

resume.onclick = () => virus.pause();

highscoreButton.onclick = () => {
    end.classList.add('hide');
    highscore.classList.remove('hide');
    virus.highscore.render(highscore.querySelector('.table'));
};

playForm.onsubmit = (ev) => {
    ev.preventDefault();
    instruction.classList.add('hide');
    virus.start();
};

import Key from './key.js';
import Border from './border.js';
import Gameplay from './gameplay.js';
import map from './map/map.js';
import Highscore from './highscore.js';

class Virus {
    constructor({canvas, timerCallback, endCallback, scoreCallback, pauseCallback, failCallback}) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');

        this.canvas.width = 400;
        this.canvas.height = 600;

        this.FPS = 40;

        const keyArgs = {canvas, ctx: this.ctx, width: 100, height: 120, color: '#3e8db1', hover: '#66cfff'};

        this.keys = [
            new Key({...keyArgs, position: 1, keycode: 'D'}),
            new Key({...keyArgs, position: 2, keycode: 'F'}),
            new Key({...keyArgs, position: 3, keycode: 'J'}),
            new Key({...keyArgs, position: 4, keycode: 'K'}),
        ];

        this.border = new Border({
            canvas,
            ctx: this.ctx,
            height: 20,
            color: '#222',
            y: canvas.height - keyArgs.height - 20,
        });

        this.unforgiving = 'js/virus/map/timebait/audio.mp3';
        const audio = new Audio();
        audio.src = this.unforgiving;
        audio.preload = 'auto';
        // audio.loop = false;

        this.gameplay = new Gameplay({
            canvas,
            audio,
            map,
            ctx: this.ctx,
            keys: this.keys,
            timerCallback,
            endCallback,
            scoreCallback,
            failCallback,
        });

        this.paused = false;
        this.pausedTime = 0;
        this.pauseCallback = pauseCallback;

        this.isCounting = false;

        this.highscore = new Highscore();

        document.addEventListener('keydown', this.eventPause.bind(this));
    }

    get volume() {
        return this.gameplay.audio.volume;
    }

    set volume(volume) {
        this.gameplay.audio.volume = volume;
    }

    eventPause(ev) {
        if (ev.code !== 'Escape' || this.isCounting || this.gameplay.audio.currentTime === 0)
            return;

        this.pause();
    }

    pause() {
        if (this.paused) {
            this.paused = false;
            this.start();
        } else {
            this.paused = true;
            this.pausedTime = this.gameplay.audio.currentTime;
            this.gameplay.audio.pause();
            this.gameplay.audio.src = '';
        }

        this.pauseCallback();
    }

    start() {
        this.clear();
        this.isCounting = true;

        const x = this.canvas.width / 2 - 20;
        const y = this.canvas.height / 2;

        this.ctx.beginPath();
        this.ctx.fillStyle = 'white';
        this.ctx.font = '72px sans-serif';

        this.ctx.fillText('3', x, y);

        setTimeout(() => {
            this.clear();
            this.ctx.fillText('2', x, y);

            setTimeout(() => {
                this.clear();
                this.ctx.fillText('1', x, y);
                this.ctx.closePath();

                setTimeout(() => {
                    this.isCounting = false;

                    if (this.pausedTime) {
                        this.gameplay.audio.src = this.unforgiving;
                        this.gameplay.audio.currentTime = this.pausedTime;
                    }

                    this.play();
                }, 1000);
            }, 1000);
        }, 1000);
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    play() {
        this.clear();

        this.gameplay.audio.play();
        this.gameplay.draw();

        this.border.draw();

        this.keys.forEach((key) => key.draw());

        if (!this.gameplay.end && !this.paused)
            setTimeout(this.play.bind(this), 1000 / this.FPS);

        if (this.gameplay.end)
            this.highscore.insert({
                name: document.getElementById('nona').className,
                score: (this.gameplay.percentage),
                time: (document.getElementById('time-elapsed')).innerText,
            });
    }

    
}

export default Virus;
class Gameplay {
    constructor({canvas, ctx, audio, map, keys, timerCallback, endCallback, scoreCallback, failCallback}) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.audio = audio;
        this.map = map;
        this.keys = keys;
        this.timerCallback = timerCallback;
        this.endCallback = endCallback;
        this.scoreCallback = scoreCallback;
        this.failCallback = failCallback;

        this.hit = [];
        this.passed = [];

        this.end = false;

        this.speedChanged = false;

        audio.addEventListener('ended', this.ended.bind(this));

        document.addEventListener('keydown', this.speed.bind(this));


    }

    speed(ev) {
        if (!ev.ctrlKey)
            return;

        if (ev.code === 'Equal' && this.audio.playbackRate < 2) {
            this.audio.playbackRate *= 2;
        }

        if (ev.code === 'Minus' && this.audio.playbackRate > .5) {
            this.audio.playbackRate /= 2;
        }

        this.speedChanged = true;

        setTimeout(() => {
            this.speedChanged = false;
        }, 3000);
    }

    ended() {
        this.end = true;
        this.audio.src = '';
        this.endCallback();
    }
    
    get currentTime() {
        return Math.floor(this.audio.currentTime * 1000);
    }

    get percentage() {
        return this.passed.length === 0 ? 0 : this.hit.length;
    }

    get failGain() {
        return this.passed.length - this.hit.length > 4 ? this.ended() && this.passed.length - this.hit.length : this.passed.length - this.hit.length;
    }


    draw() {
        if (this.speedChanged) {
            let text;
            if (this.audio.playbackRate === .5)
                text = 'Slower';
            else if (this.audio.playbackRate === 1)
                text = 'Normal';
            else if (this.audio.playbackRate === 2)
                text = 'Faster';

            this.ctx.beginPath();
            this.ctx.fillStyle = 'white';
            this.ctx.font = '20px sans-serif';
            this.ctx.fillText(text, this.canvas.width / 2 - 30, 20);
            this.ctx.closePath();
        }

        this.map.hitObjects.forEach((map, index) => {
            const key = this.keys[map.position - 1];
            const y = this.currentTime + this.canvas.height - map.hitAt;

            if (this.currentTime >= map.hitAt && !this.passed.includes(index))
                this.passed.push(index);

                
            if (key.pressed && this.currentTime > map.hitAt - 300 && this.currentTime < map.hitAt && !this.hit.includes(index)) {
                this.hit.push(index);     
            }
            
            this.ctx.drawImage(document.getElementById('virus-img'), key.x, y, key.width - 10, 80);
        });

        this.timerCallback();
        this.scoreCallback();
        this.failCallback();
    }
}

export default Gameplay;
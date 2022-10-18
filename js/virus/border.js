class Border {
    constructor({canvas, ctx, height, color, y}) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.height = height;
        this.color = color;
        this.y = y;
    }

    draw() {
        this.ctx.beginPath();
        this.ctx.fillStyle = this.color;
        this.ctx.rect(0, this.y, this.canvas.width, this.height);
        this.ctx.fill();
        this.ctx.closePath();
    }
}

export default Border;
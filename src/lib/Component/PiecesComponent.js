import Component from "./Component";

export default class PiecesComponent extends Component {

    constructor(color, pos) {

        const r = 24 * 2;
        const size = [r * 2, r * 2];
        const zIndex = 29;

        super(size, pos, zIndex);

        this.size = size;
        this.color = color;
        this.r = r;

        return this;
    }

    //  绘制自身
    drawSelf() {

        const ctx = this.$canvas;
        const r = this.r;

        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(r / 2, r / 2, r / 2, 0, 2 * Math.PI);
        ctx.fill();
        return this;

    }
}
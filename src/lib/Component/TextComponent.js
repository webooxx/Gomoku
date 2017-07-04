import Component from "./Component";

export default class TextComponent extends Component {

    constructor(text, size, pos) {

        const zIndex = 30;

        super(size, pos, zIndex);

        this.size = size;
        this.text = text;
        this.$board = null;

        this.srcPos = pos;
        this.centerPos = [];


        return this;
    }

    //  绘制自身
    drawSelf() {

        const ctx = this.$canvas;

        ctx.fillStyle = 'rgba(255,255,255,.1)'
        ctx.fillRect(0, 0, this.size[0], this.size[1]);


        ctx.font = 'bold 30px 微软雅黑';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillStyle = 'red';
        ctx.fillText(this.text, this.size[0] / 2, this.size[1] / 4);

        const x = this.$stage.size[0] / 2 - this.size[0] / 2;
        const y = this.$stage.size[1] / 2 - this.size[1] / 2;

        this.centerPos = [x, y];
        return this;
    }


    update(text, isCenter) {

        if (isCenter) {
            this.pos = this.centerPos;
        } else {
            this.pos = this.srcPos;
        }

        this.text = text;
        this.clear();
        this.drawSelf();
        this.$stage.drawComponents();
    }
}
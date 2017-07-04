import {createCanvas} from "./Utils";

export default class Component {

    constructor(size, pos, zIndex) {


        const oCanvas = createCanvas(size);

        this.size = size;
        this.pos = pos || [0, 0];
        this.zIndex = zIndex || 0;
        this.registEvents = [];


        this.events = {};
        this.$el = oCanvas.$el;
        this.$canvas = oCanvas.$canvas;
        this.id = oCanvas.id;

        this.$canvas.width = this.size[0];
        this.$canvas.height = this.size[1];


        return this;
    }

    init() {
        this.drawSelf && this.drawSelf();
    }

    //  绘制自身并且通知舞台更新
    drawSelfAndUpdateStage() {
        this.drawSelf();
        this.$stage.drawComponents();
    }

    //  清楚自身内容
    clear() {
        const w = this.size[0];
        const h = this.size[1];
        this.$canvas.clearRect(0, 0, w, h);
    }

    getRegion() {
        let region = [];// [start_x,end_x,start_y,end_y];

        region[0] = this.pos[0];
        region[1] = this.pos[0] + this.size[0];

        region[2] = this.pos[1];
        region[3] = this.pos[1] + this.size[1];

        this.region = region;
        return region;
    }

    //  检查一个坐标是否被自己包含
    checkPosInRegion(pos) {
        const region = this.getRegion();
        return pos.x >= region[0] && pos.x <= region[1] && pos.y >= region[2] && pos.y <= region[3];
    }

}

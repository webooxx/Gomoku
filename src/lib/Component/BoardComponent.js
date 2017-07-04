/**
 * @file 游戏中心
 */
import Component from "./Component";
import PiecesComponent from "./PiecesComponent";


export default class BoardComponent extends Component {

    constructor(size, pos) {

        const zIndex = 9;
        super(size, pos, zIndex);
        this.pos = pos;
        this.size = size;

        this.step = 30 * 2;     //  每个格子宽度
        this.registEvents = ['click', 'mousemove'];

        return this;
    }

    /**
     * 由舞台调用的初始化操作
     */
    init() {


        //  加载4个常驻资源
        this.whitePreviewPieces = new PiecesComponent('rgba(255,255,255,.5)', [-999, 0]);
        this.blackPreviewPieces = new PiecesComponent('rgba(0,0,0,.5)', [-999, 0]);

        this.whitePieces = new PiecesComponent('white', [-999, 0]);
        this.blackPieces = new PiecesComponent('black', [-999, 0]);

        this.$stage.addComponent(this.whitePreviewPieces);
        this.$stage.addComponent(this.blackPreviewPieces);

        this.$stage.addComponent(this.whitePieces);
        this.$stage.addComponent(this.blackPieces);

        //  绘制自身
        this.drawSelf();
    }


    /**
     * 绘制棋盘
     */
    drawSelf(setInOrder) {
        this.clear();

        const $board = this;
        const ctx = this.$canvas;
        const w = this.size[0];
        const h = this.size[1];
        const step = this.step;
        const o = step / 2;
        ctx.fillStyle = 'rgba(133,94,66,.8)';
        ctx.fillRect(0, 0, w, h,);
        ctx.fill();
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.strokeStyle = "#000";

        //  绘制横线
        for (let i = 0; i < 15; i++) {
            let y = step * i + o;   //  y 的位置，需要加上偏移（向下半格）

            ctx.moveTo(0 + o, y);
            ctx.lineTo(w - o, y);   //  绘制横线，从偏移起始位置，画到个宽度位置减去偏移
        }
        //  绘制竖线
        for (let i = 0; i < 15; i++) {
            let x = step * i + o;
            ctx.moveTo(x, 0 + o);
            ctx.lineTo(x, h - o);
        }
        ctx.stroke();

        const r = this.whitePieces.r;

        setInOrder && setInOrder.forEach((item, i) => {

            let color = item[1];
            let gridPos = item[0].split('_');

            gridPos[0] -= 0;
            gridPos[1] -= 0;

            let realPos = $board.getRealPos(gridPos);
            let x = realPos[0] - $board.pos[0];
            let y = realPos[1] - $board.pos[1];
            const component = this[color + 'Pieces'];
            ctx.drawImage(component.$el, 0, 0, r, r, x, y, r, r);
        });
    }


    /**
     * 格式化落子位置为 1,1 ,14,14
     * @param pos 位置信息{x,y}
     * @returns {[*,*]}
     */
    getGridPos(pos) {

        let x = pos.x - this.pos[0] - 30;
        let y = pos.y - this.pos[1] - 30;
        //
        x = Math.abs(( x / this.step).toFixed() - 0);
        y = Math.abs(( y / this.step).toFixed() - 0);
        //
        x = Math.min(x, 14);
        y = Math.min(y, 14);

        // console.log(x, y);

        return [x, y];
    }

    /**
     * 格式化grid position为实际位置
     * @param gridPos    网格位置信息[1,2]
     * @returns {Array}
     */
    getRealPos(gridPos) {

        const $board = this;
        const r = $board.whitePreviewPieces.r;
        let pos = [];
        pos[0] = $board.pos[0] + $board.step * gridPos[0] + $board.step / 2 - r / 2;
        pos[1] = $board.pos[1] + $board.step * gridPos[1] + $board.step / 2 - r / 2;

        return pos;
    }

    /**
     * 清除预览落子
     */
    hidePreviewPieces() {
        this.whitePreviewPieces.pos = [-999, 0];
        this.blackPreviewPieces.pos = [-999, 0];
        this.$stage.drawComponents();
    }

    /**
     * 更新预览落子
     * @param color
     * @param pos
     */
    updatePreviewPieces(color, pos) {
        this.hidePreviewPieces();
        this[color + 'PreviewPieces'].pos = pos;
        this.$stage.drawComponents();
    }


}

import View from "./View";
import Stage from "../Component/Stage";
import BoardComponent from "../Component/BoardComponent";
import TextComponent from "../Component/TextComponent";

const scale = 2;

export default class ViewCanvas extends View {
    constructor(config) {

        super(config);

        this._type = 'canvas';

        this.initView();
        this.initEvent();

        return this;
    }

    initView() {
        //  舞台
        this.$stage = new Stage([800 * scale, 600 * scale]);

        //  界面元素
        this.$board = new BoardComponent([450 * 2, 450 * 2], [(800 * 2 - 450 * 2 ) / 2, (600 * 2 - 450 * 2 ) / 2]);
        this.$rightText = new TextComponent('开始游戏!', [250 * 2, 40 * 2], [(800 * 2 - 250 * 2) / 2, 15 * 2]);
        this.$undoText = new TextComponent('悔棋', [120 * 2, 35 * 2], [(800 * 2 - 450 * 2 ) / 2 + 450 * 2 + 50, (600 * 2 - 450 * 2 ) / 2]);
        this.$cancelUndoText = new TextComponent('撤销悔棋', [120 * 2, 35 * 2], [(800 * 2 - 450 * 2 ) / 2 + 450 * 2 + 50, (600 * 2 - 450 * 2 ) / 2 + 100]);

        //  注册子元素的事件

        this.$rightText.registEvents = ['click'];
        this.$undoText.registEvents = ['click'];
        this.$cancelUndoText.registEvents = ['click'];


        //  界面元素加入到舞台，加入后 stage 会去 component 的 init ，并且会设置其 $stage
        this.$stage.addComponent(this.$board);
        this.$stage.addComponent(this.$rightText);
        this.$stage.addComponent(this.$undoText);
        this.$stage.addComponent(this.$cancelUndoText);

        //  绘制
        this.$stage.drawComponents();
        this.$el.appendChild(this.$stage.$el);
    }

    /**
     * 初始化事件
     */
    initEvent() {
        let $game = this.$game;
        //  开始游戏
        this.$rightText.onClick = function () {
            if ($game.inGame) {
                return false;
            }
            // console.log('重新开始');
            $game.restart(true);
        };
        //  悔棋 & 撤销悔棋
        this.$undoText.onClick = function () {
            $game.undo();
        };
        this.$cancelUndoText.onClick = function () {
            $game.cancelUndo();
        };
        //  棋子预览处理
        this.$board.onMouseMove = function (evtPos) {
            const gridPos = this.getGridPos(evtPos);
            if (!$game.inGame || !$game.checkAllowSetIn(gridPos.join('_'))) {
                this.hidePreviewPieces();
                return false;
            } else {
                let realPos = this.getRealPos(gridPos);
                this.updatePreviewPieces($game.getRightName(), realPos);
            }
            //@todo 待优化，50ms 后立即执行一次
            // clearTimeout(this.timeId);
            // this.timeId = setTimeout(() => {
            // }, 50);
        };
        //  下棋处理
        this.$board.onClick = function (evtPos) {

            const gridPos = this.getGridPos(evtPos);
            if (!$game.inGame) {
                return false;
            }
            $game.setIn(gridPos.join('_'));
        }
    }

    /**
     * 更新棋权文本
     */
    gameRightTextUpdate(text, isCenter) {
        this.$rightText.update(text, !this.$game.inGame);
    }

    /**
     * 更新棋盘信息（所有棋子）
     */
    gameBoardUpdatePieces() {
        this.$board.drawSelf(this.$game.setInOrder);
        this.$stage.drawComponents();
    }
}
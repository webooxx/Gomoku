import View from "./View";

export default class ViewDom extends View {

    constructor(config) {
        super(config);
        this._type = 'dom';

        this.$piecesList = {};  //  管理所有棋子

        this.initView();
        this.initEvent();

        return this;
    }

    initView() {

        let $this = this;

        this.$board = View.createElement('div', {class: 'board'}, this.$el);
        this.$rightText = View.createElement('a', {class: 'text gameRight', text: '游戏开始'}, this.$el);
        this.$undoText = View.createElement('a', {class: 'text undo', text: '悔棋',}, this.$el);
        this.$cancelUndoText = View.createElement('a', {class: 'text cancelUndo', text: '撤销悔棋'}, this.$el);
        //  划线
        for (let i = 0; i < 15; i++) {
            let y = i * 30 + 15;
            View.createElement('span', {class: 'lineX', style: 'top:' + y + 'px'}, this.$board);
            View.createElement('span', {class: 'lineY', style: 'left:' + y + 'px'}, this.$board);
        }
        // 初始化棋子
        '-'.repeat(15).split('').forEach((_, x) => {
            '-'.repeat(15).split('').forEach((_, y) => {

                let _n = x + '_' + y;
                let _x = x * 30 + 15 - 12;
                let _y = y * 30 + 15 - 12;

                $this.$piecesList[_n] = View.createElement('a', {
                    'data-id': _n,
                    class: 'pieces',
                    style: ['left:', _x, 'px;', 'top:', _y, 'px;'].join('')
                }, this.$board);

            });
        });
    }

    /**
     * 初始化事件
     */
    initEvent() {
        let $this = this;

        //  开始游戏
        this.$rightText.addEventListener('click', function () {
            if ($this.$game.inGame) {
                return false;
            }
            $this.$game.restart(true);
        });
        //下子
        this.$board.addEventListener('click', function (event) {

            const targets = Array.prototype.slice.call(this.querySelectorAll('a.pieces'));
            const target = event.target;

            function fn(evt) {
                let id = this.getAttribute('data-id');
                $this.$game.setIn(id);

            };
            if (targets.indexOf(target) !== -1) {
                return fn.call(target, arguments);
            }
        }, false);  //  冒泡模式

        //  悔棋 & 撤销悔棋
        this.$undoText.addEventListener('click', function () {
            $this.$game.undo();
        });
        this.$cancelUndoText.addEventListener('click', function () {
            $this.$game.cancelUndo();
        });
    }

    /**
     * 更新棋权文本
     */
    gameRightTextUpdate(text, isCenter) {
        this.$rightText.innerText = text;
        this.$rightText.setAttribute('class', isCenter ? 'isCenter text gameRight' : 'text gameRight');
    }

    /**
     * 更新棋盘信息（所有棋子）
     */
    gameBoardUpdatePieces() {
        let $game = this.$game;
        let $this = this;
        Object.keys($game.board).forEach((k) => {
            let color = $game.board[k];
            $this.$piecesList[k].setAttribute('class', 'pieces ' + ( color === '_' ? '' : 'pieces_' + color ));
        })
    }
    /**
     * 更新棋盘当前的预览落子
     */
    gameBoardUpdatePreview() {
        this.$board.setAttribute('class', 'board preview_' + this.$game.getRightName());
    }
}
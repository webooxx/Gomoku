/**
 * @file 游戏核心逻辑
 */
import ViewCanvas from "./View/ViewCanvas";
import ViewDom from "./View/ViewDom";
/**
 * 游戏核心类返回一个游戏对象提供 restart 方法、setIn方法（测试用）
 */
export default class CoreLogic {
    constructor(config) {

        let {id, renderType} = config;

        this.setInOrder = [];   // 已下子信息序列  [ ['1_2','white'] ,.. ]
        this.undoOrder = [];
        this.board = {};    //  棋盘映射 { '1_1':'_' , '1_2':'white'}
        this.inGame = false; // 是否在游戏中

        let viewConfig = {
            $el: document.getElementById(id),
            $game: this
        };
        this.$view = renderType === 'canvas' ? new ViewCanvas(viewConfig) : new ViewDom(viewConfig);
    }

    /**
     * 下子
     */
    setIn(pos, color) {
        if (!this.checkAllowSetIn(pos)) {
            return false;
        }
        color = color || this.getRightName();
        this.setInOrder.push([pos, color]);
        this.undoOrder = [];  //  已经下棋，清空悔棋
        this.board[pos] = color;

        this.display();
        this.checkIsWin(pos, color);
    }

    /**
     * 检测允许在这里下子
     */
    checkAllowSetIn(pos) {
        return this.board[pos] === '_';
    }

    /**
     * 获取当前的棋权名称，白|黑
     */
    getRightName() {
        let i = this.setInOrder.length - 1;
        if (i < 0) {
            return 'black'; //  黑子先走
        } else {
            return this.setInOrder[i][1] === 'black' ? 'white' : 'black';
        }
    }

    /**
     * 检测是否赢了
     */
    checkIsWin(pos, color) {

        const arrPos = pos.split('_');
        const calcResult = CoreLogic.calcGomokuIsWin.call(this, arrPos, color);  //  静态方法检测

        let isWin = false;
        calcResult.forEach((i) => {
            if (i >= 4) {
                isWin = true;
            }
        });
        if (isWin) {
            this.inGame = false;
            this.$view.gameRightTextUpdate(color + '获得了了胜利！重新开始', true);
        }
        return isWin;
    }


    /**
     * 悔棋
     */
    undo() {
        if (!this.inGame || this.setInOrder.length <= 0) {
            return false;
        }
        const order = this.setInOrder.pop();
        this.undoOrder.push(order);
        this.board[order[0]] = '_';
        this.display();
    };

    /**
     * 撤销悔棋
     */
    cancelUndo() {
        if (this.undoOrder.length <= 0) {
            return false;
        }
        const order = this.undoOrder.pop();
        this.setInOrder.push(order);
        this.board[order[0]] = order[1];
        this.display();
    };

    /**
     * 视图展现
     */
    display() {

        let text = this.inGame ? '当前' + this.getRightName() + '走!' : '点此开始游戏';

        this.$view.gameBoardUpdatePreview(this.getRightName());
        this.$view.gameRightTextUpdate(text, !this.inGame);
        this.$view.gameBoardUpdatePieces();
    };

    /**
     * 开始游戏（初始化开始、重新开始）
     * inGame不开始，只是清空信息，而不自动开始（需要用户手动  --> 视图提供对应操作）
     */
    restart(inGame) {
        let $this = this;
        this.inGame = inGame || false;
        let size = 15;
        '-'.repeat(size).split('').forEach((_, x) => {
            '-'.repeat(size).split('').forEach((_, y) => {
                let pos = [x, y].join('_');
                $this.board[pos] = '_';
            });
        });
        this.setInOrder = [];
        this.undoOrder = [];
        this.display();
    };

    /**
     * 五子棋赢棋判断
     */
    static calcGomokuIsWin(arrPos, color) {
        let lib = {
            src: arrPos.join('_'),
            color: color,
            prevX: [],
            nextX: [],
            prevY: [],
            nextY: [],
            prevRt: [],
            prevRd: [],
            prevLt: [],
            prevLd: []
        };

        let Gomoku = this;

        //   上 , [ x--  , y]
        for (let i = 1; i < 5; i++) {
            if (arrPos[0] - i < 0) {
                break;
            }
            const pos = [arrPos[0] - i, arrPos[1] - 0].join('_');
            lib.prevX.push([pos, Gomoku.board[pos]]);
        }
        //   下 , [ x++  , y]
        for (let i = 1; i < 5; i++) {
            if (arrPos[0] - 0 + i > 14) {
                break;
            }
            const pos = [arrPos[0] - 0 + i, arrPos[1] - 0].join('_');
            lib.nextX.push([pos, Gomoku.board[pos]]);
        }
        //   左 , [ x  , y--]
        for (let i = 1; i < 5; i++) {
            if (arrPos[1] - i < 0) {
                break;
            }
            const pos = [arrPos[0] - 0, arrPos[1] - i].join('_');
            lib.prevY.push([pos, Gomoku.board[pos]]);
        }
        //   右 , [ x  , y++]
        for (let i = 1; i < 5; i++) {
            if (arrPos[1] - 0 + i > 14) {
                break;
            }
            const pos = [arrPos[0] - 0, arrPos[1] - 0 + i].join('_');
            lib.nextY.push([pos, Gomoku.board[pos]]);
        }
        //   右上 , [ x++  , y--]
        for (let i = 1; i < 5; i++) {
            let x = arrPos[0] - 0 + i;
            let y = arrPos[1] - i;
            if (x > 14 || y < 0) {
                break;
            }
            let pos = [x, y].join('_');
            lib.prevRt.push([pos, Gomoku.board[pos]]);
        }
        //   右下 , [ x--  , y++]
        for (let i = 1; i < 5; i++) {
            let x = arrPos[0] - i;
            let y = arrPos[1] - 0 + i;

            if (x < 0 || y > 14) {
                break;
            }
            let pos = [x, y].join('_');
            lib.prevRd.push([pos, Gomoku.board[pos]]);
        }
        //   左上 , [ x--  , y--]
        for (let i = 1; i < 5; i++) {
            let x = arrPos[0] - i;
            let y = arrPos[1] - i;

            if (x < 0 || y < 0) {
                break;
            }
            let pos = [x, y].join('_');
            lib.prevLt.push([pos, Gomoku.board[pos]]);
        }
        //   左下 , [ x++  , y++]
        for (let i = 1; i < 5; i++) {
            let x = arrPos[0] - 0 + i;
            let y = arrPos[1] - 0 + i;

            if (x < 0 || y < 0) {
                break;
            }
            let pos = [x, y].join('_');
            lib.prevLd.push([pos, Gomoku.board[pos]]);
        }
        Object.keys(lib).forEach((k) => {
            let len = lib[k].length;
            lib[k + 'Sum'] = 0;
            for (let i = 0; i < len; i++) {
                if (lib[k][i][1] !== color) {
                    break
                }
                lib[k + 'Sum']++
            }
        });

        // console.log(lib);


        return [
            lib.prevXSum + lib.nextXSum,    // x
            lib.prevYSum + lib.nextYSum,     // y
            lib.prevRtSum + lib.prevRdSum,    //   /
            lib.prevLtSum + lib.prevLdSum    //   \
        ];
    };
}
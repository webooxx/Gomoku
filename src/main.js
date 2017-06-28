import Stage from "./Stage";
import BoardComponent from "./BoardComponent";
import TextComponent from "./TextComponent";

window.scale = 2;
window.Gomoku = {setInOrder: []};

const oStage = new Stage([800 * window.scale, 600 * window.scale]);


const oGameBoard = new BoardComponent([450 * 2, 450 * 2], [(800 * 2 - 450 * 2 ) / 2, (600 * 2 - 450 * 2 ) / 2]);
const oGameRightText = new TextComponent('开始游戏!', [250 * 2, 40 * 2], [(800 * 2 - 250 * 2) / 2, 15 * 2]);

const oGameUndoText = new TextComponent('悔棋', [120 * 2, 35 * 2], [(800 * 2 - 450 * 2 ) / 2 + 450 * 2 + 50, (600 * 2 - 450 * 2 ) / 2]);
const oGameCancelUndoText = new TextComponent('撤销悔棋', [120 * 2, 35 * 2], [(800 * 2 - 450 * 2 ) / 2 + 450 * 2 + 50, (600 * 2 - 450 * 2 ) / 2 + 100]);

oGameUndoText.registEvents = ['click'];
oGameCancelUndoText.registEvents = ['click'];
oGameRightText.registEvents = ['click'];

oGameUndoText.onClick = () => {
    Gomoku.undo();
};
oGameCancelUndoText.onClick = () => {
    Gomoku.cancelUndo();
};
oGameRightText.onClick = () => {
    if (Gomoku.inGame) {
        return false;
    }
    console.log('重新开始');
    oGameRightText.registEvents = [];
    Gomoku.restart(true);

};
oStage.drawComponents();

document.querySelector('#app').appendChild(oStage.$el);

oStage.addComponent(oGameBoard);
oStage.addComponent(oGameRightText);
oStage.addComponent(oGameUndoText);
oStage.addComponent(oGameCancelUndoText);

Gomoku.inGame = false;
Gomoku.board = {};


// [x,y,color]
/**
 * 下在某处
 */
Gomoku.setIn = (pos, color) => {

    if (!Gomoku.checkAllowSetIn(pos)) {
        return false;
    }
    color = color || Gomoku.getRightName();
    Gomoku.setInOrder.push([pos, color]);
    Gomoku.undoOrder = [];  //  已经下棋，清空悔棋
    Gomoku.board[pos] = color;

    Gomoku.display();
    Gomoku.checkIsWin(pos, color);
};
/**
 * 检测是否允许下在这里
 */
Gomoku.checkAllowSetIn = (pos) => {
    return Gomoku.board[pos] === '_';
};

/**
 * 检测是否赢了
 */

Gomoku.checkIsWin = (pos, color) => {
    const arrPos = pos.split('_');
    const calcResult = Gomoku.calcIsWin(arrPos, color);


    let isWin = false;
    calcResult.forEach((i) => {
        if (i >= 4) {
            isWin = true;
        }
    });
    if (isWin) {
        Gomoku.inGame = false;
        oGameRightText.update(color + '获得了了胜利！重新开始', true);
    }
    return isWin;
};

/**
 * 获取当前棋权
 */
Gomoku.getRightName = () => {
    let i = Gomoku.setInOrder.length - 1;
    if (i < 0) {
        return 'black';
    } else {
        return Gomoku.setInOrder[i][1] === 'black' ? 'white' : 'black';
    }
};
/**
 * 后退操作
 */
Gomoku.undo = () => {
    if (!Gomoku.inGame || Gomoku.setInOrder.length <= 0) {
        return false;
    }
    const order = Gomoku.setInOrder.pop();
    Gomoku.undoOrder.push(order);
    Gomoku.board[order[0]] = '_';
    Gomoku.display();
};
/**
 * 取消后退操作
 */
Gomoku.cancelUndo = () => {
    if (Gomoku.undoOrder.length <= 0) {
        return false;
    }
    const order = Gomoku.undoOrder.pop();
    Gomoku.setInOrder.push(order);
    Gomoku.board[order[0]] = order[1];
    Gomoku.display();
};
/**
 * 展现信息
 */
Gomoku.display = () => {
    //  渲染内容
    // console.log(Gomoku.board);
    //  显示当前棋权
    let text = '当前' + Gomoku.getRightName() + '走!';
    // console.log(text);
    if (!Gomoku.inGame) {
        text = '点此开始游戏';
    }
    oGameBoard.drawSelf();
    oGameRightText.update(text, !Gomoku.inGame);
    oStage.drawComponents();
};

/**
 * 计算是否获得胜利
 * @param arrPos
 * @param color
 * @returns {[*,*,*,*]}
 */
Gomoku.calcIsWin = (arrPos, color) => {
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
        let x = arrPos[0] - i;
        let y = arrPos[1] - i;

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

    console.log(lib);


    return [
        lib.prevXSum + lib.nextXSum,    // x
        lib.prevYSum + lib.nextYSum,     // y
        lib.prevRtSum + lib.prevRdSum,    //   /
        lib.prevLtSum + lib.prevLdSum    //   \
    ];
    //
    // let min = Math.min(x - 4, 0);
    // let max = Math.min(x + 4, 14);

    // let list = Gomoku.board
};

/**
 * 重新开始游戏
 */
Gomoku.restart = (isStart) => {
    Gomoku.inGame = isStart;
    let size = 15;
    '-'.repeat(size).split('').forEach((_, x) => {
        '-'.repeat(size).split('').forEach((_, y) => {
            let pos = [x, y].join('_');
            Gomoku.board[pos] = '_';
        });
    });
    Gomoku.setInOrder = [];
    Gomoku.undoOrder = [];
    Gomoku.display();

};
Gomoku.restart(false);
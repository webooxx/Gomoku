/**
 * 视图基类
 * 具体实现由子对象实现
 */
export default class View {

    constructor(config) {
        let {$el, $game} = config;
        this.$el = $el;
        this.$game = $game;
        return this;
    }

    /**
     * 更新棋权文本
     */
    gameRightTextUpdate() {

    }

    /**
     * 更新棋盘信息（所有棋子）
     */
    gameBoardUpdatePieces() {

    }

    /**
     * 更新棋盘当前的预览落子
     */
    gameBoardUpdatePreview() {

    }

    static createElement(tagName, pros, parent) {
        let $node = document.createElement(tagName);
        Object.keys(pros).forEach((k) => {
            if (k === 'text') {
                $node.innerText = pros[k];
            } else {
                $node.setAttribute(k, pros[k]);
            }
        });
        if (parent) {
            parent.appendChild($node);
        }
        return $node;

    }
}
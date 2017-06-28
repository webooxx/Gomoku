/**
 * @file 游戏界面管理器
 *
 * - 管理所有的视图元素
 * - 派发事件
 */
import {createCanvas} from "./Utils";

export default class Stage {

    constructor(size) {

        console.log('init Stage');

        const oCanvas = createCanvas(size);

        this.size = size;

        this.$el = oCanvas.$el;
        this.$canvas = oCanvas.$canvas;

        //  派发事件到元件中
        // @todo  派发之前就进行区域检测
        this.$el.addEventListener('click', (evt) => {
            this.mapEvent['click'].forEach((component) => {
                let pos = {x: evt.offsetX * 2, y: evt.offsetY * 2}
                component.checkPosInRegion(pos) && component.onClick(pos);
            });
        });

        this.$el.addEventListener('mousemove', (evt) => {
            this.mapEvent['mousemove'].forEach((component) => {
                let pos = {x: evt.offsetX * 2, y: evt.offsetY * 2};
                component.checkPosInRegion(pos) && component.onMouseMove(pos);
            })
        });

        this.reset();
        return this;
    }

    //  重设
    reset() {
        this.components = {};
        this.componentIdMap = {};    //  id 到 components 的映射
        this.mapEvent = {
            'mousemove': [],
            'click': [],
        };
    }

    // 渲染所有元件
    drawComponents() {

        const w = this.size[0];
        const h = this.size[1];
        const $stage = this;
        this.$canvas.clearRect(0, 0, w, h);

        //  按照顺序逐一渲染
        Object.keys(this.components).forEach((i) => {
            this.components[i].forEach((component) => {
                // console.log('draw', component);
                const w = component.size[0];
                const h = component.size[1];
                const x = component.pos[0];
                const y = component.pos[1];
                // drawImage 只能用 $el
                // console.log(component.id, component.pos)
                $stage.$canvas.drawImage(component.$el, 0, 0, w, h, x, y, w, h);
            });

        })
    }

    //  添加元件
    addComponent(component) {
        if (!component) {
            return false;
        }
        const zIndex = component.zIndex;
        const id = component.id;

        if (typeof this.components[zIndex] === 'undefined') {
            this.components[zIndex] = [component]
        } else {
            this.components[zIndex].push(component);
        }
        this.componentIdMap[id] = [zIndex, this.components[zIndex].length - 1];
        const $stage = this;
        //  事件注册
        component.registEvents.forEach((eventName) => {
            $stage.mapEvent[eventName] && $stage.mapEvent[eventName].push(component);
        });
        component.$stage = $stage;
        component.init && component.init();
        //  元素添加后调用自身的 init 方法，绘制自身的操作，只在进入舞台的时候执行一次，除非后续需要自行更新
    }

    //  删除元件
    delComponent(component) {
        const info = this.componentIdMap[component.id];
        const zIndex = info[0];
        const pos = info[1];
        this.components[zIndex].splice(pos, 1);
        debugger
    }
}

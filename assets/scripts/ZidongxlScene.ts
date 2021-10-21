import GridNode from "./GridNode";

/*
 * @Descripttion: 
 * @Author: Zhiping Jiang
 * @Information: 564371466@qq.com
 * @Date: 2020-12-26 10:27:15
 * @Belong: Copyright (c) 2020 564371466@qq.com All rights reserved.
 */

const {ccclass, property} = cc._decorator;

@ccclass
export default class ZidongxlScene extends cc.Component {

    _curSelectGridType : string = "1x1";

    start () {
        this.initMapGrid();

        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
    }

    onTouchStart ( event:cc.Event.EventTouch ) {
        
    }

    onTouchMove ( event:cc.Event.EventTouch ) {

    }

    /**
     * 初始化地图网格
     */
    initMapGrid () {
        cc.resources.load("GridPrefab", (err, grid:cc.Prefab) => {
            let winSize = cc.view.getCanvasSize();
            console.log("winSize : ", winSize);
            let start = cc.v2(-2400/2 + 20, -1120/2 + 20);
            console.log("start : ", start);
            let rowSum = 1120/40;
            let colSum = 2400/40;
            console.log("rowSum : ", rowSum);
            console.log("colSum : ", colSum);
            for (let index = 0; index < rowSum; index++) {
                for (let col = 0; col < colSum; col++) {
                    let node = cc.instantiate(grid);
                    node.setPosition(start.x + col*40, start.y + index*40);
                    this.node.addChild(node);
                    node.getComponent("GridNode").initGridPoint(index, col);
                }
            }
        });
    }
    
}

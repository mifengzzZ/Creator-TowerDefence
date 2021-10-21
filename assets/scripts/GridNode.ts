/*
 * @Descripttion: 
 * @Author: Zhiping Jiang
 * @Information: 564371466@qq.com
 * @Date: 2020-12-26 11:07:16
 * @Belong: Copyright (c) 2020 564371466@qq.com All rights reserved.
 */

const {ccclass, property} = cc._decorator;

@ccclass
export default class GridNode extends cc.Component {

    _width : number = 40;
    _height : number = 40;

    _gridPointX : number = 0;
    _gridPointY : number = 0;

    start() {
        this.node.addComponent(cc.Button);
        this.node.on("click", this.onClick, this);
    }

    /**
     * row : 横
     * col : 列
     */
    initGridPoint ( row:number, col:number ) {
        this._gridPointX = row;
        this._gridPointY = col;
    }

    onClick () {
        console.log(this._gridPointX + "," + this._gridPointY);
    }

}

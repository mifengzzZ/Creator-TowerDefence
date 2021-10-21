import ToolUtils from "../core/utils/ToolUtils";
import { LbbwzConfigGK, bundleCfg } from "./LbbwzConfig";
import ResourcesManager from "../core/manager/ResourcesManager";
import BundleManager from "../core/manager/BundleManager";
import LogManager from "../core/manager/LogManager";

/*
 * @Descripttion: 选择种植的物品
 * @Author: Zhiping Jiang
 * @Information: 564371466@qq.com
 * @Date: 2020-12-16 10:59:35
 * @Belong: Copyright (c) 2020 564371466@qq.com All rights reserved.
 */

const {ccclass, property} = cc._decorator;

@ccclass
export default class LbbwzSelectWupin extends cc.Component {

    _resMgr : BundleManager = null;

    _utils : ToolUtils = null;

    _sceneTs : any = null;

    _map : any = LbbwzConfigGK.map1;

    _tempWuPinArr : cc.Node[] = [];

    _obj : cc.Node = null;

    start () {
        this._utils = ToolUtils.getInstance();
        this._resMgr = BundleManager.getInstance();
        this._sceneTs = this._utils.getNodeByName(cc.director.getScene(), "Canvas").getComponent("LbbwzScene");
        this.node.active = false;
        this.node.on("click", this.onTouch, this);
    }
    
    showArms ( obj:cc.Node ) {
        this._obj = obj;
        let point = this._obj.getPosition();
        this.node.active = true;
        for (let index = 0; index < this._map.arms.length; index++) {
            const element = this._map.arms[index];
            let node = new cc.Node();
            node.addComponent(cc.Sprite);
            LogManager.getInstance().log("element.type : " + element.type);
            var frame = this._resMgr.getCacheRes(bundleCfg.bwlb, element.type).getSpriteFrame(element.name + "01");
            node.getComponent(cc.Sprite).spriteFrame = frame;
            node.addComponent(cc.Button);
            this.node.addChild(node);
            node.setPosition(point.x, point.y + 100);
            node.on("click", this.onZhongzhi, this);
            node.scale = 0;
            cc.tween(node).to(0.1, {scale : 1}).start();
            this._tempWuPinArr.push(node);
        }
    }

    onZhongzhi ( sender:any, obj:any ) {
        cc.log("sender : ", sender);
        this.onTouch();
        this._obj.getComponent("LbbwzTower").creatorArms();
    }

    showShengji () {
        this.node.active = true;
    }

    /**
     * 创建升级与铲除
     */

    /**
     * 隐藏
     */
    onTouch () {
        cc.log("取消种植物品");
        this.node.active = false;
        for (const node of this._tempWuPinArr) {
            node.destroy();
        }
        this._tempWuPinArr = [];
        let arr = this._sceneTs.getAddPtRectArr();
        for (let index = 0; index < arr.length; index++) {
            const node = arr[index];
            node.getComponent("LbbwzTower").resetUI();
        }
    }

    // update (dt) {}
}

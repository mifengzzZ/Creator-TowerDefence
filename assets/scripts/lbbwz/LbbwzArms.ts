import ToolUtils from "../core/utils/ToolUtils";
import ResourcesManager from "../core/manager/ResourcesManager";
import BundleManager from "../core/manager/BundleManager";
import { bundleCfg } from "./LbbwzConfig";

/*
 * @Descripttion: 武器
 * @Author: Zhiping Jiang
 * @Information: 564371466@qq.com
 * @Date: 2020-12-15 23:21:26
 * @Belong: Copyright (c) 2020 564371466@qq.com All rights reserved.
 */

const {ccclass, property} = cc._decorator;

@ccclass
export default class LbbwzArms extends cc.Component {

    _resMgr : BundleManager = null;
    _utils : ToolUtils = null;
    _sceneTs : any = null;

    // 攻击间隔
    _time : number = 0.5;
    _timetemp : number = 0;

    // 等级
    _lv : number = 1;

    // 攻击距离
    _distance : number = 250;

    // 攻击目标
    _gjObj : cc.Node = null;

    // 大炮
    _dapaoNode : cc.Node = null;

    // 添加子弹的位置的节点
    _buttleNode : cc.Node = null;

    _idx : number = null;

    // 保存发射的子弹
    _fasheButtleNode : cc.Node = null;

    setIdx ( index:number ) {
        this._idx = index;
    }

    start () {
        this._utils = ToolUtils.getInstance();
        this._resMgr = BundleManager.getInstance();
        this._sceneTs = this._utils.getNodeByName(cc.director.getScene(), "Canvas").getComponent("LbbwzScene");

        this._dapaoNode = this._utils.getNodeByName(this.node, "pt");
        this._buttleNode = this._utils.getNodeByName(this.node, "buttle");

    }

    /**
     * 发射子弹
     */
    startLaunchButtle () {
        if (!this._gjObj && !this._gjObj.isValid) {
            return;
        }
        cc.log("发射子弹 : ", this._idx);
        cc.audioEngine.play(this._resMgr.getCacheRes(bundleCfg.bwlb, "rLbbwz_sound_Bottle"), false,  1);
        this._fasheButtleNode = cc.instantiate(this._resMgr.getCacheRes(bundleCfg.bwlb, "rLbbwz_buttle"));
        let v1 = this._utils.convertNodeSpaceAR(this._sceneTs.getMapNode(), this._buttleNode);
        this._fasheButtleNode.setPosition(v1);
        let startPos = this._fasheButtleNode.getPosition();
        let endPos = this._gjObj.getPosition();
        let normalizeVec : cc.Vec2 = endPos.subtract(startPos).normalize();
        this._fasheButtleNode.angle = cc.v2(0, 1).signAngle(normalizeVec) * 180 / Math.PI;
        this._fasheButtleNode.getComponent("LbbwzButtle").setEnemyObj(this._gjObj, this.endCallback.bind(this), this._idx);
        this._sceneTs.getMapNode().addChild(this._fasheButtleNode);
    }

    /**
     * 子弹攻击完之后的回调
     */
    endCallback () {
        this._gjObj = null;
    }

    /**
     * 旋转炮口角度
     */
    paoKouAngel () {
        if (this._gjObj && this._gjObj.isValid) {
            // 是否已经脱离攻击范围
            let startPos = this.node.getPosition();
            let endPos = this._gjObj.getPosition();
            // 旋转炮口
            let normalizeVec : cc.Vec2 = endPos.subtract(startPos).normalize();
            this._dapaoNode.angle = cc.v2(0, 1).signAngle(normalizeVec) * 180 / Math.PI;
        } else {
            this.endCallback();
        }
    }

    /**
     * 同步敌人死亡
     */
    tongbuEnemyDeth ( idx:number ) : boolean {
        if (this._gjObj) {
            if (this._gjObj.getComponent("LbbwzEnemy").getIdx() === idx) {
                this._gjObj = null;
                this._fasheButtleNode.getComponent("LbbwzButtle").tongbuEnemyDeth();
                return true;
            }
        }
        return false;
    }

    update ( dt:any ) {
        // 炮塔攻击时间间隔
        if (this._time > this._timetemp) {
            this._timetemp += dt;
            this.paoKouAngel();
            return;
        }
        this._timetemp = 0;

        // 获取攻击目标
        if (!this._gjObj) {
            let arr = this._sceneTs.getAllEnemy();
            for (let index = 0; index < arr.length; index++) {
                const element = arr[index];
                if (element !== 0) {
                    let startPos = this.node.getPosition();
                    let endPos = element.getPosition();
                    let v = new cc.Vec2(startPos.x - endPos.x, startPos.y - endPos.y);
                    if (v.mag() <= this._distance) {
                        if (element.getComponent("LbbwzEnemy").getLv() - element.getComponent("LbbwzEnemy").getSelectTowerCount() >= 1) {
                            element.getComponent("LbbwzEnemy").addSelectTowerCount(this.endCallback.bind(this));
                            this._gjObj = element;
                            this.paoKouAngel();
                            this.startLaunchButtle();
                            break;
                        }
                    }   
                }
            }
        } else {
            // 是否已经脱离攻击范围
            let startPos = this.node.getPosition();
            let endPos = this._gjObj.getPosition();
            let v = new cc.Vec2(startPos.x - endPos.x, startPos.y - endPos.y);
            if (v.mag() > this._distance) {
                this._gjObj.getComponent("LbbwzEnemy").subSelectTowerCount();
                this._gjObj = null;
            }
            // 旋转炮口
            let normalizeVec : cc.Vec2 = endPos.subtract(startPos).normalize();
            this._dapaoNode.angle = cc.v2(0, 1).signAngle(normalizeVec) * 180 / Math.PI;
        }
    } 

}

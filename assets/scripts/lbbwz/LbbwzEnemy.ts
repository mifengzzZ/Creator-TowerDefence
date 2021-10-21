import ToolUtils from "../core/utils/ToolUtils";
import { LbbwzConfigGK, bundleCfg } from "./LbbwzConfig";
import ResourcesManager from "../core/manager/ResourcesManager";
import BundleManager from "../core/manager/BundleManager";

/*
 * @Descripttion: 敌人
 * @Author: Zhiping Jiang
 * @Information: 564371466@qq.com
 * @Date: 2020-12-15 16:29:14
 * @Belong: Copyright (c) 2020 564371466@qq.com All rights reserved.
 */


const {ccclass, property} = cc._decorator;

@ccclass
export default class LbbwzEnemy extends cc.Component {

    _utils : ToolUtils = null;
    _resMgr : BundleManager = null;

    _sceneTs : any = null;

    _anim : cc.Animation = null;
    _animationState : cc.AnimationState = null;

    _clipArr : cc.AnimationClip[] = [];

    _map : any = LbbwzConfigGK.map1;

    _sumMoveCount : number = LbbwzConfigGK.map1.enemyMovePos.length;
    _curMoveIdx : number = 1;

    _speed : number = 300;

    _lv : number = 0;

    _tagIdx : number = 0;

    _progres : cc.ProgressBar = null;

    _subValue : number = 0;

    // 已经被炮塔选中的数量
    _selectTowerNum : number = 0;

    _soundMathName : string[] = [
        "rLbbwz_sound_Fat241",
        "rLbbwz_sound_Fat242",
        "rLbbwz_sound_Fat243"
    ];

    /**
     * 增加炮塔数
     */
    addSelectTowerCount ( ) {
        this._selectTowerNum += 1;
    }

    /**
     * 获取炮塔数
     */
    getSelectTowerCount () : number {
        return this._selectTowerNum;
    }

    /**
     * 减少炮塔数
     */
    subSelectTowerCount () {
        this._selectTowerNum -= 1;
        if (this._selectTowerNum < 0) {
            this._selectTowerNum = 0;
        }
    }

    /**
     * 获取怪物血量
     */
    getLv () {
        return this._lv;
    }

    subLv () {
        this._lv -= 1
    }

    upProgres () {
        this._progres.progress -= this._subValue;
    }

    /**
     * 获取怪物索引
     */
    getIdx () {
        return this._tagIdx;
    }

    start () {
        this._resMgr = BundleManager.getInstance();
        this._utils = ToolUtils.getInstance();
        this._sceneTs = this._utils.getNodeByName(cc.director.getScene(), "Canvas").getComponent("LbbwzScene");

        cc.log("敌人初始化");

        let progresNode = this._utils.getNodeByName(this.node, "progres");
        this._progres = progresNode.getComponent(cc.ProgressBar);
        this._progres.progress = 1;
        this._subValue = 1/this._lv;

        this._anim = this.node.getComponent(cc.Animation);
        this._clipArr = this._anim.getClips();
        this._anim.play(this._clipArr[0].name);

        this.startMove();
    }

    /**
     * 初始化怪物数值
     */
    initValue ( lv:number, tagIdx:number ) {
        this._lv = lv;
        this._tagIdx = tagIdx;
    }

    /**
     * 开始移动
     */
    startMove () {
        cc.tween(this.node).to(this.getTime(this._curMoveIdx), {position : cc.v3(this._map.enemyMovePos[this._curMoveIdx].x, this._map.enemyMovePos[this._curMoveIdx].y)})
                        .call(this.enemyMoveCallback.bind(this)).start();
    }

    /**
     * 计算移动时间
     */
    getTime ( idx:number ) {
        let sum = 0;
        if (this._map.enemyMovePos[idx].hs === 1) {
            sum = Math.abs(this._map.enemyMovePos[idx].y - this._map.enemyMovePos[idx - 1].y);
        } else {
            sum = Math.abs(this._map.enemyMovePos[idx].x - this._map.enemyMovePos[idx - 1].x);
        }
        return sum / this._speed;
    }

    /**
     * 敌人移动到目标点之后是否还能继续移动回调
     */
    enemyMoveCallback () {
        this._curMoveIdx += 1;
        if (this._curMoveIdx < this._sumMoveCount) {
            this.startMove();
        }
    }

    /**
     * 播放死亡动画
     */
    destroyAnim () {
        this._sceneTs.updateEnemyArr(this._tagIdx);
        this._lv = 0;
        this._selectTowerNum = 0;
        cc.audioEngine.play(this._resMgr.getCacheRes(bundleCfg.bwlb, this._soundMathName[ToolUtils.getInstance().getRandom(0, 3)]), false,  1);
        this.node.destroy();
    }

//----------------------------------------------------------------------------------------------------------------------------------------
// 碰撞系统
//----------------------------------------------------------------------------------------------------------------------------------------
    /**
     * 碰撞体第一次接触
     * @param other
     * @param self 
     */
    onCollisionEnter ( other, self ) {
        if (other.node.group === "luobo") {
            cc.log("通知所属炮口->该敌人已经死亡");
            this._sceneTs.dispatchEnemyDeth(this._tagIdx);
            this.destroyAnim();
        }
    }

    /**
     * 持续接触
     * @param other 
     * @param self 
     */
    onCollisionStay ( other, self ) {
        if (other.node.group === "") {
            
        }
    }

    /**
     * 碰撞体离开
     * @param other
     * @param self 
     */
    onCollisionExit ( other, self ) {
        if (other.node.group === "") {
            
        }
    }
}

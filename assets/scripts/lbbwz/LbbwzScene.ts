import { LbbwzConfigRes, LbbwzConfigGK, bundleCfg } from "./LbbwzConfig";
import ResourcesManager from "../core/manager/ResourcesManager";
import ToolUtils from "../core/utils/ToolUtils";
import BundleManager from "../core/manager/BundleManager";
import AdvertManager from "../core/manager/WxMinManager";

/*
 * @Descripttion: 萝卜保卫战-战斗场景
 * @Author: Zhiping Jiang
 * @Information: 564371466@qq.com
 * @Date: 2020-12-15 13:10:52
 * @Belong: Copyright (c) 2020 564371466@qq.com All rights reserved.
 */


const {ccclass, property} = cc._decorator;

@ccclass
export default class LbbwzScene extends cc.Component {

    _resMgr : BundleManager = null;

    _luoboNode : any = null;

    _jiantouNode : any = null;

    _selectWupinNode : cc.Node = null;

    _mapNode : cc.Node = null;

    _map : any = LbbwzConfigGK.map1;

    _addPtRectArr : cc.Node[] = [];

    _enemyArr : any[] = [];

    _towerArr : any[] = [];

    // 倒计时动画节点
    _startDownTimeAnimNode : cc.Node = null;

    // 金币显示文本
    _goldLabel : cc.Label = null;
    // 金币数
    _goldNum : number = 0;
    // 暂停与开始
    _gameStopOrStart : cc.Node = null;
    // 游戏状态
    _status : number = 0;

    /**
     * 增加金币数
     */
    addGold ( num:number ) {
        this._goldNum += num;
        cc.log("this._goldNum : ", this._goldNum);
        this._goldLabel.getComponent(cc.Label).string = this._goldNum.toString();
    }

    /**
     * 获取可以添加炮台区域节点数组
     */
    getAddPtRectArr () : any {
        return this._addPtRectArr;
    }
    
    /**
     * 获取所有敌人
     */
    getAllEnemy () : any {
        return this._enemyArr;
    }

    /**
     * 获取选择物品层
     */
    getSelectWupinNode () : any {
        return this._selectWupinNode;
    }

    /**
     * 获取地图节点
     */
    getMapNode () : any {
        return this._mapNode;
    }

    /**
     * 获取所有武器对象
     */
    getTowerArr () : any {
        return this._towerArr;
    }

    /**
     * 添加炮台
     */
    pushTower ( node:cc.Node ) {
        this._towerArr.push(node);
    }

    start () {
        this._resMgr = BundleManager.getInstance();
        this.initScene();
    }

    /**
     * 初始化场景
     */
    initScene () {
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        this._mapNode = ToolUtils.getInstance().getNodeByName(this.node, "path");

        this._goldLabel = ToolUtils.getInstance().getNodeByName(this.node, "gold");
        this._gameStopOrStart = ToolUtils.getInstance().getNodeByName(this.node, "btn");
        this._gameStopOrStart.on("click", this.onStopOrStart, this);
        cc.log("onStopOrStart : ", this._gameStopOrStart);

        this.creatorEmopai();
        this.creatorLuobo();
        this.creatorJiantouAnim();
        this.creatorAddPaota();
        // 开始倒计时动画
        this._startDownTimeAnimNode = cc.instantiate(this._resMgr.getCacheRes(bundleCfg.bwlb, "rLbbwz_jishistart"));
        this._startDownTimeAnimNode.getComponent("LbbwzStartAnim").setEndCallback(this.startGame.bind(this));
        this.node.addChild(this._startDownTimeAnimNode);
    }

    startGame () {
        this._startDownTimeAnimNode.active = false;
        this.stopAndHideJiantouAnim();
        this.startShowEnemy();
        this.creatorSelectWupin();
    }

    /**
     * 暂停或开始
     */
    onStopOrStart () {
        if (this._status === 0) {
            this._status = 1;
            this._gameStopOrStart.getComponent(cc.Sprite).spriteFrame = this._resMgr.getCacheRes(bundleCfg.bwlb, "rLbbwz_menu").getSpriteFrame("pause11");
            cc.director.pause();
        } else if (this._status === 1) {
            this._status = 0;
            this._gameStopOrStart.getComponent(cc.Sprite).spriteFrame = this._resMgr.getCacheRes(bundleCfg.bwlb, "rLbbwz_menu").getSpriteFrame("pause01");
            cc.director.resume();
        }
    }

    /**
     * 选择物品层
     */
    creatorSelectWupin () {
        this._selectWupinNode = cc.instantiate(this._resMgr.getCacheRes(bundleCfg.bwlb, "rLbbwz_selectWupin"));
        this._mapNode.addChild(this._selectWupinNode);
    }

    /**
     * 创建可以添加炮塔的区域
     */
    creatorAddPaota () {
        for (let index = 0; index < this._map.point.length; index++) {
            const element = this._map.point[index];
            let curPosX = element.x;
            let curPosY = element.y;
            for (let i = 0; i < element.count; i++) {
                let node = cc.instantiate(this._resMgr.getCacheRes(bundleCfg.bwlb, "rLbbwz_addPt"));
                if (i > 0) {
                    if (element.hs === 1) {
                        curPosY -= element.interval;
                        node.position = cc.v2(curPosX, curPosY);
                    } else {
                        curPosX += element.interval;
                        node.position = cc.v2(curPosX, curPosY);
                    }
                } else {
                    node.position = cc.v2(curPosX, curPosY);
                }
                this._mapNode.addChild(node);
                this._addPtRectArr.push(node);
            }
        }
    }

    /**
     * 创建恶魔牌
     */
    creatorEmopai () {
        let node = new cc.Node();
        node.addComponent(cc.Sprite);
        var frame = this._resMgr.getCacheRes(bundleCfg.bwlb, "rLbbwz_items").getSpriteFrame("start01");
        node.getComponent(cc.Sprite).spriteFrame = frame;
        this._mapNode.addChild(node);
        node.setPosition(this._map.zhanpai.x, this._map.zhanpai.y);
    }

    /**
     * 创建萝卜
     */
    creatorLuobo () {
        this._luoboNode = cc.instantiate(this._resMgr.getCacheRes(bundleCfg.bwlb, "rLbbwz_luobo"));
        this._mapNode.addChild(this._luoboNode);
        this._luoboNode.setPosition(this._map.luobo.x, this._map.luobo.y);
    }

    /**
     * 播放箭头动画
     */
    creatorJiantouAnim () {
        this._jiantouNode = cc.instantiate(this._resMgr.getCacheRes(bundleCfg.bwlb, "rLbbwz_jiantouAnim"));
        this._mapNode.addChild(this._jiantouNode);
        this._jiantouNode.setPosition(this._map.startAnimPoint.x, this._map.startAnimPoint.y);
        this._jiantouNode.angle = this._map.startAnimPoint.rotation;
        this._jiantouNode.getComponent(cc.Animation).play("rLbbwzClip_jiantou");
    }

    /**
     * 停止箭头播放并且隐藏
     */
    stopAndHideJiantouAnim () {
        this._jiantouNode.getComponent(cc.Animation).stop("rLbbwzClip_jiantou");
        this._jiantouNode.active = false;
    }

    /**
     * 开始出现怪物
     */
    startShowEnemy () {
        var interval = 1;
        var repeat = 10000;
        var delay = 1;
        this.schedule(this.creatorEnemy.bind(this), interval, repeat, delay);
    }

    /**
     * 创建Enemy
     */
    creatorEnemy () {
        let enemyNode = cc.instantiate(this._resMgr.getCacheRes(bundleCfg.bwlb, this._map.enemy[0].name));
        enemyNode.getComponent("LbbwzEnemy").initValue(this._map.enemy[0].lv, this._enemyArr.length);
        this._mapNode.addChild(enemyNode);
        enemyNode.setPosition(this._map.enemyMovePos[0].x, this._map.enemyMovePos[0].y);
        this._enemyArr.push(enemyNode);

        // 时光隧道
        // let sgsdNode = cc.instantiate(this._resMgr.s_resources["rLbbwz_xuanzhuan"]);
        // this._mapNode.addChild(sgsdNode);
        // sgsdNode.setPosition(this._map.enemyMovePos[0].x, this._map.enemyMovePos[0].y);
        // cc.tween(sgsdNode).to(0.2, {position : cc.v2(this._map.enemyMovePos[0].x, this._map.enemyMovePos[0].y - 50)}).start();
        // sgsdNode.getComponent(cc.Animation).play("rLbbwzClip_xuanzhuan");
        // sgsdNode.getComponent(cc.Animation).on('finished', () => {
        //     sgsdNode.destroy();
        // });
    }
    
    /**
     * 更新保存怪物数量
     */
    updateEnemyArr ( tag:number ) {
        this._enemyArr[tag] = 0;
    }

    /**
     * 通知其它功能,该敌人已死亡
     */
    dispatchEnemyDeth ( idx:number ) {
        for (let index = 0; index < this._towerArr.length; index++) {
            const element = this._towerArr[index];
            let b = element.getComponent("LbbwzTower").getArmsNode().getComponent("LbbwzArms").tongbuEnemyDeth(idx);
            if (b) {
                break;
            }
        }
    }

    // update (dt) {

    // }
}

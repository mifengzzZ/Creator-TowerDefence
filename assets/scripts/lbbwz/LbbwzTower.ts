import ToolUtils from "../core/utils/ToolUtils";
import ResourcesManager from "../core/manager/ResourcesManager";
import LbbwzScene from "./LbbwzScene";
import BundleManager from "../core/manager/BundleManager";
import { bundleCfg } from "./LbbwzConfig";

/*
 * @Descripttion:  炮台
 * @Author: Zhiping Jiang
 * @Information: 564371466@qq.com
 * @Date: 2020-12-15 23:15:50
 * @Belong: Copyright (c) 2020 564371466@qq.com All rights reserved.
 */

const {ccclass, property} = cc._decorator;

@ccclass
export default class LbbwzTower extends cc.Component {

    _utils : ToolUtils = null;
    _resMgr : BundleManager = null;

    _ptPoint : cc.Node = null;
    _ptAddAnim : cc.Node = null;
    _ptAddBtn : cc.Node = null;

    // 0:提示状态 1:显示添加按钮状态(透明) 2:触发添加动画状态
    _status : number = 0;

    _sceneTs : LbbwzScene = null;

    // 武器对象
    _armsNode : cc.Node = null;

    getArmsNode () : cc.Node {
        return this._armsNode;
    }

    start () {
        this._utils = ToolUtils.getInstance();
        this._resMgr = BundleManager.getInstance();
        this._sceneTs = this._utils.getNodeByName(cc.director.getScene(), "Canvas").getComponent("LbbwzScene");

        this._ptPoint = this._utils.getNodeByName(this.node, "pt_point");
        this._ptAddAnim = this._utils.getNodeByName(this.node, "pt_addAnim");
        this._ptAddBtn = this._utils.getNodeByName(this.node, "pt_addBtn");
        this._ptAddBtn.on("click", this.onAddBtn, this);

        this.changeShowByStatus();
    }

    /**
     * 还原点击之前的状态
     */
    resetUI () {
        this._status = 1;
        this.changeShowByStatus();
    }

    /**
     * 添加炮台按钮回调
     */
    onAddBtn () {
        cc.log("点加添加炮台按钮");
        this._status = 2;
        this.changeShowByStatus();
        let ts = this._sceneTs.getSelectWupinNode().getComponent("LbbwzSelectWupin");
        if (this._armsNode === null) {
            cc.log("显示武器");
            ts.showArms(this.node);
        } else {
            cc.log("显示升级");
            ts.showShengji();
        }
    }

    /**
     * 根据状态切换显示
     */
    changeShowByStatus () {
        if (this._status === 0) {
            this._ptAddAnim.active = false;
            this._ptAddBtn.active = false;
            this.playShandongAnim();
        } else if (this._status === 1) {
            this._ptPoint.active = false;
            this._ptAddAnim.active = false;
            this._ptAddBtn.active = true;
        } else if (this._status === 2) {
            this._ptPoint.active = false;
            this._ptAddAnim.active = true;
            this._ptAddBtn.active = false;
            this.playAddAnim();
        }
    }

    /**
     * 播放闪动动画 3s
     */
    playShandongAnim () {
        let anim = this._ptPoint.getComponent(cc.Animation);
        let clipArr = anim.getClips();
        anim.play(clipArr[0].name);
        this.schedule(() => {
            anim.stop(clipArr[0].name);
            this._status = 1;
            this.changeShowByStatus();
        }, 0, 0, 1);
    }

    /**
     * 播放添加动画
     */
    playAddAnim () {
        let anim = this._ptAddAnim.getComponent(cc.Animation);
        let clipArr = anim.getClips();
        anim.play(clipArr[0].name);
    }

    /**
     * 创建武器对象
     */
    creatorArms () {
        this._armsNode = cc.instantiate(this._resMgr.getCacheRes(bundleCfg.bwlb, "rLbbwz_paota"));
        this._armsNode.getComponent("LbbwzArms").setIdx(this._sceneTs.getTowerArr().length);
        this._sceneTs.pushTower(this.node);
        this._sceneTs.getMapNode().addChild(this._armsNode);
        this._armsNode.setPosition(this.node.getPosition().x, this.node.getPosition().y);
    }

}

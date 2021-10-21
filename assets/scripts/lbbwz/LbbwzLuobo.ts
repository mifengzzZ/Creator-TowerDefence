import ToolUtils from "../core/utils/ToolUtils";
import ResourcesManager from "../core/manager/ResourcesManager";
import BundleManager from "../core/manager/BundleManager";
import { bundleCfg } from "./LbbwzConfig";

/*
 * @Descripttion: 胡萝卜
 * @Author: Zhiping Jiang
 * @Information: 564371466@qq.com
 * @Date: 2020-12-14 10:56:43
 * @Belong: Copyright (c) 2020 564371466@qq.com All rights reserved.
 */

const {ccclass, property} = cc._decorator;

@ccclass
export default class LbbwzLuobo extends cc.Component {

    _utils : ToolUtils = null;
    _resMgr : BundleManager = null;

    _anim : cc.Animation = null;
    _animationState : cc.AnimationState = null;

    _clipArr : cc.AnimationClip[] = [];

    _isTouch : Boolean = false;

    _value : number = 10;

    start () {
        this._utils = ToolUtils.getInstance();
        this._resMgr = BundleManager.getInstance();

        cc.log("萝卜初始化");

        this._anim = this.node.getComponent(cc.Animation);
        this._clipArr = this._anim.getClips();
        this._animationState = this._anim.play(this._clipArr[0].name);
        this._anim.on('finished', this.onFinished, this);

        let touchNode = this._utils.getNodeByName(this.node, "touchNode");
        touchNode.on("click", this.onClick, this);
    }
    
    /**
     * 切换成抖动动画
     */
    changeAnimationClip ( idx:number ) {
        this._anim.stop();
        this._animationState = this._anim.play(this._clipArr[idx].name);
    }

    /**
     * 触摸萝卜
     */
    onClick ( ) {
        if (this._isTouch) {
            return;
        }
        this._isTouch = true;
        this.changeAnimationClip(1);
    }

    /**
     * 抖动动画播放完成
     */
    onFinished () {
        if (this._animationState.clip.name === this._clipArr[1].name) { // 抖动
            this._anim.play(this._clipArr[0].name);
            this._isTouch = false;
        }
    }

    /**
     * 停止动画,切换纹理
     */
    changeTexture () {
        this._anim.stop();
        if (this._value === 7) {
            this._value = 6;
        } else if (this._value === 5) {
            this._value = 4;
        }
        var frame = this._resMgr.getCacheRes(bundleCfg.bwlb, "rLbbwz_luobo_plist").getSpriteFrame("hlb" + this._value.toString());
        this.getComponent(cc.Sprite).spriteFrame = frame;
    }

//----------------------------------------------------------------------------------------------------------------------------------------
// 碰撞系统
//----------------------------------------------------------------------------------------------------------------------------------------
    /**
     * 碰撞体第一次接触
     * @param other
     * @param self 
     */
    onCollisionEnter ( other, self) {
        if (other.node.group === "enemy") {
            this._value -= 1;
            if (this._value < 1) {
                cc.log("游戏结束");
            }
            this.changeTexture();
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

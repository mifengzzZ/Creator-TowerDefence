import ResourcesManager from "../core/manager/ResourcesManager";
import BundleManager from "../core/manager/BundleManager";
import { bundleCfg } from "./LbbwzConfig";

/*
 * @Descripttion: 开始倒计时动画
 * @Author: Zhiping Jiang
 * @Information: 564371466@qq.com
 * @Date: 2020-12-17 19:28:24
 * @Belong: Copyright (c) 2020 564371466@qq.com All rights reserved.
 */

const {ccclass, property} = cc._decorator;

@ccclass
export default class LbbwzStartAnim extends cc.Component {

    _resMgr : BundleManager = null;

    _func : Function = null;

    start () {
        this._resMgr = BundleManager.getInstance();

        let anim = this.node.getComponent(cc.Animation);
        anim.play("rLbbwzClip_startGame");

    }

    setEndCallback ( func:Function ) {
        this._func = func;
    }

    onPlayEffect () {
        cc.audioEngine.play(this._resMgr.getCacheRes(bundleCfg.bwlb, "rLbbwz_sound_CountDown"), false,  1);
    }

    onAnimationEnd () {
        cc.audioEngine.play(this._resMgr.getCacheRes(bundleCfg.bwlb, "rLbbwz_sound_GO"), false,  1);
        this._func();
    }

}

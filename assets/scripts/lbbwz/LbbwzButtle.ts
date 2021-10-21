import ToolUtils from "../core/utils/ToolUtils";
import ResourcesManager from "../core/manager/ResourcesManager";

/*
 * @Descripttion: 子弹
 * @Author: Zhiping Jiang
 * @Information: 564371466@qq.com
 * @Date: 2020-12-15 23:15:50
 * @Belong: Copyright (c) 2020 564371466@qq.com All rights reserved.
 */

const {ccclass, property} = cc._decorator;

@ccclass
export default class LbbwzButtle extends cc.Component {

    _utils : ToolUtils = null;

    // 子弹的速度
    _speed : number = 600;
    // 目标对象
    _obj : cc.Node = null;
    // 子弹爆炸之后的回调
    _callfunc : Function = null;

    _idx : number = null;

    start () {
        this._utils = ToolUtils.getInstance();
    }

    setEnemyObj ( node:cc.Node, callfunc:Function, idx?:number ) {
        this._obj = node;
        this._callfunc = callfunc;
        this._idx = idx;
    }

    /**
     * 播放死亡效果与头顶添加金币数量
     */
    onDethAnim () {
        let dethAnim = cc.instantiate(ResourcesManager.getInstance().s_resources["rLbbwz_enemyDeth"]);
        dethAnim.scale = 0.7;
        ToolUtils.getInstance().getNodeByName(cc.director.getScene(), "Canvas").getComponent("LbbwzScene").getMapNode().addChild(dethAnim);
        dethAnim.setPosition(this.node.getPosition().x, this.node.getPosition().y + 15);
        dethAnim.getComponent(cc.Animation).play("rLbbwzClip_enemyDeth");

        let goldAnim = cc.instantiate(ResourcesManager.getInstance().s_resources["rLbbwz_addGold"]);
        ToolUtils.getInstance().getNodeByName(cc.director.getScene(), "Canvas").getComponent("LbbwzScene").getMapNode().addChild(goldAnim);
        goldAnim.setPosition(dethAnim.getPosition().x, dethAnim.getPosition().y + 30);
        goldAnim.getComponent(cc.Animation).play("rLbbwzClip_addGold");

        ToolUtils.getInstance().getNodeByName(cc.director.getScene(), "Canvas").getComponent("LbbwzScene").addGold(14);
        
        this._obj.getComponent("LbbwzEnemy").destroyAnim();
    }

    onBoom () {
        if (this._obj && this._obj.isValid ) {
            if (this._obj.getComponent("LbbwzEnemy").getLv() > 1) {
                this._obj.getComponent("LbbwzEnemy").subLv();
                this._obj.getComponent("LbbwzEnemy").upProgres();
                this._obj.getComponent("LbbwzEnemy").subSelectTowerCount();
            } else {
                this.onDethAnim();
            }
            this._obj = null;
            this._callfunc();
            cc.log("移除子弹 : ", this._idx);
            this.node.destroy();
        } else {
            this._callfunc();
        }
        this.node.destroy();
    }

    /**
     * 中途被摧毁
     */
    tongbuEnemyDeth () {
        this._obj = null;
        this._callfunc();
        this.node.destroy();
    }

    update ( dt:any ) {
        if (!this._obj) return;
        if (this._obj.isValid) {
            let targetPos: cc.Vec2 = this._obj.getPosition();
            let bulletPos: cc.Vec2 = this.node.getPosition();
            let normalizeVec: cc.Vec2 = targetPos.subtract(bulletPos).normalize();
            this.node.x += normalizeVec.x * this._speed * dt;
            this.node.y += normalizeVec.y * this._speed * dt;
            this.node.angle = cc.v2(0, 1).signAngle(normalizeVec) * 180 / Math.PI;
        } else {
            this.tongbuEnemyDeth();
        }
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
            this.onBoom();
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

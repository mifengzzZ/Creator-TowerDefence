/*
 * @Descripttion: 帮助
 * @Author: Zhiping Jiang
 * @Information: 564371466@qq.com
 * @Date: 2020-09-13 14:14:29
 * @Belong: Copyright (c) 2020 564371466@qq.com All rights reserved.
 */

export default class ToolUtils {

    private static _ins : ToolUtils = null;

    static getInstance () : ToolUtils {
        if (!this._ins) {
            this._ins = new ToolUtils();
        }
        return this._ins;
    }

    /**
     * base64转uint8Array
     */
    base64ToUint8Array ( base64String:any ) {
        let padding = '='.repeat((4 - base64String.length % 4) % 4);
        let base64 = (base64String + padding)
            .replace(/\-/g, '+')
            .replace(/_/g, '/');
    
        let rawData = window.atob(base64);
        let outputArray = new Uint8Array(rawData.length);
    
        for (var i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

    /**
     * uint8Array转base64
     */
    uint8arrayToBase64 ( u8Arr:any ) {
        let CHUNK_SIZE = 0x8000;
        let index = 0;
        let length = u8Arr.length;
        let result = '';
        let slice = null;
        while (index < length) {
            slice = u8Arr.subarray(index, Math.min(index + CHUNK_SIZE, length));
            result += String.fromCharCode.apply(null, slice);
            index += CHUNK_SIZE;
        }
        return btoa(result);
    }
    
    /**
     * 获取父节点下的子节点
     */
    getNodeByName (root:any, name:string) : any {
        if (!root) {
            return null;
        }
        if (root.name === name) {
            return root;
        }
        for (let index = 0; index < root.childrenCount; index++) {
            const element = root.children[index];
            let res = this.getNodeByName(element, name);
            if (res !== null) {
                return res;
            }
        }
        return null;
    }

    /**
     * 根据ImgURL更新spriteFrame
     */
    setSpriteFrameByImgURL ( url:string, Img:cc.Node ) {
        if (url === "") {
            return;
        }
        cc.assetManager.loadRemote(url, cc.Texture2D, (err:any, texture:cc.Texture2D) => {
            let frame = new cc.SpriteFrame(texture);
            Img.getComponent(cc.Sprite).spriteFrame = frame;
        });
    }

    /**
     * 存储数据在本地
     * 所有数据存储字段 "userdata"
     * 如果想对本地存储数据加密可使用第三方库(encryptjs等)
     */
    setLocalData (key:string, data:any) {
        if (!key) {
            cc.log("------[ToolUtils] setLocalData key is null");
            return;
        }
        let jsondata = JSON.stringify(data);
        cc.sys.localStorage(key, jsondata);
    }

    /**
     * 获取存储在本地的数据
     */
    getLocalData ( key:string ) {
        var data = cc.sys.localStorage.getItem(key);
        if (!data) {
            return null;
        }
        data = JSON.parse(data);
        return data;
    }

    /**
     * 把 node1 移动到 node2的位置
     */
    moveN1toN2(node1: cc.Node, node2: cc.Node) {
        node1.position = node1.parent.convertToNodeSpaceAR(node2.parent.convertToWorldSpaceAR(node2.position))
    }
    
    /**
     * 获取把 node1移动到 node2位置后的坐标
     */
    convertNodeSpaceAR(node1: cc.Node, node2: cc.Node) : any {
        return node1.parent.convertToNodeSpaceAR(node2.parent.convertToWorldSpaceAR(node2.position));
    }

    /**
     * 获取固定范围随机数
     */
    getRandom ( m:number, n:number ) {
        return Math.floor(Math.random()*(m - n) + n);
    }


}

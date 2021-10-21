/*
 * @Descripttion: 下载游戏界面
 * @Author: Zhiping Jiang
 * @Information: 564371466@qq.com
 * @Date: 2020-09-06 13:07:12
 * @Belong: Copyright (c) 2020 564371466@qq.com All rights reserved.
 */
//------------------------------------------------------------------------------------
// 外部引入
import { AppConfig } from "./AppConfig";
import BundleManager from "./core/manager/BundleManager";
import LogManager from "./core/manager/LogManager";
import { LbbwzConfigRes, bundleCfg } from "./lbbwz/LbbwzConfig";
import ToolUtils from "./core/utils/ToolUtils";
import AdvertManager from "./core/manager/WxMinManager";
import WxMinManager from "./core/manager/WxMinManager";

//------------------------------------------------------------------------------------

const {ccclass, property} = cc._decorator;

@ccclass
export default class LoadingScene extends cc.Component {

    _loadText : cc.Node = null;

    _curLoadCount : number = 0;
    
    start () {
        console.log("AppConfig.bundleUrl : ", AppConfig.bundleUrl);

        console.log("this.node : ", this.node);
        this._loadText = ToolUtils.getInstance().getNodeByName(this.node, "loadtext");
        console.log("this._loadText : ", this._loadText);

        let req = new XMLHttpRequest();
        req.open("GET", AppConfig.bundleUrl + "/bundle.json", true);
        req.onreadystatechange = () => {
            console.log("req.readyState : ", req.readyState);
            console.log("req.status : ", req.status);
            if (req.readyState === 4 && (req.status >= 200 && req.status < 400)) {
                console.log("req.responseText : ", req.responseText);
                let json = JSON.parse(req.responseText);
                let g_version = "";
                if (json.whiteUpSwitch) {
                    console.log("已发布游戏白名单版本 : ", json.testVersion);
                    let isNotPlayer = false;
                    if (isNotPlayer) {
                        g_version = json.testVersion;
                    } else {
                        g_version = json.version;
                    }
                } else {
                    g_version = json.version;
                }
                console.log("正在加载资源 : ", g_version);
                console.log(LbbwzConfigRes.length);
                this._loadText.getComponent(cc.Label).string = this._curLoadCount + "/" + LbbwzConfigRes.length;
                this.loadGameResources(g_version, json);
            }
        };
        req.send();
    }

    /**
     * 加载线上游戏资源(src/res)
     */
    loadGameResources ( version:string, json:any ) {
        LogManager.getInstance().log(AppConfig.bundleUrl + "/" + version + "/" + json.res);
        cc.assetManager.loadBundle(AppConfig.bundleUrl + "/" + version + "/" + json.res, {onFileProgress: (resData:any) => { cc.log("onFileProgress : ", resData); }}, (err:any, bundle:cc.AssetManager.Bundle) => {
            if (err) {
                return console.log("[DownloadGameView] load bundle res faild.");
            } else {
                console.log("[DownloadGameView] load bundle res success.");
                BundleManager.getInstance().saveBundleByName(bundle, json.res);
                BundleManager.getInstance().cacheBundleResources(json.res, LbbwzConfigRes, () => {
                    this._curLoadCount += 1;
                    LogManager.getInstance().log("this._curLoadCount : " + this._curLoadCount);
                    this._loadText.getComponent(cc.Label).string = this._curLoadCount + "/" + LbbwzConfigRes.length;
                    if (this._curLoadCount === LbbwzConfigRes.length) {
                        // cc.director.loadScene("LuoBoBwz");
                        WxMinManager.getInstance().shareAppMsg( "主动唤起", 2, {ket : 123});  
                    }
                });
            }
        });
    }
}

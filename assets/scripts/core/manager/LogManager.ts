import { AppConfig } from "../../AppConfig";

/*
 * @Descripttion: 输出日志管理类(根据AppConfig中配置平台)
 * @Author: Zhiping Jiang
 * @Information: 564371466@qq.com
 * @Date: 2020-12-21 23:33:56
 * @Belong: Copyright (c) 2020 564371466@qq.com All rights reserved.
 */

const {ccclass, property} = cc._decorator;

@ccclass
export default class LogManager {

    private static _ins : LogManager = null;

    static getInstance () : LogManager {
        if (!this._ins) {
            this._ins = new LogManager();
        }
        return this._ins;
    }

    log ( obj:any ) {
        if (AppConfig.platform === 1) {
            console.log(obj);
        }
    }
    
}

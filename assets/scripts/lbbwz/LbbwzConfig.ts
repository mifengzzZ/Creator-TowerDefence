/*
 * @Descripttion: 萝卜保卫战配置表(怪物、武器、关卡等)
 * @Author: Zhiping Jiang
 * @Information: 564371466@qq.com
 * @Date: 2020-12-14 20:46:46
 * @Belong: Copyright (c) 2020 564371466@qq.com All rights reserved.
 */

/**
 * 横：0
 * 竖：1
 */
const LbbwzConfigGK = {
    map1 : {
        // 恶魔牌
        zhanpai : { x : -360.232, y : 229.922 },
        // 主角
        luobo : { x : 371, y : 233.945 },
        // 箭头
        startAnimPoint : { x : -358.449, y : 119.948, rotation : 270 },
        // 敌人移动位置
        enemyMovePos : [
            {x:-361.728, y:194.919}, {x:-361.728, y:-10, hs : 1}, {x:-120.805, y:-10, hs : 0}, {x:-120.805, y:70, hs : 1},
            {x:117.756, y:70, hs : 0}, {x:117.756, y:-13.014, hs : 1}, {x:358.679, y:-13.014, hs : 0}, {x:358.679, y:178.384, hs : 1}
        ],
        // 添加炮塔位置
        point : [
            { x : -434, y : 192, interval : 86, hs : 1, count : 4 },
            { x : -41, y : -37, interval : 84, hs : 0, count : 2 },
            { x : -283.57, y : 192, interval : 78, hs : 1, count : 3 },
            { x : -200, y : 36, interval : 0, hs : 0, count : 1 },
            { x : -122.604, y : 116.698, interval : 82, hs : 0, count : 4 },
            { x : 195, y : 36, interval : 0, hs : 0, count : 1 },
            { x : 289, y : 122, interval : 86, hs : 1, count : 2 },
            { x : 435.094, y : 122, interval : 83, hs : 1, count : 3 },
            { x : -332, y : -118, interval : 83, hs : 0, count : 9 },
            { x : -174, y : -200, interval : 89, hs : 0, count : 5 },
        ],
        // 可用武器
        arms : [ 
            { type : "rLbbwz_arms_plist_1", name : "Bottle" }
        ],

        // 怪物
        enemy : [
            { name : "rLbbwz_md1_map1_item1", lv : 30 }
        ]
    }
};

/**
 * Bundle资源根目录名称
 */
const bundleCfg = {
    bwlb : "rLbbwz"   
};

/**
 * Bundle 远程资源
 */
const LbbwzConfigRes = [

    {"rLbbwz_menu" : { path:"rLbbwz_menu", ex:cc.SpriteAtlas } },
    {"rLbbwz_items" : { path:"rLbbwz_theme1/items/rLbbwz_items", ex:cc.SpriteAtlas } },
    {"rLbbwz_luobo_plist" : { path:"rLbbwz_luobo", ex:cc.SpriteAtlas } },
    {"rLbbwz_arms_plist_1" : { path:"rLbbwz_towers/rLbbwz_bottle", ex:cc.SpriteAtlas } },


    {"rLbbwz_luobo" : { path:"rLbbwz_prefab/rLbbwz_luobo", ex:cc.Prefab } },
    {"rLbbwz_jiantouAnim" : { path:"rLbbwz_prefab/rLbbwz_jiantouAnim", ex:cc.Prefab } },
    {"rLbbwz_xuanzhuan" : { path:"rLbbwz_prefab/rLbbwz_xuanzhuan", ex:cc.Prefab } },
    {"rLbbwz_jishistart" : { path:"rLbbwz_prefab/rLbbwz_jishistart", ex:cc.Prefab } },
    {"rLbbwz_addPt" : { path:"rLbbwz_prefab/rLbbwz_addPt", ex:cc.Prefab } },
    {"rLbbwz_buttle" : { path:"rLbbwz_prefab/rLbbwz_buttle", ex:cc.Prefab } },
    {"rLbbwz_paota" : { path:"rLbbwz_prefab/rLbbwz_paota", ex:cc.Prefab } },

    {"rLbbwz_enemyDeth" : { path:"rLbbwz_prefab/rLbbwz_enemyDeth", ex:cc.Prefab } },
    {"rLbbwz_addGold" : { path:"rLbbwz_prefab/rLbbwz_addGold", ex:cc.Prefab } },
    {"rLbbwz_selectWupin" : { path:"rLbbwz_prefab/rLbbwz_selectWupin", ex:cc.Prefab } },
    {"rLbbwz_md1_map1_item1" : { path:"rLbbwz_prefab/rLbbwz_items/rLbbwz_mode1/rLbbwz_map1/rLbbwz_md1_map1_item1", ex:cc.Prefab } },

// 子弹声音
    {"rLbbwz_sound_Bottle" : { path:"rLbbwz_sound/rLbbwz_sound_Bottle", ex:cc.AudioClip } },

// 怪物死亡声
    {"rLbbwz_sound_Fat241" : { path:"rLbbwz_sound/rLbbwz_sound_Fat241", ex:cc.AudioClip } },
    {"rLbbwz_sound_Fat242" : { path:"rLbbwz_sound/rLbbwz_sound_Fat242", ex:cc.AudioClip } },
    {"rLbbwz_sound_Fat243" : { path:"rLbbwz_sound/rLbbwz_sound_Fat243", ex:cc.AudioClip } },

// 倒计时
    {"rLbbwz_sound_CountDown" : { path:"rLbbwz_sound/rLbbwz_sound_CountDown", ex:cc.AudioClip } },
    {"rLbbwz_sound_GO" : { path:"rLbbwz_sound/rLbbwz_sound_GO", ex:cc.AudioClip } },

];

 export {LbbwzConfigGK, LbbwzConfigRes, bundleCfg};
/*
**加载显示数据2015-9-6 shenwei
*/

//本地
LoadingLocalEvent = {};
//更新进度
LoadingLocalEvent.LOADING_PROGRESS = "loading_progress";
//热更新开始
LoadingLocalEvent.ASSETS_MANAGER_LOADED_BEGIN = "assets_manager_loaded_begin";
//热更新失败
LoadingLocalEvent.ASSETS_MANAGER_LOADED_ERROR = "assets_manager_loaded_error";
//热更新完毕
LoadingLocalEvent.ASSETS_MANAGER_LOADED_END = "assets_manager_loaded_end";
//配置表读取完毕
LoadingLocalEvent.CONFIG_TABLE_LOADED_END = "config_table_loaded_end";
//新用户头像选择
LoadingLocalEvent.MOD_CUSTOM_PORTRAIT = "mod_custom_portrait";
//系统通知选图片完成
LoadingLocalEvent.USER_CHOOSE_IMG_FROM_JAVA = "user_choose_img_from_java";

//网络
LoadingNetEvent = {};

var LoadingData = DataBase.extend({

    _shownTipId : null,
    _shownTip : null,
    _waitingTips : null,

    ctor : function()
    {
        this._super();

        this._waitingTips = [];
    },

    getWaitingTips : function()
    {
        return this._waitingTips;
    },

    getNextTip : function()
    {
        this._shownTipId = (++this._shownTipId) >= this._waitingTips.length ? 0 : this._shownTipId;
        return this._waitingTips[this._shownTipId];
    },

    serverConnectedFailedTip : function()
    {
        ModuleMgr.inst().openModule("AlertPanel", {"txt":"服务器正在更新维护，请稍后再来", "type":2, "okFun":function(){cc.director.end()}});
    },

    init : function()
    {
        this._super();

        this._waitingTips.push({"up":"派克帝国1", "down":"你的帝国1"});
        this._waitingTips.push({"up":"派克帝国2", "down":"你的帝国2"});
        this._waitingTips.push({"up":"派克帝国3", "down":"你的帝国3"});

        this._shownTipId = -1;
        this._shownTip = this._waitingTips[this._shownTipId];
    },

    clean : function()
    {
        this._shownTipId = null;
        this._shownTip = null;
        this._waitingTips = null;
    },

    destroy : function()
    {
        this._super();
        this.clean();
    }
});
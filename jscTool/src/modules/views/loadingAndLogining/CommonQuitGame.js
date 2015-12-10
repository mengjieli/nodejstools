/*
**统一退出 2015-9-15 shenwei
*/
var CommonQuitGame = cc.Class.extend({

    ctor : function(owner)
    {
        var _me = this;
        if(cc.sys.os == cc.sys.OS_ANDROID)
        {
            cc.eventManager.addListener({
                event: cc.EventListener.KEYBOARD,
                onKeyReleased: function(keyCode, event)
                {
                    if (keyCode == cc.KEY.back)
                    {
                        var value = ResMgr.inst().getString("denglu_9");
                        ModuleMgr.inst().openModule("AlertPanel", {"txt":value, "okFun":_me.forceQuitGame, "owner":_me});
                    }
                }
                }, owner);
        }
    },

    forceQuitGame : function()
    {
        cc.error("结束当前游戏");
        cc.director.end();
    },

    destroy : function()
    {
        cc.eventManager.removeListeners(cc.EventListener.KEYBOARD);
    }
});
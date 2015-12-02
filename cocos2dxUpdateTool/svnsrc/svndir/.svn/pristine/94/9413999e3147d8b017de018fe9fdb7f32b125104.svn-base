/**
 * Created by cgMu on 2015/11/11.
 */

var GameOverModule = ModuleBase.extend({
    ctor:function() {
        this._super();

        SelfData.instance = null;//注销游戏，清空数据
    },

    initUI:function() {

    },

    show:function( data ) {
        //this.deleteCache();
        //ModuleMgr.inst().removeAllModule();
        //ModuleMgr.inst().removeAllData();
        //ModuleMgr.inst().openModule("Logining", {"data":null, "openSound":true});
        GameMgr.inst().gameOver();
        var auto = true;
        GameMgr.inst().startGame(auto);
    },

    close:function() {

    },

    destroy:function() {

    },

    //deleteCache: function () {
    //    var storagePath = jsb.fileUtils ? jsb.fileUtils.getWritablePath() : "./";
    //    var fileExist = jsb.fileUtils.isFileExist(storagePath + LoginingModule.LOGIN_HISTORY_INI);
    //    cc.error("文件存在标识:" + storagePath);
    //    if(fileExist) {
    //        var tag = jsb.fileUtils.removeFile(storagePath + LoginingModule.LOGIN_HISTORY_INI);
    //        if(tag) {
    //            cc.log("******** success");
    //        }
    //        else {
    //            cc.log("fail ********");
    //        }
    //    }
    //}

});
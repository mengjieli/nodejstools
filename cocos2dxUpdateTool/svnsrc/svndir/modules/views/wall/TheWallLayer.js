/**
 * Created by cgMu on 2015/10/26.
 */

var TheWallLayer = ModuleBase.extend({
    objectId:null,
    ctor:function() {
        this._super();

        this.objectId = 1907001;
    },

    initUI:function() {
        var json = ccs.load("res/images/ui/TheWall/TheWallLayer.json","res/images/ui/");
        var root = json.node;
        this.addChild(root);

        var name = root.getChildByName("Text_1");
        name.setString(ResMgr.inst().getString(this.objectId + "0"));

        var icon = root.getChildByName("Sprite_2");
        icon.setTexture(ResMgr.inst()._icoPath + this.objectId + "0.png");

        var level = root.getChildByName("Text_5");
        level.setString(ResMgr.inst().getString("xiangqing_1") + " 10");

        var loadingBar = root.getChildByName("LoadingBar_2");
        loadingBar.setPercent(50);

        var description = root.getChildByName("Text_2_0");
        description.setString(ResMgr.inst().getString("chengqiang_5"));

        var fixDes = root.getChildByName("Text_11");
        fixDes.setString(ResMgr.inst().getString("chengqiang_3")+100+ResMgr.inst().getString("chengqiang_4"));

        var label4 = root.getChildByName("Text_4");
        label4.setString(ResMgr.inst().getString("chengqiang_1"));


        var shuoming = root.getChildByName("Image_1");
        shuoming.setTouchEnabled(true);
        shuoming.addTouchEventListener(this.shuomingCallback, this);

        var text = root.getChildByName("Text_2");
        text.setString(ResMgr.inst().getString(this.objectId + "1"));

        var label9 = root.getChildByName("Text_9");
        label9.setString(ResMgr.inst().getString("chengqiang_2"));

        var cd = root.getChildByName("Text_10");
        cd.ignoreContentAdaptWithSize(true);
        //cd.setString(0);
        this._cd = cd;
        this.index = 3678;

        //var time = parseInt(new Date().getTime()/1000);
        cd.setString(this.getDateFormate(this.index));

        //var date = new Date().getHours();
        //cd.setString(date);
        //cc.log("month ", date);

        this.schedule(this.scheduleCallback,1);

    },

    scheduleCallback: function (ft) {
        this.index--;
        if (this.index<0) {
            this.unschedule(this.scheduleCallback);
            return;
        }
        var time = this.getDateFormate(this.index);
        this._cd.setString(time);
    },

    destroy:function()
    {
        this._super();
        this.unschedule(this.scheduleCallback);
    },

    show:function( data )
    {

    },

    close:function()
    {

    },

    shuomingCallback: function (sender, type) {
        if (type == ccui.Widget.TOUCH_ENDED) {
            cc.log("shuomingCallback");
        }
    },

    //00:00:00
    getDateFormate: function (time) {
        var seconds = 0;
        var minutes = 0;
        var hours = 0;

        hours = parseInt(time / 3600);
        var data = time % 3600;
        minutes = parseInt(data / 60);
        data = data % 60;
        seconds = data;

        var pad = function (num, n) {
            n=2;
            return (Array(n).join(0) + num).slice(-n);//Array(n > num ? (n - ('' + num).length + 1) : 0).join(0) + num;
        };

        //cc.log(""+hours,"小时", minutes,"分钟",seconds,"秒");
        return pad(hours)+":"+pad(minutes)+":"+pad(seconds);
    }
});
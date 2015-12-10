/**
 * Created by cgMu on 2015/10/27.
 */

var CollegeLevelCancelLayer = cc.Node.extend({
    ctor: function (techdata,time) {
        this._super();

        EventMgr.inst().addEventListener(CastleEvent.UPDATE_TECH_TIME, this.netUpdateTechTime, this);

        this.techId = techdata;
        this._needResources = [];

        this.techLevel = ModuleMgr.inst().getData("CollegeModule").getTechLevel(this.techId);
        var tech_data =ModuleMgr.inst().getData("ConfigTableUpdator").getConfigTableValueByKey("City_College_tech","["+this.techId+","+this.techLevel+"]");

        //var ddd = ModuleMgr.inst().getData("CastleModule").getNetTech()[this.techId];
        cc.log("科技剩余时间 毫秒",ModuleMgr.inst().getData("CollegeModule").remainTime);
        this._time =time;// ModuleMgr.inst().getData("CollegeModule").remainTime;

        var resdata = eval("(" + tech_data.need_resource + ")");
        for(var i in resdata) {
            var temp = {};
            temp.key = i;
            temp.value = resdata[i];
            this._needResources.push(temp);
        }

        cc.log("取消升级 科技ID",this.techId);

        var colorbg = new cc.LayerColor(cc.color(0, 0, 0, 255*0.8));
        this.addChild(colorbg);

        var json = ccs.load("res/images/ui/College/College_Skill_CancelLayer.json","res/images/ui/");
        var root_ = json.node;
        this.addChild(root_);

        var root = root_.getChildByName("Panel_2");
        //适配
        var size = cc.director.getVisibleSize();
        root_.setContentSize(size);
        ccui.helper.doLayout(root_);

        var down = GameMgr.inst().frameSize.height - GameMgr.inst().scaleViewSize.height;
        down = down * (1/GameMgr.inst().scaleX);

        var posY = root.getPositionY();
        posY += down;
        root.setPositionY( posY );

        this._root = root;

        var title = root.getChildByName("Text_1");
        title.ignoreContentAdaptWithSize(true);
        title.setString(ResMgr.inst().getString("college_11"));

        var label1 = root.getChildByName("Text_3");
        label1.ignoreContentAdaptWithSize(true);
        label1.setString(ResMgr.inst().getString("college_7"));

        var skillname = root.getChildByName("Text_6");
        skillname.ignoreContentAdaptWithSize(true);
        skillname.setString(ResMgr.inst().getString(this.techId+"0"))

        var label2 = root.getChildByName("Text_3_0");
        label2.ignoreContentAdaptWithSize(true);
        label2.setString(ResMgr.inst().getString("college_12"));

        var label3 = root.getChildByName("Text_3_0_0");
        label3.ignoreContentAdaptWithSize(true);
        label3.setString(ResMgr.inst().getString("college_13"));

        var timelabel = root.getChildByName("Text_11");
        timelabel.ignoreContentAdaptWithSize(true);
        timelabel.setString(StringUtils.formatTimer(this._time*1000));

        var iconbg = root.getChildByName("gy_wupingkuang_01_3");
        var icon = iconbg.getChildByName("Sprite_4");
        //icon.ignoreContentAdaptWithSize(true);
        icon.setScale(0.35);
        icon.setTexture(ResMgr.inst()._icoPath+this.techId+"0.png");

        var buttonTile = ccui.helper.seekWidgetByName(root,"Text_9");
        buttonTile.ignoreContentAdaptWithSize(true);
        buttonTile.setString(ResMgr.inst().getString("college_14"));
        var buttonTile2 = ccui.helper.seekWidgetByName(root,"Text_9_0");
        buttonTile2.ignoreContentAdaptWithSize(true);
        buttonTile2.setString(ResMgr.inst().getString("college_15"));

        var btnleft = ccui.helper.seekWidgetByName(root,"Button_2");
        btnleft.addTouchEventListener(this.btnCallback,this);

        var btnright = ccui.helper.seekWidgetByName(root,"Button_2_0");
        btnright.addTouchEventListener(this.btnCallback2,this);

        var skilldes = root.getChildByName("Text_14");
        skilldes.ignoreContentAdaptWithSize(true);
        skilldes.setString(ResMgr.inst().getString(this.techId+"1"));

        var label4 = root.getChildByName("Text_8");
        label4.ignoreContentAdaptWithSize(true);
        label4.setString("10%");

        var closeButton = ccui.helper.seekWidgetByName(root, "Button_1");
        closeButton.addTouchEventListener(this.touchCallback,this);

        //this.schedule(this.scheduleCallback,1);
    },

    touchCallback: function (sender,type) {
        switch (type) {
            case ccui.Widget.TOUCH_BEGAN:
                break;
            case ccui.Widget.TOUCH_MOVED:
                break;
            case ccui.Widget.TOUCH_ENDED:
                this.removeFromParent(true);
                break;
            case ccui.Widget.TOUCH_CANCELED:
                break;
            default:
                break;
        }
    },

    //scheduleCallback: function (ft) {
    //    cc.log("科技剩余时间 毫秒",ModuleMgr.inst().getData("CollegeModule").remainTime);
    //    this._time = ModuleMgr.inst().getData("CollegeModule").remainTime;
    //    if (this._time==0) {
    //        this.unschedule(this.scheduleCallback);
    //        this.removeFromParent(true);
    //        return;
    //    }
    //    var timelabel = this._root.getChildByName("Text_11");
    //    timelabel.ignoreContentAdaptWithSize(true);
    //    timelabel.setString(StringUtils.formatTimer(this._time*1000));
    //},

    btnCallback: function (sender,type) {
        if(type == ccui.Widget.TOUCH_ENDED) {
            this.removeFromParent(true);
        }
    },

    btnCallback2: function (sender,type) {
        if(type == ccui.Widget.TOUCH_ENDED) {//CastleEvent.TECH_CANCEL_SUCCESS
            EventMgr.inst().dispatchEvent(CastleEvent.TECH_CANCEL_SUCCESS, this.techId);//取消升级科技
            this.removeFromParent(true);
        }
    },

    onExit:function() {
        EventMgr.inst().removeEventListener(CastleEvent.UPDATE_TECH_TIME, this.netUpdateTechTime, this);
    },

    netUpdateTechTime: function (type, netTech) {
        var timelabel = this._root.getChildByName("Text_11");
        timelabel.ignoreContentAdaptWithSize(true);
        timelabel.setString(StringUtils.formatTimer(netTech._state_remain));
        if (netTech._state_remain==0) {
            this.removeFromParent(true);
        }
    }
});
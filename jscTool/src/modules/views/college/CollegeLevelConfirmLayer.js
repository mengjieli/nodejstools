/**
 * Created by cgMu on 2015/10/27.
 */

var CollegeLevelConfirmLayer = cc.Node.extend({
    ctor: function (techdata,isupdate) {
        this._super();

        var can = true;

        this.techId = techdata;
        this._needResources = [];

        this.techLevel = ModuleMgr.inst().getData("CollegeModule").getTechLevel(this.techId);
        var nextLevel = this.techLevel+1;

        //当前等级科技数据
        var info = 0;
        if (this.techLevel==0) {
            info=0
        }
        else {
            var tech_data_ex = ModuleMgr.inst().getData("ConfigTableUpdator").getConfigTableValueByKey("City_College_tech","["+this.techId+","+this.techLevel+"]");
                //ResMgr.inst().getJSON("City_College_tech",""+this.techId+this.techLevel,true);
            cc.log("tech_data_ex",tech_data_ex.tech_effect);
            var jsondata = eval("(" + tech_data_ex.tech_effect + ")");
            for(var k in jsondata) {
                cc.log("jsondata"+k);
                info = jsondata[k];
            }
        }


        cc.log("***",this.techId,this.techLevel);

        var tech_data = ModuleMgr.inst().getData("ConfigTableUpdator").getConfigTableValueByKey("City_College_tech","["+this.techId+","+nextLevel+"]");
            //ResMgr.inst().getJSON("City_College_tech",""+this.techId+nextLevel,true);
        var resdata = eval("(" + tech_data.need_resource + ")");//tech_data.need_resource;//techdata.Need_Resource;
        for(var i in resdata) {
            var temp = {};
            temp.key = i;
            temp.value = resdata[i];
            this._needResources.push(temp);
        }

        cc.log("***",this.techId,nextLevel);

        var info_next = 0;
        var sjsondata = eval("(" + tech_data.tech_effect + ")");
        for(var i in sjsondata) {
            info_next = sjsondata[i];
        }

        var colorbg = new cc.LayerColor(cc.color(0, 0, 0, 255*0.8));
        this.addChild(colorbg);

        var resData = ModuleMgr.inst().getData("CastleModule").getNetResource();

        var json = ccs.load("res/images/ui/College/College_Skill_LevelUp.json","res/images/ui/");
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

        var iconbg = root.getChildByName("gy_wupingkuang_01_3");
        var icon = iconbg.getChildByName("Sprite_4");
        //icon.ignoreContentAdaptWithSize(true);
        icon.setScale(0.35);
        icon.setTexture(ResMgr.inst()._icoPath+this.techId+"0.png");

        var title = root.getChildByName("Text_1");
        title.ignoreContentAdaptWithSize(true);
        title.setString(ResMgr.inst().getString("college_6"));

        var level = root.getChildByName("Text_2");
        level.ignoreContentAdaptWithSize(true);
        level.setString(this.techLevel);

        var name = root.getChildByName("Text_6");
        name.ignoreContentAdaptWithSize(true);
        name.setString(ResMgr.inst().getString(this.techId+"0"));

        var label1 = root.getChildByName("Text_3");
        label1.ignoreContentAdaptWithSize(true);
        label1.setString(ResMgr.inst().getString("college_7"));

        var label2 = root.getChildByName("Text_3_0");
        label2.ignoreContentAdaptWithSize(true);
        label2.setString(ResMgr.inst().getString("college_8"));

        var label3 = root.getChildByName("Text_3_0_0");
        label3.ignoreContentAdaptWithSize(true);
        label3.setString(ResMgr.inst().getString("college_9"));

        var buttonTile = ccui.helper.seekWidgetByName(root,"Text_12");
        buttonTile.ignoreContentAdaptWithSize(true);
        buttonTile.setString(ResMgr.inst().getString("college_10"));

        var icon1 = root.getChildByName("gy_dengji_di_6");
        icon1.setTexture(ResMgr.inst()._icoPath + this._needResources[0].key +"0.png");

        var iconLabel1 = root.getChildByName("Text_7");
        iconLabel1.ignoreContentAdaptWithSize(true);
        iconLabel1.setString(this._needResources[0].value);
        if (parseInt(this._needResources[0]["value"]) > parseInt(resData[this._needResources[0].key])) {
            iconLabel1.setColor(cc.color(255,0,0));
            can = false;
        }

        var icon2 = root.getChildByName("gy_dengji_di_6_0");
        icon2.setTexture(ResMgr.inst()._icoPath + this._needResources[1].key +"0.png");

        var iconLabel2 = root.getChildByName("Text_7_0");
        iconLabel2.ignoreContentAdaptWithSize(true);
        iconLabel2.setString(this._needResources[1].value);
        if (parseInt(this._needResources[1]["value"]) > parseInt(resData[this._needResources[1].key])) {
            iconLabel2.setColor(cc.color(255,0,0));
            can = false;
        }
        //iconLabel2.setColor(cc.color(255,0,0));

        var icon3 = root.getChildByName("gy_dengji_di_6_1");
        icon3.setTexture(ResMgr.inst()._icoPath + this._needResources[2].key +"0.png");

        var iconLabel3 = root.getChildByName("Text_7_1");
        iconLabel3.ignoreContentAdaptWithSize(true);
        iconLabel3.setString(this._needResources[2].value);
        if (parseInt(this._needResources[2]["value"]) > parseInt(resData[this._needResources[2].key])) {
            iconLabel3.setColor(cc.color(255,0,0));
            can = false;
        }

        var text3 = root.getChildByName("Text_7_2");
        text3.ignoreContentAdaptWithSize(true);
        text3.setString(info+"%");

        var text4 = root.getChildByName("Text_7_3");
        text4.ignoreContentAdaptWithSize(true);
        text4.setPositionX(text4.getPositionX()+20);
        text4.setString("+"+(info_next - info)+"%");
        cc.log("***",info,info_next)

        var skilldes = root.getChildByName("Text_14");
        skilldes.ignoreContentAdaptWithSize(true);
        skilldes.setString(ResMgr.inst().getString(this.techId+"1"));

        var closeButton = ccui.helper.seekWidgetByName(root, "Button_1");
        closeButton.addTouchEventListener(this.touchCallback,this);

        var time = tech_data.levelup_time;
        var cd = root.getChildByName("Text_13");
        cd.ignoreContentAdaptWithSize(true);
        cd.setString(StringUtils.formatTimer(time*60*1000));

        var need = eval("(" + tech_data.need + ")");
        for (var i in need) {
            //可能有多个
            var blockData = ModuleMgr.inst().getData("CastleModule").getNetBlockByBuildingId(i);
            //cc.log("need",key,"当前等级",blockData._building_id,blockData._building_level);
            var nowLevel = blockData[0]._building_level;
            cc.log("id",i,"nowlevel",nowLevel,"needlevel",need[i]);
            if (nowLevel<need[i]) {
                can = false;
            }
        }

        var confirmbtn = ccui.helper.seekWidgetByName(root,"Button_2");
        confirmbtn.addTouchEventListener(this.confirmbtnCallback,this);
        if(isupdate || !can) {
            confirmbtn.setBright(false);
            confirmbtn.setTouchEnabled(false);
        }
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

    confirmbtnCallback: function (sender, type) {
        if(type==ccui.Widget.TOUCH_ENDED) {
            EventMgr.inst().dispatchEvent(CastleEvent.TECH_UPGRADE_SUCCESS, this.techId);//升级科技
            this.removeFromParent(true);
        }
    }
});
/**
 * Created by cgMu on 2015/10/27.
 */

var CollegeModule = ModuleBase.extend({
    yeqianVector:[],
    titleVector:[],
    shuolianVector:[],

    selectingTag:1,//页签tag 【科技种类】
    selecttingTech:null,//当前正在升级的科技数据

    barTotalHeight:0,
    barPercent_total:0,
    isOnePage:false,

    itemMap:null,
    root:null,
    scrol:null,

    _id:0,
    _index:0,
    collegeLevel:0, //学院等级

    isUpdate:false, //标识当前正在升级的科技
    updateTechData:null,

    ctor:function() {
        this._super();

        cc.log("CollegeModule","ctor");

        this.itemMap = [];

        var data = ModuleMgr.inst().getData("CollegeModule");

        EventMgr.inst().addEventListener(CastleEvent.NET_COMPLETE, this.netCallback, this);
        EventMgr.inst().addEventListener(CastleEvent.TECH_UPGRADE_COMPLETE, this.eventCallback, this);
        EventMgr.inst().addEventListener(CastleEvent.UPDATE_TECH_TIME, this.netUpdateTechTime, this);

        this._data=[];
        this._data[0]=data._techData[0];
        this._data[1]=data._techData[1];
        this._data[2]=data._techData[2];
        this._data[3]=data._techData[3];
    },

    initUI:function() {

        var colorbg = new cc.LayerColor(cc.color(0, 0, 0, 255*0.8));
        this.addChild(colorbg);

        var json = ccs.load("res/images/ui/College/CollegeLayer.json","res/images/ui/");
        var root_ = json.node;
        this.addChild(root_);

        //适配
        var size = cc.director.getVisibleSize();
        root_.setContentSize(size);
        ccui.helper.doLayout(root_);

        var down = GameMgr.inst().frameSize.height - GameMgr.inst().scaleViewSize.height;
        down = down * (1/GameMgr.inst().scaleX);

        var root = root_.getChildByName("Panel_1");
        var size = root.getContentSize();
        size.height += down;
        root.setContentSize( size );
        this.root = root;

        //页签
        var xy_shuolian_1 = root.getChildByName("xy_shuolian_1");
        var posY = xy_shuolian_1.getPositionY();
        posY += down;
        xy_shuolian_1.setPositionY( posY );
        //xy_shuolian_1.setVisible(false);
        this.shuolianVector[0]=xy_shuolian_1;
        var xy_shuolian_2 = root.getChildByName("xy_shuolian_2");
        var posY = xy_shuolian_2.getPositionY();
        posY += down;
        xy_shuolian_2.setPositionY( posY );
        //xy_shuolian_2.setVisible(false);
        this.shuolianVector[1]=xy_shuolian_2;
        var xy_shuolian_3 = root.getChildByName("xy_shuolian_3");
        var posY = xy_shuolian_3.getPositionY();
        posY += down;
        xy_shuolian_3.setPositionY( posY );
        //xy_shuolian_3.setVisible(false);
        this.shuolianVector[2]=xy_shuolian_3;
        var xy_shuolian_4 = root.getChildByName("xy_shuolian_3_0");
        var posY = xy_shuolian_4.getPositionY();
        posY += down;
        xy_shuolian_4.setPositionY( posY );
        //xy_shuolian_4.setVisible(false);
        this.shuolianVector[3]=xy_shuolian_4;

        var yeqian1 = root.getChildByName("yeqian1");
        yeqian1.ignoreContentAdaptWithSize(true);
        yeqian1.setTag(1);
        var posY = yeqian1.getPositionY();
        posY += down;
        yeqian1.setPositionY( posY );
        yeqian1.setTouchEnabled(true);
        yeqian1.addTouchEventListener(this.yeqianCallback,this);
        this.yeqianVector[0]=yeqian1;

        var title1 = root.getChildByName("Text_12");
        var posY = title1.getPositionY();
        posY += down;
        title1.setPositionY( posY );
        title1.ignoreContentAdaptWithSize(true);
        title1.setString(ResMgr.inst().getString("college_2"));
        this.titleVector[0]=title1;

        var yeqian2 = root.getChildByName("yeqian2");
        yeqian2.ignoreContentAdaptWithSize(true);
        yeqian2.setTag(2);
        var posY = yeqian2.getPositionY();
        posY += down;
        yeqian2.setPositionY( posY );
        yeqian2.setTouchEnabled(true);
        yeqian2.addTouchEventListener(this.yeqianCallback,this);
        this.yeqianVector[1]=yeqian2;

        var title2 = root.getChildByName("Text_13");
        title2.ignoreContentAdaptWithSize(true);
        var posY = title2.getPositionY();
        posY += down;
        title2.setPositionY( posY );
        title2.setString(ResMgr.inst().getString("college_3"));
        this.titleVector[1]=title2;

        var yeqian3 = root.getChildByName("yeqian3");
        yeqian3.ignoreContentAdaptWithSize(true);
        yeqian3.setTag(3);
        var posY = yeqian3.getPositionY();
        posY += down;
        yeqian3.setPositionY( posY );
        yeqian3.setTouchEnabled(true);
        yeqian3.addTouchEventListener(this.yeqianCallback,this);
        this.yeqianVector[2]=yeqian3;

        var title3 = root.getChildByName("Text_14");
        title3.ignoreContentAdaptWithSize(true);
        var posY = title3.getPositionY();
        posY += down;
        title3.setPositionY( posY );
        title3.setString(ResMgr.inst().getString("college_4"));
        this.titleVector[2]=title3;

        var yeqian4 = root.getChildByName("yeqian4");
        yeqian4.ignoreContentAdaptWithSize(true);
        yeqian4.setTag(4);
        var posY = yeqian4.getPositionY();
        posY += down;
        yeqian4.setPositionY( posY );
        yeqian4.setTouchEnabled(true);
        yeqian4.addTouchEventListener(this.yeqianCallback,this);
        this.yeqianVector[3]=yeqian4;

        var title4 = root.getChildByName("Text_15");
        title4.ignoreContentAdaptWithSize(true);
        var posY = title4.getPositionY();
        posY += down;
        title4.setPositionY( posY );
        title4.setString(ResMgr.inst().getString("college_5"));
        this.titleVector[3]=title4;

        var Image_1 = root.getChildByName("Image_1");
        var size = Image_1.getContentSize();
        size.height += down/2;
        Image_1.setContentSize( size );

        var Image_1_0 = root.getChildByName("Image_1_0");
        var size = Image_1_0.getContentSize();
        size.height += down/2;
        Image_1_0.setContentSize( size );

        var scrollview = root.getChildByName("ScrollView_1");
        var size = scrollview.getContentSize();
        size.height += down;
        scrollview.setContentSize( size );

        scrollview.addEventListener(this.scrollCall, this );
        var item0 = scrollview.getChildByName("Image_7");
        item0.setVisible(false);
        this.scrol = scrollview;
        this.itemRoot = item0;

        var barBg = root.getChildByName("Image_16");
        var posY = barBg.getPositionY();
        posY += down/2;
        barBg.setPositionY( posY );
        var size = barBg.getContentSize();
        size.height += down;
        barBg.setContentSize( size );

        this.barTotalHeight = barBg.getContentSize().height;

        //cc.log("滑动条 背景长 ", this.barTotalHeight);

        this.scrollbar = root.getChildByName("Image_18");
        var posY = this.scrollbar.getPositionY();
        posY += down;
        this.scrollbar.setPositionY( posY );
        this.scrollPosY = this.scrollbar.getPositionY();

        var bottomPanel = root.getChildByName("Image_6");
        bottomPanel.setVisible(false);

        var button = bottomPanel.getChildByName("Button_4");
        button.addTouchEventListener(this.buttonCallback,this);
        var buttonTitle = button.getChildByName("Text_23");
        buttonTitle.ignoreContentAdaptWithSize(true);
        buttonTitle.setString(ResMgr.inst().getString("dikuai_5"));

        var button_accelerate = bottomPanel.getChildByName("Button_4_0");
        button_accelerate.addTouchEventListener(this.buttonCallback2,this);
        var buttontitle = button_accelerate.getChildByName("Text_23");
        buttontitle.ignoreContentAdaptWithSize(true);
        buttontitle.setString(ResMgr.inst().getString("college_17"));
    },

    scrollCall: function (node, type) {
        switch (type) {
            case ccui.ScrollView.EVENT_SCROLLING:
                //cc.log("EVENT_SCROLLING");
                var pos = this.scrol.getInnerContainer().getPosition();
                var number = this.barPercent_total+pos.y;
                var per = number *100 / this.barPercent_total;
                if (per < 0) {
                    per =0
                }
                if (per > 100) {
                    per =100
                }
                this.refreshScrollbarState(per);
                break;
            case ccui.ScrollView.EVENT_SCROLL_TO_TOP:
                //cc.log("EVENT_SCROLL_TO_TOP");
                this.refreshScrollbarState(0);
                break;
            case ccui.ScrollView.EVENT_SCROLL_TO_BOTTOM:
                //cc.log("EVENT_SCROLL_TO_BOTTOM");
                this.refreshScrollbarState(100);
                break;
            default :
                break;
        }
    },

    yeqianCallback:function(sender,type) {
        if (type == ccui.Widget.TOUCH_ENDED) {
            var tag = sender.getTag();
            cc.log("touch yeqian tag",tag);
            if(this.shuolianVector[tag-1].isVisible()) {
                cc.error("locking");
                ModuleMgr.inst().openModule("AlertString",{str:ResMgr.inst().getString("college_19"),color:null,time:null,pos:null});
                return;
            }

            if(tag != this.selectingTag) {
                this.selectingTag = tag;
                this.refreshYeqianState(tag)
            }
        }
    },

    buttonCallback: function (sender, type) {
        if (type == ccui.Widget.TOUCH_ENDED) {
            cc.log("@@@;;;;;;",this._time);
            var layer = new CollegeLevelCancelLayer(this.selecttingTech,this._time);
            this.addChild(layer);
        }
    },

    buttonCallback2: function (sender, type) {
        if (type == ccui.Widget.TOUCH_ENDED) {
            //ModuleMgr.inst().openModule("AccelerateModule", { id:this.selecttingTech, type:4 } );
            ModuleMgr.inst().openModule("AccelerateModule", { id:null, blockId:null, collegeId:this.selecttingTech,type:4 } );
        }
    },

    destroy:function()
    {
        this.root=null;
        this.itemMap=null;
        this.scrol=null;
        EventMgr.inst().removeEventListener(CastleEvent.NET_COMPLETE, this.netCallback, this);
        EventMgr.inst().removeEventListener(CastleEvent.TECH_UPGRADE_COMPLETE, this.eventCallback, this);
        EventMgr.inst().removeEventListener(CastleEvent.UPDATE_TECH_TIME, this.netUpdateTechTime, this);
    },

    show:function( data )
    {
        this._id = data.id;
        this._index = data.blockId;

        var blockData = ModuleMgr.inst().getData("CastleModule").getNetBlock()[this._index];
        this.collegeLevel = blockData._building_level;

        var building = ModuleMgr.inst().getData("CastleModule").getNetTechByState(CastleData.STATE_UPGRADE);
        //cc.log("正在升级的科技个数 ",building.length,"collegelevel ",this.collegeLevel);
        if (building.length > 0) {
            this.isUpdate = true;
            this.updateTechData = building[0];
        }

        //for (var i in building) {
        //    cc.log("",i,building[i]._castle_id,building[i]._tech_id,building[i]._tech_level);
        //}

        if (this.isUpdate && this.updateTechData) {
            //cc.log("正在升级的科技 ID",this.updateTechData._tech_id,this.updateTechData._tech_level);
            var tech_data = ModuleMgr.inst().getData("ConfigTableUpdator").getConfigTableValueByKey("City_College_tech","["+this.updateTechData._tech_id+","+this.updateTechData._tech_level+"]");//

            this.selectingTag = tech_data.tech_type;
            this.refreshBottomInfo(this.updateTechData._tech_id);
        }

        //getNetTech
        //var data = ModuleMgr.inst().getData("CastleModule").getNetTech();
        //for(var key in data) {
        //    cc.log("key",key,data[key]._tech_level);
        //}

        var tempData = [0,10,10,10];
        for (var i in tempData) {
            var tag = parseInt(i)+1;
            //cc.log("level", tag);
            var label = this.shuolianVector[i].getChildByName("level"+tag);
            label.ignoreContentAdaptWithSize(true);
            label.setString(tempData[i]);
            if (tempData[i] <= this.collegeLevel) {
                this.shuolianVector[i].setVisible(false);
                this.yeqianVector[i].setTouchEnabled(true);
            }
        }

        //cc.log("selectingTag", this.selectingTag);
        this.refreshYeqianState(this.selectingTag);

    },

    close:function() {

    },

    refreshYeqianState: function (tag) {
        for (var i = 0; i < this.yeqianVector.length; i++) {
            if (!this.shuolianVector[i].isVisible()) {
                if (tag == i+1) {
                    this.yeqianVector[i].loadTexture("gy_yeqian_anxia.png",ccui.Widget.PLIST_TEXTURE);
                    this.yeqianVector[i].setLocalZOrder(10);
                    this.titleVector[i].setLocalZOrder(11);
                }
                else {
                    this.yeqianVector[i].loadTexture("gy_yeqian_xuanze.png",ccui.Widget.PLIST_TEXTURE);
                    this.yeqianVector[i].setLocalZOrder(0);
                    this.titleVector[i].setLocalZOrder(1);
                }
            }
        }

        this.refreshScrollview(tag);
    },

    refreshScrollbarState: function (percent) {
        if (!percent && percent != 0) {
            return;
        }
        if (!this.isOnePage) {
            this.scrollbar.y = this.scrollPosY-(this.barTotalHeight-this.scrollbar.height)*percent/100;
        }
        else {
            this.scrollbar.y = this.scrollPosY;
        }
    },

    refreshScrollview: function (type) {
        this.tempdata = this._data[type-1];
        //this.selecttingTech = this._data[0];

        for (var index in this.itemMap) {
            if (this.itemMap[index]) {
                this.itemMap[index].removeFromParent(true);
            }
        }
        this.itemMap = [];

        var size = this.scrol.getContentSize();
        var counts = this.tempdata.length;
        var itemH = 280;//item0.getContentSize().height; 228
        var itemW = 200;

        var n1 = parseInt(counts / 4);
        var n2 = counts % 4;

        if (n2>0) {
            n1 += 1;
        }

        cc.log("counts / 4 = ", n1, "c ounts % 4 = ", n2);

        var h = n1 * itemH;
        //h = h > size.height ? h : size.height;
        if (h < size.height) {
            h = size.height;
            this.isOnePage = true;
        }
        else {
            this.isOnePage = false;
        }

        if (this.isOnePage) {
            this.refreshScrollbarState(100);
        }
        else {
            this.refreshScrollbarState(0);
        }

        //cc.log("h ",h,"height ",size.height);
        var data = ModuleMgr.inst().getData("CastleModule").getNetTech();
        for(var key in data) {
            cc.log("key",key,data[key]._tech_id,data[key]._tech_level);
        }

        for( var i=0; i<counts ; i++ ) {
            var temp_techid = this.tempdata[i];

            var levelstring = 0;
            if(data[temp_techid]) {
                levelstring=data[temp_techid]._tech_level;
            }

            var it = this.itemRoot.clone();
            this.itemMap.push(it);
            this.scrol.addChild( it );
            it.setVisible(true);
            it.setPosition( 192 + 192*(i%4),h - itemH*0.5 - itemH*parseInt(i/4) );

            var touchBg = it.getChildByName("Image_8");
            touchBg.setTouchEnabled(true);
            touchBg.setTag(i);
            touchBg.addTouchEventListener(this.itemTouch,this);

            var icon = it.getChildByName("Image_10_0");
            icon.ignoreContentAdaptWithSize(true);
            icon.setScale(0.35);
            icon.loadTexture(ResMgr.inst()._icoPath+temp_techid+"0.png");

            var selected = it.getChildByName("Image_10");
            selected.ignoreContentAdaptWithSize(true);
            selected.setVisible(false);
            if (this.isUpdate && temp_techid==this.updateTechData._tech_id) {
                this.setUpItemSelected(i);
                this.selecttingTech = this.tempdata[i];//当前正在升级的科技
            }

            var level = it.getChildByName("Text_24");
            level.ignoreContentAdaptWithSize(true);
            level.setString(levelstring);

            var name = it.getChildByName("Text_25");
            name.ignoreContentAdaptWithSize(true);
            name.setString(ResMgr.inst().getString(temp_techid+"0"));

            //进阶
            var touchBgDown = it.getChildByName("Image_8_0");
            touchBgDown.setTouchEnabled(true);
            //touchBg.setTag(i);
            touchBgDown.addTouchEventListener(this.itemDownTouch,this);

            var iconDown = it.getChildByName("Image_10_0_0");
            iconDown.ignoreContentAdaptWithSize(true);
            iconDown.setScale(0.35);
            iconDown.loadTexture(ResMgr.inst()._icoPath+temp_techid+"0.png");

            var selectedDown = it.getChildByName("Image_10_1");
            selectedDown.ignoreContentAdaptWithSize(true);
            selectedDown.loadTexture("College/xy_tubiaosuo.PNG",ccui.Widget.PLIST_TEXTURE);


            var nameDown = it.getChildByName("Text_25_0");
            nameDown.ignoreContentAdaptWithSize(true);
            nameDown.setString(ResMgr.inst().getString("college_20")+ResMgr.inst().getString(temp_techid+"0"));

            var lvBg = it.getChildByName("Image_9_0");
            lvBg.setVisible(false);
            var lv = it.getChildByName("Text_24_0");
            lv.setVisible(false);
        }

        size.height = h > size.height ? h : size.height;
        this.scrol.setInnerContainerSize( size );
        this.scrol.jumpToTop();

        var innerContainer = this.scrol.getInnerContainer();
        var innerContainerSize = this.scrol.getInnerContainerSize();
        var pos = innerContainer.getPosition();
        cc.log("x ",pos.x, "y ",pos.y);
        this.barPercent_total = Math.abs(pos.y);
        cc.log("barPercent_total ", this.barPercent_total, "innerContainerSize.height",innerContainerSize.height);

        if (this.barPercent_total==0) {
            this.scrollbar.height=this.barTotalHeight
        }
        else {
            var barHeight = this.barTotalHeight*(1-(this.barPercent_total/innerContainerSize.height));
            cc.log("滑块高度 ", barHeight);
            this.scrollbar.height=barHeight;
        }

        //this.setUpItemSelected(0);
        //this.refreshBottomInfo(0);
    },

    itemTouch: function (sender, type) {
        if (type == ccui.Widget.TOUCH_ENDED) {
            var tag = sender.getTag();
            cc.log("item touch ",tag);

            var tech = this.tempdata[tag];
            var layer = new CollegeLevelConfirmLayer(tech,this.isUpdate);
            this.addChild(layer);
        }
    },

    itemDownTouch: function (sender, type) {
        if (type == ccui.Widget.TOUCH_ENDED) {
            //var tag = sender.getTag();
            //cc.log("item down touch ",tag);
            ModuleMgr.inst().openModule("AlertString",{str:ResMgr.inst().getString("college_18"),color:null,time:null,pos:null});
        }
    },

    setUpItemSelected: function (index) {
        for (var i = 0; i < this.itemMap.length; i++) {
            var selected = this.itemMap[i].getChildByName("Image_10");
            if (index == i) {
                selected.setVisible(true);
            }
            else {
                selected.setVisible(false);
            }
        }
    },

    refreshBottomInfo: function (techid) {
        var techlevel = ModuleMgr.inst().getData("CollegeModule").getTechLevel(techid);
        var tech_data = ModuleMgr.inst().getData("ConfigTableUpdator").getConfigTableValueByKey("City_College_tech","["+techid+","+techlevel+"]");
            //ResMgr.inst().getJSON("City_College_tech",""+techid+techlevel,true);

        var ddd = ModuleMgr.inst().getData("CastleModule").getNetTech()[techid];

        if(!this.root) {
            cc.log("this.root null null");
        }

        var bottomPanel = this.root.getChildByName("Image_6");
        bottomPanel.setVisible(true);

        var icon = bottomPanel.getChildByName("icon");
        icon.setTexture(ResMgr.inst()._icoPath+techid+"0.png");
        icon.setScale(0.35);

        var name = bottomPanel.getChildByName("Text_20");
        name.ignoreContentAdaptWithSize(true);
        name.setString(ResMgr.inst().getString(techid+"0"));

        cc.log("科技剩余时间 毫秒",ddd._state_remain);
        this._time = parseInt(ddd._state_remain/1000);
        var cd = bottomPanel.getChildByName("Text_22");
        cd.ignoreContentAdaptWithSize(true);
        cd.setString(StringUtils.formatTimer(this._time*1000));

        //this.schedule(this.scheduleCallback,1);
    },

    netUpdateTechTime: function (type, netTech) {

        this._time = parseInt(netTech._state_remain/1000);
        var bottomPanel = this.root.getChildByName("Image_6");
        var cd = bottomPanel.getChildByName("Text_22");
        cd.ignoreContentAdaptWithSize(true);
        cd.setString(StringUtils.formatTimer(this._time*1000));
    },

    netCallback: function (type,data) {
        cc.log("collegeModule",data);
        if (data == CastleNetEvent.SEND_TECH_UPGRADE) {
            var building = ModuleMgr.inst().getData("CastleModule").getNetTechByState(CastleData.STATE_UPGRADE);
            cc.log("正在升级的科技个数 ",building.length,"collegelevel ",this.collegeLevel);
            if (building.length > 0) {
                this.isUpdate = true;
                this.updateTechData = building[0];
            }

            if (this.isUpdate && this.updateTechData) {
                cc.log("正在升级的科技 ID",this.updateTechData._tech_id,this.updateTechData._tech_level);

                var tech_data = ModuleMgr.inst().getData("ConfigTableUpdator").getConfigTableValueByKey("City_College_tech","["+this.updateTechData._tech_id+","+this.updateTechData._tech_level+"]");
                    //ResMgr.inst().getJSON("City_College_tech",""+this.updateTechData._tech_id+this.updateTechData._tech_level,true);
                cc.log("科技type",tech_data.tech_type);

                this.selectingTag = tech_data.tech_type;
                this.refreshBottomInfo(this.updateTechData._tech_id);
            }

            this.refreshYeqianState(this.selectingTag);
        }
        else if (data == CastleNetEvent.SEND_TECH_CANCEL) {
            //this.unschedule(this.scheduleCallback);

            this.isUpdate = false;
            var bottomPanel = this.root.getChildByName("Image_6");
            bottomPanel.setVisible(false);
            this.refreshYeqianState(this.selectingTag);
        }
    },

    eventCallback: function (type) {
        //this.unschedule(this.scheduleCallback);

        this.isUpdate = false;
        var bottomPanel = this.root.getChildByName("Image_6");
        bottomPanel.setVisible(false);
        this.refreshYeqianState(this.selectingTag);
    },

    //scheduleCallback: function (ft) {
    //    var bottomPanel = this.root.getChildByName("Image_6");
    //    this._time--;
    //
    //    var data = ModuleMgr.inst().getData("CollegeModule");
    //    data.remainTime = this._time;
    //
    //    if (this._time<0) {
    //        this._time=0;
    //        data.remainTime=0;
    //        this.unschedule(this.scheduleCallback);
    //
    //        this.isUpdate = false;
    //        bottomPanel.setVisible(false);
    //        this.refreshYeqianState(this.selectingTag);
    //        return;
    //    }
    //    //var bottomPanel = this.root.getChildByName("Image_6");
    //    bottomPanel.setVisible(true);
    //    var cd = bottomPanel.getChildByName("Text_22");
    //    cd.ignoreContentAdaptWithSize(true);
    //    cd.setString(StringUtils.formatTimer(this._time*1000));
    //}
});
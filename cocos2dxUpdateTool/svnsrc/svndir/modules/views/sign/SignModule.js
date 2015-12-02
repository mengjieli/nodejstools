/**
 * Created by cgMu on 2015/11/14.
 */

var SignModule = ModuleBase.extend({
    signDay:0,
    isSigned:false,//标识当天是否领取，默认未签到

    dayBgArray:null,//存储天数后面的背景image
    gotLabelBgArray:null,//存储已领取label和背景image
    iconBgArray:null,

    signButton:null,

    signData:null,

    ctor:function() {
        this._super();

        this.dayBgArray = [];
        this.gotLabelBgArray = [];
        this.iconBgArray = [];

        this.signData = [];

        //读取配置
        var data = ModuleMgr.inst().getData("ConfigTableUpdator").getConfigTableValueAll("sign");
        for(var i in data) {
            //cc.log(i,data[i].trading_id);
            var trading_data = ModuleMgr.inst().getData("ConfigTableUpdator").getConfigTableValueByKey("item_trading",data[i].trading_id);
            var tempjson = eval("(" + trading_data.obtain_item + ")");
            var obtain_item = {};
            for (var jsonkey in tempjson) {
                obtain_item.item_id = jsonkey;
                obtain_item.item_counts = tempjson[jsonkey];
            }
            this.signData.push(obtain_item);
        }

        EventMgr.inst().addEventListener(CastleEvent.NET_COMPLETE,this.netComplete,this);
        EventMgr.inst().addEventListener(ITEM_EVENT.ITEM_UPDATE,this.updateUI,this);
    },

    initUI:function() {
        var colorbg = new cc.LayerColor(cc.color(0, 0, 0, 255 * 0.8));
        this.addChild(colorbg);

        var root = ccs.load("res/images/ui/SignModule/SignLayer.json","res/images/ui/").node;
        this.addChild(root);

        var size = cc.director.getVisibleSize();
        root.setContentSize(size);
        ccui.helper.doLayout(root);

        var panel_root = root.getChildByName("Panel_1");
        this.posAutoLayout(panel_root,0.5);

        var title = panel_root.getChildByName("Text_1");
        title.ignoreContentAdaptWithSize(true);
        title.setString(ResMgr.inst().getString("sign_1"));

        //第一天
        var day = panel_root.getChildByName("Text_2_0");
        day.ignoreContentAdaptWithSize(true);
        day.setString(ResMgr.inst().getString("sign_2"));

        var gotLabelBg = panel_root.getChildByName("gy_jianzhuwu_di_3_0");
        gotLabelBg.setVisible(false);
        var label = gotLabelBg.getChildByName("Text_3_0");
        label.ignoreContentAdaptWithSize(true);
        label.setString(ResMgr.inst().getString("sign_10"));
        this.gotLabelBgArray.push(gotLabelBg);

        var now = panel_root.getChildByName("Image_2_0");
        now.setVisible(false);
        this.dayBgArray.push(now);

        var iconbg = panel_root.getChildByName("Image_3_1");
        iconbg.ignoreContentAdaptWithSize(true);
        this.iconBgArray.push(iconbg);

        var icon = panel_root.getChildByName("Image_3_0_0");
        icon.ignoreContentAdaptWithSize(true);
        icon.loadTexture(ResMgr.inst().getIcoPath(this.signData[0].item_id));
        icon.setScale(0.48);

        var counts = panel_root.getChildByName("Text_5_1");
        counts.ignoreContentAdaptWithSize(true);
        counts.setString(this.signData[0].item_counts);

        //第二天
        day = panel_root.getChildByName("Text_2");
        day.ignoreContentAdaptWithSize(true);
        day.setString(ResMgr.inst().getString("sign_3"));

        gotLabelBg = panel_root.getChildByName("gy_jianzhuwu_di_3");
        gotLabelBg.setVisible(false);
        label = gotLabelBg.getChildByName("Text_3");
        label.ignoreContentAdaptWithSize(true);
        label.setString(ResMgr.inst().getString("sign_10"));
        this.gotLabelBgArray.push(gotLabelBg);

        now = panel_root.getChildByName("Image_2");
        now.setVisible(false);
        this.dayBgArray.push(now);

        iconbg = panel_root.getChildByName("Image_3");
        iconbg.ignoreContentAdaptWithSize(true);
        this.iconBgArray.push(iconbg);

        icon = panel_root.getChildByName("Image_3_0");
        icon.ignoreContentAdaptWithSize(true);
        icon.loadTexture(ResMgr.inst().getIcoPath(this.signData[1].item_id));
        icon.setScale(0.48);

        counts = panel_root.getChildByName("Text_5");
        counts.ignoreContentAdaptWithSize(true);
        counts.setString(this.signData[1].item_counts);

        //第三天
        day = panel_root.getChildByName("Text_2_1");
        day.ignoreContentAdaptWithSize(true);
        day.setString(ResMgr.inst().getString("sign_4"));

        gotLabelBg = panel_root.getChildByName("gy_jianzhuwu_di_3_1");
        gotLabelBg.setVisible(false);
        label = gotLabelBg.getChildByName("Text_3_1");
        label.ignoreContentAdaptWithSize(true);
        label.setString(ResMgr.inst().getString("sign_10"));
        this.gotLabelBgArray.push(gotLabelBg);

        now = panel_root.getChildByName("Image_2_1");
        now.setVisible(false);
        this.dayBgArray.push(now);

        iconbg = panel_root.getChildByName("Image_3_2");
        iconbg.ignoreContentAdaptWithSize(true);
        this.iconBgArray.push(iconbg);

        icon = panel_root.getChildByName("Image_3_0_1");
        icon.ignoreContentAdaptWithSize(true);
        icon.loadTexture(ResMgr.inst().getIcoPath(this.signData[2].item_id));
        icon.setScale(0.48);

        counts = panel_root.getChildByName("Text_5_0");
        counts.ignoreContentAdaptWithSize(true);
        counts.setString(this.signData[2].item_counts);

        //第四天
        day = panel_root.getChildByName("Text_2_2");
        day.ignoreContentAdaptWithSize(true);
        day.setString(ResMgr.inst().getString("sign_5"));

        gotLabelBg = panel_root.getChildByName("gy_jianzhuwu_di_3_2");
        gotLabelBg.setVisible(false);
        label = gotLabelBg.getChildByName("Text_3_2");
        label.ignoreContentAdaptWithSize(true);
        label.setString(ResMgr.inst().getString("sign_10"));
        this.gotLabelBgArray.push(gotLabelBg);

        now = panel_root.getChildByName("Image_2_2");
        now.setVisible(false);
        this.dayBgArray.push(now);

        iconbg = panel_root.getChildByName("Image_3_3");
        iconbg.ignoreContentAdaptWithSize(true);
        this.iconBgArray.push(iconbg);

        icon = panel_root.getChildByName("Image_3_0_2");
        icon.ignoreContentAdaptWithSize(true);
        icon.loadTexture(ResMgr.inst().getIcoPath(this.signData[3].item_id));
        icon.setScale(0.48);

        counts = panel_root.getChildByName("Text_5_2");
        counts.ignoreContentAdaptWithSize(true);
        counts.setString(this.signData[3].item_counts);

        //第五天
        day = panel_root.getChildByName("Text_2_3");
        day.ignoreContentAdaptWithSize(true);
        day.setString(ResMgr.inst().getString("sign_6"));

        gotLabelBg = panel_root.getChildByName("gy_jianzhuwu_di_3_3");
        gotLabelBg.setVisible(false);
        label = gotLabelBg.getChildByName("Text_3_3");
        label.ignoreContentAdaptWithSize(true);
        label.setString(ResMgr.inst().getString("sign_10"));
        this.gotLabelBgArray.push(gotLabelBg);

        now = panel_root.getChildByName("Image_2_3");
        now.setVisible(false);
        this.dayBgArray.push(now);

        iconbg = panel_root.getChildByName("Image_3_4");
        iconbg.ignoreContentAdaptWithSize(true);
        this.iconBgArray.push(iconbg);

        icon = panel_root.getChildByName("Image_3_0_3");
        icon.ignoreContentAdaptWithSize(true);
        icon.loadTexture(ResMgr.inst().getIcoPath(this.signData[4].item_id));
        icon.setScale(0.48);

        counts = panel_root.getChildByName("Text_5_3");
        counts.ignoreContentAdaptWithSize(true);
        counts.setString(this.signData[4].item_counts);

        //第六天
        day = panel_root.getChildByName("Text_2_4");
        day.ignoreContentAdaptWithSize(true);
        day.setString(ResMgr.inst().getString("sign_7"));

        gotLabelBg = panel_root.getChildByName("gy_jianzhuwu_di_3_4");
        gotLabelBg.setVisible(false);
        label = gotLabelBg.getChildByName("Text_3_4");
        label.ignoreContentAdaptWithSize(true);
        label.setString(ResMgr.inst().getString("sign_10"));
        this.gotLabelBgArray.push(gotLabelBg);

        now = panel_root.getChildByName("Image_2_4");
        now.setVisible(false);
        this.dayBgArray.push(now);

        iconbg = panel_root.getChildByName("Image_3_5");
        iconbg.ignoreContentAdaptWithSize(true);
        this.iconBgArray.push(iconbg);

        icon = panel_root.getChildByName("Image_3_0_4");
        icon.ignoreContentAdaptWithSize(true);
        icon.loadTexture(ResMgr.inst().getIcoPath(this.signData[5].item_id));
        icon.setScale(0.48);

        counts = panel_root.getChildByName("Text_5_4");
        counts.ignoreContentAdaptWithSize(true);
        counts.setString(this.signData[5].item_counts);

        //第七天
        day = panel_root.getChildByName("Text_2_5");
        day.ignoreContentAdaptWithSize(true);
        day.setString(ResMgr.inst().getString("sign_8"));

        gotLabelBg = panel_root.getChildByName("gy_jianzhuwu_di_3_5");
        gotLabelBg.setVisible(false);
        label = gotLabelBg.getChildByName("Text_3_5");
        label.ignoreContentAdaptWithSize(true);
        label.setString(ResMgr.inst().getString("sign_10"));
        this.gotLabelBgArray.push(gotLabelBg);

        now = panel_root.getChildByName("Image_2_5");
        now.setVisible(false);
        this.dayBgArray.push(now);

        iconbg = panel_root.getChildByName("Image_3_6");
        iconbg.ignoreContentAdaptWithSize(true);
        this.iconBgArray.push(iconbg);

        icon = panel_root.getChildByName("Image_3_0_5");
        icon.ignoreContentAdaptWithSize(true);
        icon.loadTexture(ResMgr.inst().getIcoPath(this.signData[6].item_id));
        icon.setScale(0.48);

        counts = panel_root.getChildByName("Text_5_4_0");
        counts.ignoreContentAdaptWithSize(true);
        counts.setString(this.signData[6].item_counts);

        //签到按钮
        var sign_button = panel_root.getChildByName("Button_1");
        sign_button.addTouchEventListener(this.signCallback,this);
        var btnTitle = sign_button.getChildByName("Text_4");
        btnTitle.ignoreContentAdaptWithSize(true);
        btnTitle.setString(ResMgr.inst().getString("sign_9"));
        this.signButton = sign_button;
    },

    show:function( value ) {
        this.signDay = SelfData.getInstance().signDays;//已签到天数

        var sign_item = ModuleMgr.inst().getData("ItemModule").getCountsByItemId(SignModule.SIGH_ITEM_ID);//2100020:签到数量道具ID
        if (sign_item==0) {
            this.isSigned = true;
        }

        //cc.log("SignModule",sign_item, this.signDay);

        this.refreshSignDay(this.signDay);

        if (this.signButton) {
            var btnTitle = this.signButton.getChildByName("Text_4");
            this.setButtonEnabled(!this.isSigned,this.signButton,btnTitle);
        }
    },

    close:function() {

    },

    destroy:function() {
        EventMgr.inst().removeEventListener(CastleEvent.NET_COMPLETE,this.netComplete,this);
        EventMgr.inst().removeEventListener(ITEM_EVENT.ITEM_UPDATE,this.updateUI,this);
    },
    //大小适配
    sizeAutoLayout:function(node,scale) {
        scale = scale ? scale:1;
        var down = GameMgr.inst().frameSize.height - GameMgr.inst().scaleViewSize.height;
        down = down * (1/GameMgr.inst().scaleX);
        var size = node.getContentSize();
        size.height += down*scale;
        node.setContentSize( size );
    },
    //坐标适配
    posAutoLayout: function (node, scale) {
        scale = scale ? scale:1;
        var down = GameMgr.inst().frameSize.height - GameMgr.inst().scaleViewSize.height;
        down = down * (1/GameMgr.inst().scaleX);
        var posY = node.getPositionY();
        posY += down*scale;
        node.setPositionY( posY );
    },

    signCallback: function (sender, type) {
        if (type != ccui.Widget.TOUCH_ENDED) return;
        //cc.log("signCallback",this.signDay);
        //this.removeFromParent(true);
        var msg = new SocketBytes();
        msg.writeUint(205);//签到
        NetMgr.inst().send(msg);
    },
    //day:已签到天数
    refreshSignDay: function (day) {
        //cc.log("refreshSignDay",day, this.iconBgArray.length);
        var sign_day = day - 1;//索引从0开始
        if(day >= 7) {
            //if (!this.isSigned) {
                day = (day % 7)
                sign_day = (day % 7) - 1;
            //}
            //else {
            //    sign_day = (day % 7) - 1;
            //}
        }
        if(this.isSigned) {
            //今天已签到
            for (var i = 0; i < 7; i++) {
                    if(i < sign_day) {
                        //已签到状态
                        if(this.dayBgArray[i]) {
                            this.dayBgArray[i].setVisible(false);
                        }
                        if(this.gotLabelBgArray[i]) {
                            this.gotLabelBgArray[i].setVisible(true);
                        }
                        if(this.iconBgArray[i]) {
                            this.iconBgArray[i].loadTexture("SignModule/mr_qizhi_02.png",ccui.Widget.PLIST_TEXTURE);
                        }
                    }
                    else if(i == sign_day) {
                        //今天的状态
                        if(this.dayBgArray[i]) {
                            this.dayBgArray[i].setVisible(true)
                        }
                        if(this.gotLabelBgArray[i]) {
                            this.gotLabelBgArray[i].setVisible(this.isSigned);
                        }
                        if(this.isSigned){
                            if(this.iconBgArray[i]) {
                                this.iconBgArray[i].loadTexture("SignModule/mr_qizhi_02.png",ccui.Widget.PLIST_TEXTURE);
                            }
                        }
                    }
                    else {
                        if(this.dayBgArray[i]) {
                            this.dayBgArray[i].setVisible(false)
                        }
                        if(this.gotLabelBgArray[i]) {
                            this.gotLabelBgArray[i].setVisible(false);
                        }
                    }
            }
        }
        else {
            //今天未签到
            for (var i = 0; i < 7; i++) {
                if(i <= sign_day) {
                    //已签到状态
                    if(this.dayBgArray[i]) {
                        this.dayBgArray[i].setVisible(false);
                    }
                    if(this.gotLabelBgArray[i]) {
                        this.gotLabelBgArray[i].setVisible(true);
                    }
                    if(this.iconBgArray[i]) {
                        this.iconBgArray[i].loadTexture("SignModule/mr_qizhi_02.png",ccui.Widget.PLIST_TEXTURE);
                    }
                }
                else if(i == day) {
                    //今天的状态
                    if(this.dayBgArray[i]) {
                        this.dayBgArray[i].setVisible(true)
                    }
                    if(this.gotLabelBgArray[i]) {
                        this.gotLabelBgArray[i].setVisible(this.isSigned);
                    }
                    if(this.isSigned){
                        if(this.iconBgArray[i]) {
                            this.iconBgArray[i].loadTexture("SignModule/mr_qizhi_02.png",ccui.Widget.PLIST_TEXTURE);
                        }
                    }
                }
                else {
                    if(this.dayBgArray[i]) {
                        this.dayBgArray[i].setVisible(false)
                    }
                    if(this.gotLabelBgArray[i]) {
                        this.gotLabelBgArray[i].setVisible(false);
                    }
                }
            }
        }
    },

    //设置签到按钮状态
    setButtonEnabled: function (enabled,button,text) {
        if(!button) return;
        button.setBright(enabled);
        button.setTouchEnabled(enabled);
        if (text) {
            if (enabled) {
                text.setColor(cc.color(255,165,0));
            }
            else {
                text.setColor(cc.color(255,255,255));
            }
        }
    },

    netComplete: function (event, data) {
        if (data == 205) {
            //签到成功;刷新UI
            //ModuleMgr.inst().openModule("SignModule");
            ModuleMgr.inst().openModule("AlertString",{str:ResMgr.inst().getString("sign_11"),color:null,time:null,pos:null});
            this.removeFromParent(true);
        }
    },

    updateUI: function (event,itemid,counts) {
        if (itemid == SignModule.SIGH_ITEM_ID) {
            var cou = ModuleMgr.inst().getData("ItemModule").getCountsByItemId(SignModule.SIGH_ITEM_ID);//2100020:签到数量道具ID
            if (cou>0) {
                ModuleMgr.inst().openModule("SignModule");
            }
        }
    }
});

SignModule.SIGH_ITEM_ID = 2100020;
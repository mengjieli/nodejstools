/**
 * Created by cgMu on 2015/11/3.
 */

HEADEVENT = {};
HEADEVENT.CHANGE_HEAD_SUCCESS = "change_head_success";
HEADEVENT.CHANGE_NAME_SUCCESS = "change_name_success";

var HeadModule = ModuleBase.extend({
    musicBtn:true,
    soundBtn:true,

    headIcon:null,
    _panel_part1:null,

    ctor:function() {
        this._super();

        //mainData.playerData.addListener(GameSDK.Event.PROPERTY_CHANGE,this.headidchanged,this);

        //修改头像成功事件监听
        EventMgr.inst().addEventListener(HEADEVENT.CHANGE_HEAD_SUCCESS,this.updateHeadIcon,this);
        EventMgr.inst().addEventListener(HEADEVENT.CHANGE_NAME_SUCCESS,this.updateName,this);

        EventMgr.inst().addEventListener(CastleEvent.NET_COMPLETE,this.netUpdate,this);
    },

    initUI:function() {

        var root = ccs.load("res/images/ui/HeadModule/HeadLayer.json","res/images/ui/").node;
        this.addChild(root);

        var size = cc.director.getVisibleSize();
        root.setContentSize(size);
        ccui.helper.doLayout(root);

        var down = GameMgr.inst().frameSize.height - GameMgr.inst().scaleViewSize.height;
        down = down * (1/GameMgr.inst().scaleX);

        //背景容器
        var Panel_1 = root.getChildByName("Panel_1");
        var size = Panel_1.getContentSize();
        size.height += down;
        Panel_1.setContentSize( size );

        //第一部分
        var panel_part1 = root.getChildByName("Image_1_1");
        var posY = panel_part1.getPositionY();
        posY += down;
        panel_part1.setPositionY( posY );
        this._panel_part1 = panel_part1;

        //第二部分
        var panel_part2 = root.getChildByName("Image_1");
        var size = panel_part2.getContentSize();
        size.height += down/2;
        panel_part2.setContentSize( size );
        var posY = panel_part2.getPositionY();
        posY += down/2;
        panel_part2.setPositionY( posY );

        var des1 = root.getChildByName("Text_4");
        des1.ignoreContentAdaptWithSize(true);
        des1.setString(ResMgr.inst().getString("head_13"));
        var posY = des1.getPositionY();
        posY += down * 3 /4;
        des1.setPositionY( posY );
        des1.setVisible(false);

        var des2 = root.getChildByName("Text_4_0");
        des2.ignoreContentAdaptWithSize(true);
        des2.setString(ResMgr.inst().getString("head_14"));
        var posY = des2.getPositionY();
        posY += down * 3 /4;
        des2.setPositionY( posY );
        des2.setVisible(false);

        var des3 = root.getChildByName("Text_4_1");
        des3.ignoreContentAdaptWithSize(true);
        des3.setString(ResMgr.inst().getString("head_15"));
        var posY = des3.getPositionY();
        posY += down * 3 /4;
        des3.setPositionY( posY );
        des3.setVisible(false);

        //第三部分
        var panel_part3 = root.getChildByName("Image_1_0");
        var size = panel_part3.getContentSize();
        size.height += down/4;
        panel_part3.setContentSize( size );
        var posY = panel_part3.getPositionY();
        posY += down/4;
        panel_part3.setPositionY( posY );

        var musicLabel = root.getChildByName("Text_9");
        musicLabel.ignoreContentAdaptWithSize(true);
        musicLabel.setString(ResMgr.inst().getString("head_17"));
        var posY = musicLabel.getPositionY();
        posY += down*3/8;
        musicLabel.setPositionY( posY );

        var soundLabel = root.getChildByName("Text_9_0");
        soundLabel.ignoreContentAdaptWithSize(true);
        soundLabel.setString(ResMgr.inst().getString("head_16"));
        var posY = soundLabel.getPositionY();
        posY += down*3/8;
        soundLabel.setPositionY( posY );

        var Image_2 = root.getChildByName("Image_2");
        var posY = Image_2.getPositionY();
        posY += down*3/8;
        Image_2.setPositionY( posY );
        var Image_2_0 = root.getChildByName("Image_2_0");
        var posY = Image_2_0.getPositionY();
        posY += down*3/8;
        Image_2_0.setPositionY( posY );

        //第四部分
        var Image_1_0_0 = root.getChildByName("Image_1_0_0");
        var size = Image_1_0_0.getContentSize();
        size.height += down/4;
        Image_1_0_0.setContentSize( size );

        var label = panel_part1.getChildByName('Text_2');
        label.ignoreContentAdaptWithSize(true);
        label.setString(ResMgr.inst().getString("head_1"));

        label = panel_part1.getChildByName('Text_2_0');
        label.ignoreContentAdaptWithSize(true);
        label.setString(ResMgr.inst().getString("head_2"));
        label.setVisible(false);

        label = panel_part1.getChildByName('Text_2_1');
        label.ignoreContentAdaptWithSize(true);
        label.setString(ResMgr.inst().getString("head_3"));
        label.setVisible(false);

        var changeBtn1 = panel_part1.getChildByName("Image_9");
        changeBtn1.setTouchEnabled(true);
        changeBtn1.addTouchEventListener(this.changeBtnCallback,this);

        var changeBtn2 = panel_part1.getChildByName("Image_9_0");
        changeBtn2.addTouchEventListener(this.changeBtnCallback,this);
        changeBtn2.setVisible(false);

        //head icon
        this.headIcon = panel_part1.getChildByName("Image_6_0");
        this.headIcon.setScale(0.68);
        this.headIcon.ignoreContentAdaptWithSize(true);
        var headname = mainData.playerData.headid;//SelfData.getInstance().headId;
        if(headname == "") {
            headname = ResMgr.inst().getCSV("head",1).head_id;//默认配置第一个  var headArray = ResMgr.inst().getCSV("head");
        }
        this.setHeadIconView(headname);
        //uid
        label = panel_part1.getChildByName("Text_2_3");
        label.setVisible(false);

        label = panel_part1.getChildByName("Text_2_4");
        label.ignoreContentAdaptWithSize(true);
        label.setString(ResMgr.inst().getString("head_4"));
        label.setVisible(false);

        label = panel_part1.getChildByName('Text_2_5');
        label.ignoreContentAdaptWithSize(true);
        label.setString(ResMgr.inst().getString("head_5"));
        label.setVisible(false);

        var btn1 = panel_part1.getChildByName("Button_1");
        btn1.addTouchEventListener(this.btn1,this);
        var title = btn1.getChildByName("Text_1");
        title.ignoreContentAdaptWithSize(true);
        title.setString(ResMgr.inst().getString("head_6"));

        var btn2 = root.getChildByName("Button_2");
        btn2.addTouchEventListener(this.btnCallback,this);
        var posY = btn2.getPositionY();
        posY += down/8;
        btn2.setPositionY( posY );
        btn2.setTag(HeadModule.BUTTON_LEFT_TAG);
        title = btn2.getChildByName("Text_11");
        title.ignoreContentAdaptWithSize(true);
        title.setString(ResMgr.inst().getString("head_7"));

        var btn3 = root.getChildByName("Button_2_0");
        btn3.addTouchEventListener(this.btnCallback,this);
        var posY = btn3.getPositionY();
        posY += down/8;
        btn3.setPositionY( posY );
        btn3.setTag(HeadModule.BUTTON_RIGHT_TAG);
        title = btn3.getChildByName("Text_11");
        title.ignoreContentAdaptWithSize(true);
        title.setString(ResMgr.inst().getString("head_8"));

        //cc.log("****",SelfData.getInstance().nick);
        var left1 = panel_part1.getChildByName("Text_3");
        left1.ignoreContentAdaptWithSize(true);
        left1.setString(mainData.playerData.nick);

        var left2 = panel_part1.getChildByName("Text_3_0");
        left2.ignoreContentAdaptWithSize(true);
        left2.setString("");
        left2.setVisible(false);

        var left3 = panel_part1.getChildByName("Text_8");
        left3.ignoreContentAdaptWithSize(true);
        left3.setString("");
        left3.setVisible(false);

        var right1 = panel_part1.getChildByName('Text_3_1_0_0');
        right1.ignoreContentAdaptWithSize(true);
        right1.setString("");
        right1.setVisible(false);

        var right2 = panel_part1.getChildByName('Text_3_1_0');
        right2.ignoreContentAdaptWithSize(true);
        right2.setString(9999);
        right2.setVisible(false);

        var right3 = panel_part1.getChildByName('Text_3_1');
        right3.ignoreContentAdaptWithSize(true);
        right3.setString(9999);
        right3.setVisible(false);

        //exp
        var exp = panel_part1.getChildByName("Text_2_2");
        exp.setVisible(false);
        var loadingbarbg = panel_part1.getChildByName("Image_5");
        loadingbarbg.setVisible(false);
        var loadingbar = panel_part1.getChildByName("LoadingBar_1");
        loadingbar.setVisible(false);
        var exp_value = panel_part1.getChildByName("Text_10");
        exp_value.setVisible(false);
        //di
        var di = panel_part1.getChildByName("tx_bukebianji_di_1_0");
        di.setVisible(false);
        di = panel_part1.getChildByName("tx_bukebianji_di_1_0_0");
        di.setVisible(false);
        di = panel_part1.getChildByName("tx_bukebianji_di_1_0_0_0");
        di.setVisible(false);
        di = panel_part1.getChildByName("tx_kebianji_di_2_0");
        di.setVisible(false);
        di = panel_part1.getChildByName("tx_bukebianji_di_1");
        di.setVisible(false);

        var chooseBtn1 = root.getChildByName("Image_2");
        chooseBtn1.setTouchEnabled(true);
        chooseBtn1.setTag(HeadModule.CHOOSE_SOUND_TAG);
        chooseBtn1.addTouchEventListener(this.chooseBtnCallback,this);

        var chooseBtn2 = root.getChildByName("Image_2_0");
        chooseBtn2.setTouchEnabled(true);
        chooseBtn2.setTag(HeadModule.CHOOSE_MUSIC_TAG);
        chooseBtn2.addTouchEventListener(this.chooseBtnCallback,this);
    },

    show:function( value ) {

    },

    close:function() {

    },

    destroy:function() {
        //mainData.playerData.removeListener(GameSDK.Event.PROPERTY_CHANGE,this.headidchanged,this);

        EventMgr.inst().removeEventListener(HEADEVENT.CHANGE_HEAD_SUCCESS,this.updateHeadIcon,this);
        EventMgr.inst().removeEventListener(HEADEVENT.CHANGE_NAME_SUCCESS,this.updateName,this);

        EventMgr.inst().removeEventListener(CastleEvent.NET_COMPLETE,this.netUpdate,this);
    },

    btn1:function(sender,type) {
        if (type == ccui.Widget.TOUCH_ENDED) {
            //cc.log("btn 1 touch ended");
            var layer = new SelectingLayer();
            //this.addChild(layer);
            ModuleMgr.inst().addNodeTOLayer(layer, ModuleLayer.LAYER_TYPE_TOP );
        }
    },

    btnCallback: function (sender, type) {
        if (type == ccui.Widget.TOUCH_ENDED) {
            var tag = sender.getTag();
            switch (tag){
                case HeadModule.BUTTON_LEFT_TAG://注销
                    //cc.log("btn 注销 touch ended");
                    ModuleMgr.inst().openModule("GameOverModule");
                    break;
                case HeadModule.BUTTON_RIGHT_TAG://退出
                    cc.director.end();
                    break;
            }
        }
    },

    chooseBtnCallback: function (sender, type) {
        if (type == ccui.Widget.TOUCH_ENDED) {
            cc.log("chooseBtnCallback");
            switch (sender.getTag()) {
                case HeadModule.CHOOSE_MUSIC_TAG:
                    this.setChooseBtnState(sender,!this.musicBtn);
                    this.musicBtn = !this.musicBtn;
                    if (this.musicBtn) {
                        cc.error("音乐开启");
                    }
                    else {
                        cc.error("音乐关闭");
                    }
                    break;
                case HeadModule.CHOOSE_SOUND_TAG:
                    this.setChooseBtnState(sender,!this.soundBtn);
                    this.soundBtn = !this.soundBtn;
                    if (this.soundBtn) {
                        cc.error("音效开启");
                    }
                    else {
                        cc.error("音效关闭");
                    }
                    break;
            }
        }
    },

    setChooseBtnState: function (btn,state) {
        var left = btn.getChildByName("left");
        left.ignoreContentAdaptWithSize(true);
        var right = btn.getChildByName("right");
        right.ignoreContentAdaptWithSize(true);
        if (state) {
            //on
            left.loadTexture("HeadModule/tx_huadonganniu.png",ccui.Widget.PLIST_TEXTURE);
            right.loadTexture("HeadModule/tx_guanbi.png",ccui.Widget.PLIST_TEXTURE);
        }
        else {
            //off
            left.loadTexture("HeadModule/tx_kaiqi.png",ccui.Widget.PLIST_TEXTURE);
            right.loadTexture("HeadModule/tx_huadonganniu.png",ccui.Widget.PLIST_TEXTURE);
        }
    },

    //headidchanged: function () {
    //    cc.log("@headid changed",mainData.playerData.headid);
    //},

    netUpdate: function (event,data) {
        if(data==201){
            //设置账号属性返回
            EventMgr.inst().dispatchEvent(HEADEVENT.CHANGE_HEAD_SUCCESS);
        }
        if(data==202){
            //设置昵称返回
            EventMgr.inst().dispatchEvent(HEADEVENT.CHANGE_NAME_SUCCESS);
        }
    },

    setHeadIconView: function () {
        if (this.headIcon) {
            this.headIcon.loadTexture(ResMgr.inst().getIcoPath(mainData.playerData.headid));
        }
    },

    updateHeadIcon: function (event) {
        this.setHeadIconView();
    },

    updateName: function (event) {
        var left1 = this._panel_part1.getChildByName("Text_3");
        left1.ignoreContentAdaptWithSize(true);
        left1.setString(mainData.playerData.nick);
    },

    changeBtnCallback: function (sender,type) {
        if(type == ccui.Widget.TOUCH_ENDED) {
            //cc.log("changeBtnCallback");
            var layer = new ChangeNameLayer();
            ModuleMgr.inst().addNodeTOLayer( layer, ModuleLayer.LAYER_TYPE_TOP );
        }
    }

});

HeadModule.BUTTON_LEFT_TAG = 1001;
HeadModule.BUTTON_RIGHT_TAG = 1002;
HeadModule.CHOOSE_MUSIC_TAG = 1003;
HeadModule.CHOOSE_SOUND_TAG = 1004;
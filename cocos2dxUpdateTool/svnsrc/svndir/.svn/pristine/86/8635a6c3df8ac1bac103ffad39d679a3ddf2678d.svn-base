/*
**登陆/注册模块 2015-09-01 shenwei
*/
var LoadingModule = ModuleBase.extend({

    _scene: null,
    _panel: null,

    //partI
    _preUpTip: null,
    _preUpTipEffectCtrl: null,

    _preDownTip: null,
    _preDownTipEffectCtrl: null,

    _bkg: null,
    _logo: null,
    _logoEffectCtrl: null,

    //partII
    _beauty: null,
    _beautyEffectCtrl: null,

    _deskLeft: null,
    _deskLeftEffectCtrl: null,

    _deskRight: null,
    _deskRightEffectCtrl: null,

    _deskMid: null,
    _deskMidEffectCtrl: null,

    _loadingBarBkg: null,
    _loadingBarBkgEffectCtrl: null,
    _loadingBar: null,
    _loadingTip: null,
    _loadingTipEffectCtrl: null,

    _waitingTipUp: null,
    _waitingTipUpEffectCtrl: null,

    _waitingTipDown: null,
    _waitingTipDownEffectCtrl: null,

    _delayTimer: null,

    _updateCount: null,//配置表更新计数
    _updateConfigTablesTimer: null,

    ctor: function () {
        this._super();

        this._delayTimer = -1;
        this._updateCount = 0;
        this._updateConfigTablesTimer = -1;
    },

    initUI: function () {
        EnterGameNet.onConnectGameServer();
        //账号信息 保存城堡id
        NetMgr.inst().addEventListener(298, this.netGetAccount, this);
        //NetMgr.inst().addEventListener(299, this.netGetAccount2, this);

        this._scene = NodeUtils.getUI("res/loadingAndLogining/loadingUI.json");

        if (null == this._scene) {
            cc.error("LoadingModule模块加载loadingUI.json失败");
            return;
        }

        this.addChild(this._scene);

        this._panel = this._scene.getChildByName("panel");
        AutoResizeUtils.stretch(this._panel, 3, true, 3);
        AutoResizeUtils.resetNode(this._panel);
        //this._panel.addTouchEventListener(this.onCommonBtnEvtDispatcher, this);

        this.updateLoadingPanel();

        EventMgr.inst().addEventListener(LoadingLocalEvent.LOADING_PROGRESS, this.updateLoadingProgress, this);
        EventMgr.inst().addEventListener(ConfigTableUpdateLocalEvent.PROGRESS_END, this.onLoadingProgressComplete, this);

        var that = this;
        cc.eventManager.addCustomListener(cc.game.EVENT_SHOW, function (event) {
            if (LoadingModule.IS_OPEN) {
                that.checkNetworkStatus(that);
            }
        });

        //获取服务器配置表
        EventMgr.inst().addEventListener(ConfigTableUpdateLocalEvent.PROGRESS_END, this.onLoadingProgressComplete, this);
    },

    updateWaitingTip: function () {
        var tip = ModuleMgr.inst().getData("Loading").getNextTip();
        this._waitingTipUp.setString(tip.up);
        this._waitingTipUpEffectCtrl.play();

        this._waitingTipDown.setString(tip.down);
        this._waitingTipDownEffectCtrl.play();
    },

    //账号信息
    netGetAccount: function (cmd, data) {
        //cc.log("测试 测试账号信息@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
        if (298 == cmd) {
            data.resetCMDData();
            var accountUuid = data.readString();
            var nick = data.readString();
            trace("我的账户信息:",accountUuid,nick);
            //存储账号信息，只更新我的账户信息
            if(SelfData.getInstance().accountId=="" || accountUuid==SelfData.getInstance().accountId){
                SelfData.getInstance().accountId = accountUuid;
                if (nick != "") {
                    SelfData.getInstance().nick = nick;
                }
                var len = data.readUint();
                for (var i = 0; i < len; i++) {
                    var slot = data.readUint();
                    var value = data.readString();
                    if (slot == 399) {
                        LoadingModule.CASTLE_ID = value;
                    }
                    if (slot == 2) {
                        if (value == 0) {
                            value = ResMgr.inst().getCSV("head", 1).head_id;//默认配置第一个  var headArray = ResMgr.inst().getCSV("head");
                        }
                        SelfData.getInstance().headId = value; //头像
                    }
                    if (slot == 303) {
                        SelfData.getInstance().signDays = value; //连续签到天数
                    }
                }
            }

        }
    },
    //netGetAccount2:function(cmd, data) {
    //    cc.log("测试 测试账号信息4444444444444@@@@@@@@")
    //    if (299 == cmd) {
    //        data.resetCMDData();
    //        var data0=data.readString();
    //        var data1=data.readString();
    //        cc.log(data0+"测试"+data1);
    //    }
    //},

    onCommonBtnEvtDispatcher: function (target, type) {
        if (type == ccui.Widget.TOUCH_ENDED) {
            switch (target) {
                case this._panel:
                    break;
                default:
                    break;
            }
        }
    },

    onLoadingProgressComplete: function (event) {
        ModuleMgr.inst().closeModule("Loading", {"closeSound": false});
        ModuleMgr.inst().openModule("Logining", {
            "data": null,
            "openSound": true,
            "auto": LoadingModule.CANCEL_AUTO_LOGIN
        });
    },

    updateLoadingProgress: function (event, progress, code) {
        cc.error("进度:" + progress);
        this._loadingBar.setPercent(parseInt(progress));
        this._loadingTip.setString(progress + "%");

        if (100 == parseInt(progress)) {
            this._loadingTip.setString("正在加载...");
            //this.loadResources();//废弃
            EventMgr.inst().dispatchEvent(LoadingLocalEvent.ASSETS_MANAGER_LOADED_END);
            ModuleMgr.inst().getData("ConfigTableUpdator").loadConfig(GameConfig.tableAddress);
        }
    },

    loadResources: function () {
        var resList = ResMgr.inst().getModuleResources("public");
        if (resList && resList.length > 0) {
            ResMgr.inst().loadList("公共资源", resList,
                function (event, loadName) {
                    if (event == LoadEvent.LOAD_COMPLETE) {
                        //检查本地配置与服务器是不是一致
                        //NetMgr.inst().sendHttp(GameConfig.tableAddress, null, false, this.checkConfig, this.checkConfigFail, this);
                    }
                }, this);
        }
    },

    //2015-10-15 by shenwei
    //WARNING----------------------------------------------------------------------------------------------------------
    //目前为了看到效果用的德州数据测试，只加载txt，实际如果用派克需要加载的csv，json, plist，记得屏蔽//REMOVED ... //REMOVED
    //WARNING----------------------------------------------------------------------------------------------------------
    checkConfig: function (data, owner) {
        var config = ResMgr.inst().getModuleResources("public");
        //REMOVED
//        for(var i = config.length - 1; i >= 0; --i)
//        {
//            var item = config[i];
//            if(".png" == item.substr(item.length - 4, 4))
//            {
//                config.splice(i, 1);
//            }
//            else if(".csv" == item.substr(item.length - 4, 4))
//            {
//                config.splice(i, 1);
//            }
//            else if(".json" == item.substr(item.length - 5, 5))
//            {
//                config.splice(i, 1);
//            }
//            else if(".plist" == item.substr(item.length - 6, 6))
//            {
//                config.splice(i, 1);
//            }
//        }
        //REMOVED

        var serverObj = {};
        var objdata = JSON.parse(data);
        for (var key in objdata) {
            serverObj[key] = objdata[key];
        }

        for (var a = 0; a < config.length; a++) {
            var obj = ResMgr.inst().getRes(config[a]);
            var fileName = StringUtils.getFileName(config[a], "txt");
            if (serverObj[fileName] != hexMd5StringAsUtf8(obj) && serverObj[fileName] != null) {
                owner._updateCount++;
                NetMgr.inst().sendHttp(GameConfig.tableAddress + fileName, null, false, owner.updateConfig, owner.checkConfigFail, [owner, fileName]);
            }
            else {
                if (obj != null) {
                    TabManager.getInstance().setTab(fileName, JSON.parse(obj));//obj.toString()
                }
                else {
                    cc.error("此表不存在:" + fileName);
                }
            }
        }
    },

    checkConfigFail: function (url, status) {
        //如果更新配置表失败,尝试重新进游戏
        var value = ResMgr.inst().getString("denglu_15");
        ModuleMgr.inst().openModule("AlertPanel", {"txt": value, "type": 2});
    },

    updateConfig: function (data, param) {
        TabManager.getInstance().setTab(param[1], JSON.parse(data));
        param[0]._updateCount--;
        if (param[0]._updateCount <= 0) {
            cc.error("资源更新完毕");
            param[0]._updateConfigTablesTimer = setTimeout(function () {
                EventMgr.inst().dispatchEvent(LoadingLocalEvent.CONFIG_TABLE_LOADED_END);
            }, 1800);
        }
    },

    //设置显示对象
    updateLoadingPanel: function () {
        if (!this._panel) {
            cc.error("获取显示对象失败");
            return;
        }

        CD.uniformChildrenStyle(this._panel, this._panel);

        this._bkg = this._panel.getChildByName("bkg");
        CD.adjustBackgroundSize(this._bkg);

        this._preUpTip = this._panel.getChildByName("loading_text_up");
        this._preDownTip = this._panel.getChildByName("loading_text_down");
        this._logo = this._panel.getChildByName("logo");
        this._beauty = this._panel.getChildByName("beauty");
        this._beauty.setVisible(false);
        this._deskLeft = this._panel.getChildByName("desk_left");
        this._deskLeft.setVisible(false);
        this._deskRight = this._panel.getChildByName("desk_right");
        this._deskRight.setVisible(false);
        this._deskMid = this._panel.getChildByName("desk_mid");
        var resize = (CD.screenWidth - this._deskLeft.width * 2) / (CD.gameWidth - this._deskLeft.width * 2) * this._deskMid.getScaleX();
        this._deskMid.setScaleX(resize);
        this._deskMid.setVisible(false);
        this._loadingBarBkg = this._panel.getChildByName("loading_bar_bkg");
        this._loadingBarBkg.setVisible(false);
        this._loadingBar = this._loadingBarBkg.getChildByName("loading_bar");
        this._loadingBar.setVisible(true);
        this._loadingTip = this._panel.getChildByName("loading_tip");
        this._loadingTip.setVisible(false);
        this._waitingTipUp = this._panel.getChildByName("waiting_tip_up");
        this._waitingTipUp.setVisible(false);
        this._waitingTipDown = this._panel.getChildByName("waiting_tip_down");
        this._waitingTipDown.setVisible(false);

        var tip = ModuleMgr.inst().getData("Loading").getNextTip();
        this._waitingTipUp.setString(tip.up);
        this._waitingTipDown.setString(tip.down);
    },

    show: function (data) {
        if (null != data && undefined != data) {
            this._super(data.data, data.openSound);

            LoadingModule.CANCEL_AUTO_LOGIN = data.auto;
            this._preUpTipEffectCtrl = new FadingEffectController(this._preUpTip,
                FadingEffectController.DEFAULT_EFFECT_DURATION,
                FADING_EFFECT_DIR.UP_TO_DOWN,
                FadingEffectController.DEFAULT_EFFECT_DISTANCE);

            this._preDownTipEffectCtrl = new FadingEffectController(this._preDownTip,
                FadingEffectController.DEFAULT_EFFECT_DURATION,
                FADING_EFFECT_DIR.DOWN_TO_UP,
                FadingEffectController.DEFAULT_EFFECT_DISTANCE);

            this._logoEffectCtrl = new FadingEffectController(this._logo,
                FadingEffectController.DEFAULT_EFFECT_DURATION,
                FADING_EFFECT_DIR.DOWN_TO_UP,
                FadingEffectController.DEFAULT_EFFECT_DISTANCE);

            var delay = (FadingEffectController.DEFAULT_EFFECT_DURATION + 2) * 1000;
            this._delayTimer = setTimeout(this.checkNetworkStatus, delay, this);
        }
        else {
            this._super(null, true);
        }
        LoadingModule.IS_OPEN = true;
    },

    checkNetworkStatus: function (owner) {
        if (!SysCall.isNetworkAvailable()) {
            //界面保留，未直接关闭游戏
            //ModuleMgr.inst().openModule("AlertPanel", {"txt":"请确认检查网络是否连接", "type":2});

            //界面保留，未直接关闭游戏
            var value = ResMgr.inst().getString("denglu_16");
            ModuleMgr.inst().openModule("AlertPanel", {"txt": value, "type": 2});
        }
        else {
            owner.isServerConnected();
        }
    },

    isServerConnected: function () {
        var url = "http://" + GameConfig.serverIP_2 + GameConfig.testHttpPort;
        NetMgr.inst().sendHttp(url, null, false, function (data, param) {
                var valid = data.match("Connection refused");
                if (null != valid) {
                    ModuleMgr.inst().getData("Loading").serverConnectedFailedTip();
                }
                else {
                    cc.error("游戏加载正常");
                    param.loadend.apply(param.owner);
                }
            },
            function (url, response) {
                if ("" == response) {
                    cc.error("服务器连接失败");
                    ModuleMgr.inst().getData("Loading").serverConnectedFailedTip();
                }
            },
            {"loadend": this.preloadedDone, "owner": this});
    },

    //连接验证完毕
    preloadedDone: function () {
        this._preUpTip.setVisible(false);
        this._preDownTip.setVisible(false);
        this._logo.setVisible(false);

        this._loadingBarBkg.setVisible(true);
        this._loadingBarBkgEffectCtrl = new FadingEffectController(this._loadingBarBkg,
            FadingEffectController.DEFAULT_EFFECT_DURATION * 2,
            FADING_EFFECT_DIR.DOWN_TO_UP,
            0);

        this._loadingTip.setVisible(true);
        this._loadingTipEffectCtrl = new FadingEffectController(this._loadingTip,
            FadingEffectController.DEFAULT_EFFECT_DURATION * 2,
            FADING_EFFECT_DIR.DOWN_TO_UP,
            0);

        this._bkg.loadTexture("res/loadingAndLogining/loading_beijing.png", ccui.Widget.LOCAL_TEXTURE);

        //开启loading界面时，一定是热更新完毕100后
        EventMgr.inst().dispatchEvent(LoadingLocalEvent.LOADING_PROGRESS, 100);
    },

    showLoadingBar: function () {
        this._loadingBarBkg.setVisible(true);
        this._loadingBar.setVisible(true);
        this._loadingTip.setVisible(true);
    },

    close: function (data) {
        if (null != data && undefined != data) {
            this._super(data.closeSound);
        }
        else {
            this._super(true);
        }
    },

    clean: function () {
        //NetMgr.inst().removeEventListener(298, this.netGetAccount, this);

        NodeUtils.removeUI("res/loadingAndLogining/loadingUI.json");
        //this.unschedule(this.updateWaitingTip);

        this._preUpTipEffectCtrl.destroy();
        this._preUpTipEffectCtrl = null;
        this._preUpTip = null;

        this._preDownTipEffectCtrl.destroy();
        this._preDownTipEffectCtrl = null;
        this._preDownTip = null;

        this._logoEffectCtrl.destroy();
        this._logoEffectCtrl = null;
        this._logo = null;

        this._loadingBarBkgEffectCtrl.destroy();
        this._loadingBarBkgEffectCtrl = null;
        this._loadingBarBkg = null;

        this._loadingTipEffectCtrl.destroy();
        this._loadingTipEffectCtrl = null;
        this._loadingTip = null;

        this._bkg = null;
        this._loadingBar = null;
        this._scene = null;
        this._panel = null;

        if (-1 <= this._delayTimer) {
            clearTimeout(this._delayTimer);
            this._delayTimer = null;
        }

        this._updateCount = null;

        if (-1 <= this._updateConfigTablesTimer) {
            clearTimeout(this._updateConfigTablesTimer);
            this._updateConfigTablesTimer = null;
        }

        LoadingModule.IS_OPEN = false;
    },

    destroy: function () {
        this._super();
        this.clean();

        EventMgr.inst().removeEventListener(ConfigTableUpdateLocalEvent.PROGRESS_END, this.onLoadingProgressComplete, this);
        EventMgr.inst().removeEventListener(LoadingLocalEvent.LOADING_PROGRESS, this.updateLoadingProgress, this);

        //TODO
        EventMgr.inst().removeEventListener(ConfigTableUpdateLocalEvent.PROGRESS_END, this.onLoadingProgressComplete, this);
    }
});
LoadingModule.IS_OPEN = false;
LoadingModule.CASTLE_ID = "4321";
LoadingModule.CANCEL_AUTO_LOGIN = false;
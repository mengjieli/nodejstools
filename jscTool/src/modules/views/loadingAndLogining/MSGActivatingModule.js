/*
**短信激活 2015-9-15 shenwei
*/
var MSGActivatingModule = ModuleBase.extend({

    _scene : null,
    _panel : null,

    _panelEffectCtrl : null,

    _bkg : null,
    _title : null,
    _accountNO : null,
    _inputAccount : null,
    _timeLimit : null,
    _timeLimitEnd : null,//计数冷却结束提示
    _timeLimitEndBottomLine : null,

    _msgInputBkg : null,
    _msgInput : null,
    _msgInputError : null,

    _nextStepBtn : null,

    _login : null,
    _loginBottomLine : null,

    //UI显示调整
    _panelMotionCtrl : null,

    _commonQuitCtrl : null,

    _regainCooldownTime : null,

    _cooldownTimer : null,

    _loginCtlTimer : null,

    ctor : function()
    {
        this._super();
        this._accountNO = "";
        this._regainCooldownTime = 0;
        this._cooldownTimer = -1;
        this._loginCtlTimer = -1;
    },

    initUI : function()
    {
        this._super();

        this._scene = NodeUtils.getUI("res/loadingAndLogining/pwActivatingUI.json");
        if(null == this._scene)
        {
            cc.error("MSGActivatingModule模块加载pwActivatingUI.json失败");
            return;
        }
        this.addChild(this._scene);

        this._panel = this._scene.getChildByName("panel");

        var node = this._panel.getChildByName("title");
        node.setString(ResMgr.inst().getString("denglu_55"));

        node = this._panel.getChildByName("account");
        node.setString(ResMgr.inst().getString("denglu_56"));

        node = this._panel.getChildByName("msg_input");
        node.setPlaceHolder(ResMgr.inst().getString("denglu_57"));

        node = this._panel.getChildByName("time_limit");
        node.setString(ResMgr.inst().getString("denglu_58"));

        node = this._panel.getChildByName("time_limit_end");
        node.setString(ResMgr.inst().getString("denglu_59"));

        node = this._panel.getChildByName("msg_input_error");
        node.setString(ResMgr.inst().getString("denglu_60"));

        node = this._panel.getChildByName("next_btn");
        node.setTitleText(ResMgr.inst().getString("denglu_7"));

        node = this._panel.getChildByName("login");
        node.setString(ResMgr.inst().getString("denglu_61"));


        AutoResizeUtils.stretch(this._panel, 3, true, 3);
        AutoResizeUtils.resetNode(this._panel);
        this.updateActivatingPanel();

        this._commonQuitCtrl = new CommonQuitGame(this);
        NetMgr.inst().addEventListener(LoginingNetEvent.PES_LOGIN, this.onLoginNotifier, this);
        SysCall.setCustomIMEMode(1);
    },

    updateActivatingPanel : function()
    {
         if(!this._panel)
         {
             cc.error("获取显示对象失败");
             return;
         }

         CD.uniformChildrenStyle(this._panel, this._panel);
         this._panel.addTouchEventListener(this.onCommonBtnEvtDispatcher, this);

         this._bkg = this._panel.getChildByName("bkg");
         this._bkg.attr({"originPoX":this._bkg.x, "originPoY":this._bkg.y});
         CD.adjustBackgroundSize(this._bkg);

         this._title = this._panel.getChildByName("title");
         this._title.attr({"originPoX":this._title.x, "originPoY":this._title.y});
         this._title.setContentSize(cc.size(400, 30));

         this._inputAccount = this._panel.getChildByName("account");
         this._inputAccount.attr({"originPoX":this._inputAccount.x, "originPoY":this._inputAccount.y});
         this._inputAccount.setContentSize(cc.size(386, 20));

         this._timeLimit = this._panel.getChildByName("time_limit");
         this._timeLimit.attr({"originPoX":this._timeLimit.x, "originPoY":this._timeLimit.y});
         this._timeLimit.setContentSize(cc.size(165, 22));

         this._timeLimitEnd = this._panel.getChildByName("time_limit_end");
         this._timeLimitEnd.attr({"originPoX":this._timeLimit.x, "originPoY":this._timeLimit.y});
         this._timeLimitEnd.setTouchEnabled(true);
         this._timeLimitEnd.addTouchEventListener(this.onCommonBtnEvtDispatcher, this);
         this._timeLimitEnd.setVisible(false);

         this._timeLimitEndBottomLine = this._panel.getChildByName("time_limit_end_bottom_line");
         this._timeLimitEndBottomLine.attr({"originPoX":this._timeLimitEndBottomLine.x, "originPoY":this._timeLimitEndBottomLine.y});
         this._timeLimitEndBottomLine.setVisible(false);

         this._msgInputBkg = this._panel.getChildByName("msg_input_bkg");
         this._msgInputBkg.attr({"originPoX":this._msgInputBkg.x, "originPoY":this._msgInputBkg.y});
         this._msgInputBkg.setTouchEnabled(true);
         this._msgInputBkg.addTouchEventListener(this.onCommonBtnEvtDispatcher, this);

         this._msgInput = this._panel.getChildByName("msg_input");
         this._msgInput.attr({"originPoX":this._msgInput.x, "originPoY":this._msgInput.y});
         this._msgInput.addTouchEventListener(this.onCommonBtnEvtDispatcher, this);

         this._msgInputError = this._panel.getChildByName("msg_input_error");
         this._msgInputError.attr({"originPoX":this._msgInputError.x, "originPoY":this._msgInputError.y});
         this._msgInputError.setContentSize(cc.size(396, 20));
         this._msgInputError.setVisible(false);

         this._nextStepBtn = this._panel.getChildByName("next_btn");
         this._nextStepBtn.attr({"originPoX":this._nextStepBtn.x, "originPoY":this._nextStepBtn.y});
         this._nextStepBtn.addTouchEventListener(this.onCommonBtnEvtDispatcher, this);

         this._login = this._panel.getChildByName("login");
         this._login.attr({"originPoX":this._login.x, "originPoY":this._login.y});
         this._login.setTouchEnabled(true);
         this._login.addTouchEventListener(this.onCommonBtnEvtDispatcher, this);

         this._loginBottomLine = this._panel.getChildByName("login_bottom_line");
         this._loginBottomLine.attr({"originPoX":this._loginBottomLine.x, "originPoY":this._loginBottomLine.y});

         this._panelMotionCtrl = new KeyboardPanController(this._panel, 160, 0.08);
    },

    onCommonBtnEvtDispatcher : function(target, type)
    {
        if(ccui.Widget.TOUCH_ENDED == type)
        {
            switch(target)
            {
                case this._panel:
                    this._panelMotionCtrl.adjustLayoutOnIMEShown(false, "bkg");
                    break;
                 case this._msgInputBkg:
                    this._msgInput.attachWithIME();
                    if(!this._panelMotionCtrl.getIMEStatus())
                    {
                        this._msgInputError.setVisible(false);
                        this._panelMotionCtrl.adjustLayoutOnIMEShown(true, "bkg");
                    }
                    break;
                 case this._msgInput:
                    if(!this._panelMotionCtrl.getIMEStatus())
                     {
                         this._msgInputError.setVisible(false);
                         this._panelMotionCtrl.adjustLayoutOnIMEShown(true, "bkg");
                     }
                    break;
                 case this._login:
                    this._login.setOpacity(255);
                    this._loginBottomLine.setOpacity(255);
                    ModuleMgr.inst().closeModule("MSGActivating", {"closeSound":false});
                    ModuleMgr.inst().openModule("Logining", {"data":null, "openSound":true});
                    break;
                 case this._nextStepBtn://UI改变---下一步(原始)--->登录(当前)
                    SysCall.closeCustomIMEMode();
                    this._panelMotionCtrl.adjustLayoutOnIMEShown(false, "bkg");
                    this.loginCheck();
                    break;
                 case this._timeLimitEnd:
                    this._timeLimitEnd.setOpacity(255);
                    this._timeLimitEndBottomLine.setOpacity(255);
                    this.retrieveSMS();
                    break;
                 default:
                    break;
            }
        }
        else if(ccui.Widget.TOUCH_BEGAN == type)
        {
            switch(target)
            {
                case this._login:
                    this._login.setOpacity(128);
                    this._loginBottomLine.setOpacity(128);
                    break;
                case this._timeLimitEnd:
                    this._timeLimitEnd.setOpacity(128);
                    this._timeLimitEndBottomLine.setOpacity(128);
                    break;
                default:
                    break;
            }
        }
        else if(ccui.Widget.TOUCH_CANCELED == type)
        {
            switch(target)
            {
                case this._login:
                    this._login.setOpacity(255);
                    this._loginBottomLine.setOpacity(255);
                    break;
                case this._timeLimitEnd:
                    this._timeLimitEnd.setOpacity(255);
                    this._timeLimitEndBottomLine.setOpacity(255);
                    break;
                default:
                    break;
            }
        }
    },

    onLoginNotifier : function(cmd, data)
    {
        if(LoginingNetEvent.PES_LOGIN == cmd)
        {
            data.resetCMDData();
            SelfData.getInstance().accountId = data.readString();
            cc.error("当前数字账号:" + SelfData.getInstance().accountId);
            data.resetCMDData();


            //等待网络消息返回
            new EnterGameNet(function(){
                ModuleMgr.inst().closeModule("NetworkWaitModule");
                ModuleMgr.inst().closeModule("MSGActivating", {"closeSound":false});
                //ModuleMgr.inst().openModule("MapModule");


                ModuleMgr.inst().openModule("CastleModule");
                ModuleMgr.inst().openModule("MainResourcesModule");
                ModuleMgr.inst().openModule("MainMenuModule");
                ModuleMgr.inst().openModule("BattleUIModule");//战斗UI

                //test
                //ModuleMgr.inst().getData("ItemModule").loadItem();
                //ModuleMgr.inst().openModule("StoreModule");//测试用

                //ModuleMgr.inst().openModule("BigMapModule");
            });
            //ModuleMgr.inst().openModule("MapModule");
        }
    },

    loginRequest : function()
    {
        ReconnectionMgr.getInstance();
        NetMgr.inst().connectWebSocket(GameConfig.serverAddress);
        SelfData.getInstance().platformId = GameConfig.PLATFORM_DEFAULT_ID;
        SelfData.getInstance().username = this._accountNO;

        var send = function(owner)
        {
            var account = owner._accountNO;
            var password = owner._msgInput.getString();
            var token = SelfData.getInstance().token;
            cc.error("token:" + token);
            cc.error("account:" + account);
            cc.error("password:" + password);
            owner.recordUserInfo([account, password, token]);

            var msg = new SocketBytes();
            msg.writeUint(LoginingNetEvent.PEC_LOGIN);
            msg.writeUint(SelfData.getInstance().platformId);
            msg.writeString(account);
            msg.writeString(token);
            NetMgr.inst().send(msg);
        }

        ModuleMgr.inst().openModule("NetworkWaitModule");
        this._loginCtlTimer = setTimeout(send, 500, this);
    },

    //登录
    loginCheck : function()
    {
        var cache = this.fetchUserInfo();
        if(null != cache && undefined != cache)
        {
            SelfData.getInstance().token = cache.token;
        }
        else
        {
            SelfData.getInstance().token = CD.genRandToken();
        }

        var head = GameConfig.PLATFORM_AUTHENTICATE_ADDR + "login";
        var url = head;
        url += "?accountName=" + this._accountNO;
        url += "&password=" + this._msgInput.getString();
        url += "&token=" + SelfData.getInstance().token;

        NetMgr.inst().sendHttp(url, null, false, function(data, param){
            cc.error("接收:" + data);
            var objAssert = function(obj)
            {
                return (null != obj && undefined != obj) ? true : false;
            }

            var uiError = function(obj, errMsg)
            {
                 if(objAssert(obj))
                 {
                     param.objs[0].setAnchorPoint(0.5, 0.5);
                     param.objs[0].setFontSize(20);
                     param.objs[0].setString(errMsg);
                     param.objs[0].setContentSize(cc.size(396, 20));
                     param.objs[0].setVisible(true);
                 }
            }

            var ret = JSON.parse(data);
            if(ret)
            {
                switch(ret.errCode)
                {
                    case 80102:
                       ModuleMgr.inst().closeModule("NetworkWaitModule");
                        var value = ResMgr.inst().getString("denglu_17");
                        var value1 = ResMgr.inst().getString("denglu_18");
                       uiError(param.objs[0], value + ret.retryCount + value1 );
                       break;
                    case 80110:
                       ModuleMgr.inst().closeModule("NetworkWaitModule");
                        var value = ResMgr.inst().getString("denglu_26");
                        uiError(param.objs[0], value);
                       break;
                    case 80105:
                       ModuleMgr.inst().closeModule("NetworkWaitModule");
                        var value = ResMgr.inst().getString("denglu_19");
                        uiError(param.objs[0], value );
                       break;
                    case 0:
                        cc.error("用户登录验证成功，登录ing");
                       param.loginRequest.apply(param.owner);
                       break;
                    default:
                       break;
                }
            }
            else
            {
                ModuleMgr.inst().closeModule("NetworkWaitModule");
                var value = ResMgr.inst().getString("denglu_20");
                ModuleMgr.inst().openModule("AlertPanel", {"txt":value, "type":2});
            }
        }, null, {"objs":[this._msgInputError], "loginRequest":this.loginRequest, "owner":this});
    },

    retrieveSMS : function()
    {
        var head = GameConfig.PLATFORM_AUTHENTICATE_ADDR + "regain";
        var url = head;
        url += "?accountName=" + this._accountNO;

        NetMgr.inst().sendHttp(url, null, false, function(data, param){
                 cc.error("接收:" + data);
                 var objAssert = function(obj)
                 {
                     return (null != obj && undefined != obj) ? true : false;
                 }

                 var uiError = function(obj, errMsg)
                 {
                      if(objAssert(obj))
                      {
                          param.objs[0].setAnchorPoint(0.5, 0.5);
                          param.objs[0].setFontSize(20);
                          param.objs[0].setString(errMsg);
                          param.objs[0].setContentSize(cc.size(396, 20));
                          param.objs[0].setVisible(true);
                      }
                 }

                 var ret = JSON.parse(data);
                 if(ret)
                 {
                     switch(ret.errCode)
                     {
                         case 0:
                             cc.error("重新发送短信");
                             cc.error("短信有效时间:" + ret.disposablePasswordExpiryDuration);
                             param.showTimer.apply(param.owner, [ret.passwordRegainCooldown]);
                             break;
                         default:
                             break;
                     }
                 }
             }, null, {"objs":[this._msgInputError], "showTimer":this.showCooldownTimer, "owner":this}
        );
    },

    showCooldownTimer : function(v)
    {
        this._timeLimitEnd.setVisible(false);
        this._timeLimitEndBottomLine.setVisible(false);
        this._regainCooldownTime = v / 1000;
        this._timeLimit.attr({"countdown":this._regainCooldownTime});
        this._cooldownTimer = setInterval(this.updateCooldownTip, 1000, this);
    },

    recordUserInfo : function(info)
    {
        cc.error("info:" + JSON.stringify(info));
        var storagePath = jsb.fileUtils ? jsb.fileUtils.getWritablePath() : "./";
        var file = jsb.fileUtils.writeToFile({"lastLoginName":info[0], "lastLoginPassword":info[1], "lastLoginToken":info[2]}, storagePath + LoginingModule.LOGIN_HISTORY_INI);
    },

    fetchUserInfo : function()
    {
        var storagePath = jsb.fileUtils ? jsb.fileUtils.getWritablePath() : "./";
        var fileExist = jsb.fileUtils.isFileExist(storagePath + LoginingModule.LOGIN_HISTORY_INI);
        cc.error("文件存在标识:" + storagePath);

        if(fileExist)
        {
            var string = jsb.fileUtils.getValueMapFromFile(storagePath + LoginingModule.LOGIN_HISTORY_INI);
            cc.error("cache:" + JSON.stringify(string["lastLoginName"]) + "_" + (string["lastLoginPassword"]) + "_" + (string["lastLoginToken"]));
            return {"username":string["lastLoginName"], "password":string["lastLoginPassword"], "token":string["lastLoginToken"]};
        }
        return null;
    },

    show : function(data)
    {
        if(null != data && undefined != data)
        {
            this._super(data.data, data.openSound);

            this._panelEffectCtrl = new FadingEffectController(this._panel,
            FadingEffectController.DEFAULT_EFFECT_DURATION * 2,
            FADING_EFFECT_DIR.DOWN_TO_UP,
            0);

            this._accountNO = data.inputAccount;
            var value = ResMgr.inst().getString("denglu_27");
            this._inputAccount.setString(value + ":" + this._accountNO);
            this._inputAccount.setContentSize(cc.size(386, 20));

            this.showCooldownTimer(data.regainCooldownTime);
        }
        else
        {
            this._super(null, true);
        }
    },

    updateCooldownTip : function(owner)
    {
        if(owner)
        {
            var count = --owner._timeLimit.countdown;
            if(0 <= count)
            {
                if(!owner._timeLimit.isVisible())
                {
                    owner._timeLimit.setVisible(true);
                }
                var value = ResMgr.inst().getString("denglu_28");
                owner._timeLimit.setString(count + value );
                owner._timeLimit.setContentSize(cc.size(165, 22));
            }
            else
            {
                clearInterval(owner._cooldownTimer);
                owner._cooldownTimer = -1;
                owner._timeLimitEnd.setVisible(true);
                owner._timeLimitEndBottomLine.setVisible(true);
                owner._timeLimit.setVisible(false);
            }
        }
    },

    close : function(data)
    {
        if(null != data && undefined != data)
        {
            this._super(data.closeSound);
        }
        else
        {
            this._super(true);
        }
    },

    clean : function()
    {
        NodeUtils.removeUI("res/loadingAndLogining/pwActivatingUI.json");

        this._title = null;
        this._inputAccount = null;
        this._accountNO = null;
        this._timeLimit = null;
        this._timeLimitEnd = null;
        this._timeLimitEndBottomLine = null;

        this._msgInputBkg = null;
        this._msgInput = null;
        this._msgInputError = null;

        this._nextStepBtn = null;

        this._login = null;
        this._loginBottomLine = null;

        this._panelEffectCtrl.destroy();
        this._panelEffectCtrl = null;

        this._panelMotionCtrl.destroy();
        this._panelMotionCtrl = null;

        this._regainCooldownTime = null;
        if(-1 != this._cooldownTimer)
        {
            clearInterval(this._cooldownTimer);
        }
        this._cooldownTimer = null;

        if(-1 != this._loginCtlTimer)
        {
            clearTimeout(this._loginCtlTimer);
            this._loginCtlTimer = null;
        }

        this._bkg = null;
        this._scene = null;
        this._panel = null;
    },

    destroy : function()
    {
        this._super();
        this.clean();
        NetMgr.inst().removeEventListener(LoginingNetEvent.PES_LOGIN, this.onLoginNotifier, this);
        this._commonQuitCtrl.destroy();
        this._commonQuitCtrl = null;
        SysCall.setCustomIMEMode(0);
        SysCall.closeCustomIMEMode();
    }
});

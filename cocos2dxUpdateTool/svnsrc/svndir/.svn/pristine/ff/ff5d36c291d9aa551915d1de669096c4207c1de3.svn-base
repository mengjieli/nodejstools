/*
**登陆/注册模块 2015-9-7 shenwei
*/
var LoginingModule = ModuleBase.extend({

    _scene : null,
    _panel : null,
    _panelEffectCtrl : null,

    //UI显示调整
    _panelMotionCtrl : null,

    _bkg : null,
    _logo : null,

    _accountInputBkg : null,
    _accountInput : null,
    _accountErrorTip : null,

    _passwordInputBkg : null,
    _passwordInput : null,
    _passwordErrorTip : null,

    _loginBtn : null,

    _register : null,
    _registerBottomLine : null,
    _findLost : null,
    _findLostBottomLine : null,

    _isIMEOpened : null,

    _arrUIActions : null,

    //账号/密码 验证
    _isAccountNOChecked : null,
    _isPasswordChecked : null,
    _loginCtlTimer : null,

    _commonQuitCtrl : null,

    _cancelAutoLogin:null,

    ctor : function()
    {
        this._super();

        this._isIMEOpened = false;
        this._arrUIActions = [];

        this._isAccountNOChecked = false;
        this._isPasswordChecked = false;

        this._loginCtlTimer = -1;
    },

    initUI : function()
    {
        this._super();

        this._scene = NodeUtils.getUI("res/loadingAndLogining/loginingUI.json");

        if(null == this._scene)
        {
            cc.error("LoginingModule模块加载loginingUI.json失败");
            return;
        }

        this.addChild(this._scene);

        this._panel = this._scene.getChildByName("panel");
        AutoResizeUtils.stretch(this._panel, 3, true, 3);
        AutoResizeUtils.resetNode(this._panel);
        this.updateLoginingPanel();


        var node = this._panel.getChildByName("accountId");
        node.setPlaceHolder(ResMgr.inst().getString("denglu_46"));

        var node = this._panel.getChildByName("password");
        node.setPlaceHolder(ResMgr.inst().getString("denglu_47"));

        var node = this._panel.getChildByName("login_btn");
        node.setTitleText(ResMgr.inst().getString("denglu_7") );

        var node = this._panel.getChildByName("register_account");
        node.setString(ResMgr.inst().getString("denglu_48") );

        var node = this._panel.getChildByName("find_pw");
        node.setString(ResMgr.inst().getString("denglu_49") );

        var node = this._panel.getChildByName("account_error");
        node.setString(ResMgr.inst().getString("denglu_53") );

        var node = this._panel.getChildByName("pw_error");
        node.setString(ResMgr.inst().getString("denglu_54") );


        NetMgr.inst().addEventListener(LoginingNetEvent.PES_LOGIN, this.onLoginNotifier, this);
        this._panelMotionCtrl = new KeyboardPanController(this._panel, 160, 0.08);
        this._commonQuitCtrl = new CommonQuitGame(this);
        SysCall.setCustomIMEMode(1);
    },

    forceQuitGame : function()
    {
        cc.error("是否结束?");
        cc.director.end();
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
                ModuleMgr.inst().closeModule("Logining", {"closeSound":false});
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
        }
	},

    updateLoginingPanel : function()
    {
        if(!this._panel)
        {
            cc.error("获取显示对象失败");
            return;
        }
        this._panel.addTouchEventListener(this.onCommonBtnEvtDispatcher, this);

        CD.uniformChildrenStyle(this._panel, this._panel);

        this._logo = this._panel.getChildByName("logo");
        this._logo.attr({"originPoX":this._logo.x, "originPoY":this._logo.y});

        this._bkg = this._panel.getChildByName("bkg");
        this._bkg.attr({"originPoX":this._bkg.x, "originPoY":this._bkg.y});
        CD.adjustBackgroundSize(this._bkg);

        this._accountInputBkg = this._panel.getChildByName("accountId_bkg");
        this._accountInputBkg.setTouchEnabled(true);
        this._accountInputBkg.addTouchEventListener(this.onCommonBtnEvtDispatcher, this);
        this._accountInputBkg.attr({"originPoX":this._accountInputBkg.x, "originPoY":this._accountInputBkg.y});
        this._accountInput = this._panel.getChildByName("accountId");
        this._accountInput.addTouchEventListener(this.onCommonBtnEvtDispatcher, this);
        this._accountInput.attr({"originPoX":this._accountInput.x, "originPoY":this._accountInput.y});
        this._accountErrorTip = this._panel.getChildByName("account_error");
        this._accountErrorTip.setVisible(false);
        this._accountErrorTip.attr({"originPoX":this._accountErrorTip.x, "originPoY":this._accountErrorTip.y});
        this._accountErrorTip.setContentSize(cc.size(393, 22));

        this._passwordInputBkg = this._panel.getChildByName("password_bkg");
        this._passwordInputBkg.setTouchEnabled(true);
        this._passwordInputBkg.addTouchEventListener(this.onCommonBtnEvtDispatcher, this);
        this._passwordInputBkg.attr({"originPoX":this._passwordInputBkg.x, "originPoY":this._passwordInputBkg.y});
        this._passwordInput = this._panel.getChildByName("password");
        this._passwordInput.addTouchEventListener(this.onCommonBtnEvtDispatcher, this);
        this._passwordInput.attr({"originPoX":this._passwordInput.x, "originPoY":this._passwordInput.y});
        this._passwordErrorTip = this._panel.getChildByName("pw_error");
        this._passwordErrorTip.setVisible(false);
        this._passwordErrorTip.attr({"originPoX":this._passwordErrorTip.x, "originPoY":this._passwordErrorTip.y});
        this._passwordErrorTip.setContentSize(cc.size(393, 22));

        this._loginBtn = this._panel.getChildByName("login_btn");
        this._loginBtn.addTouchEventListener(this.onCommonBtnEvtDispatcher, this);
        this._loginBtn.attr({"originPoX":this._loginBtn.x, "originPoY":this._loginBtn.y});
        this._loginBtn.setSwallowTouches(true);

        this._register = this._panel.getChildByName("register_account");
        this._register.setTouchEnabled(true);
        this._register.addTouchEventListener(this.onCommonBtnEvtDispatcher, this);
        this._register.attr({"originPoX":this._register.x, "originPoY":this._register.y});
        this._registerBottomLine = this._panel.getChildByName("green_line");
        this._registerBottomLine.attr({"originPoX":this._registerBottomLine.x, "originPoY":this._registerBottomLine.y});

        this._lost = this._panel.getChildByName("find_pw");
        this._lost.setTouchEnabled(true);
        this._lost.addTouchEventListener(this.onCommonBtnEvtDispatcher, this);
        this._lost.attr({"originPoX":this._lost.x, "originPoY":this._lost.y});
        this._findLostBottomLine = this._panel.getChildByName("gray_line");
        this._findLostBottomLine.attr({"originPoX":this._findLostBottomLine.x, "originPoY":this._findLostBottomLine.y});
    },

	//验证方式: mode
    //_loginBtn 2级 2
    //_panel    1级 1
    checkAccountNO : function(mode)
    {
        ModuleMgr.inst().openModule("NetworkWaitModule");

        var account = this._accountInput.getString();
        if(0 == account.length || !CD.isPhoneNum(account))
        {
            this._accountErrorTip.setVisible(true);
            this._isAccountNOChecked = false;
            ModuleMgr.inst().closeModule("NetworkWaitModule");
            return;
        }

        var head = GameConfig.PLATFORM_AUTHENTICATE_ADDR + "check";
        var url = head;
        url += "?accountName=" + account;

        NetMgr.inst().sendHttp(url, null, false, function(data, param){
                cc.error("data:" + data);
                var objAssert = function(obj)
                {
                    return (null != obj && undefined != obj) ? true : false;
                }
                var ret = JSON.parse(data);
                if(ret)
                {
                    if(0 == ret.errCode)
                    {
                        //用户名不存在
                        if(objAssert(param.objs[0]))
                        {
                            param.objs[0].setVisible(true);
                            ModuleMgr.inst().closeModule("NetworkWaitModule");
                        }
                    }
                    else
                    {
                        if(objAssert(param.objs[0]))
                        {
                            param.objs[0].setVisible(false);
                        }
                        param.onAccountStatus.apply(param.owner, [true, mode, account]);
                    }
                }
            }, null, {"objs":[this._accountErrorTip], "onAccountStatus":this.setAccountStatus, "owner":this}
        );
    },

    setAccountStatus : function(v1, v2, v3)
    {
        this._isAccountNOChecked = v1;
        if(2 == v2)
        {
            this.checkAccountPW();
        }
        ModuleMgr.inst().closeModule("NetworkWaitModule");
    },

    checkPassword : function()
    {
        var password = this._passwordInput.getString();
        if(0 == password.length)
        {
            this._passwordErrorTip.setVisible(true);
            this._isPasswordChecked = false;
            return;
        }
        else
        {
            this._passwordErrorTip.setVisible(false);
            this._isPasswordChecked = true;
        }
    },

    loginRequest : function()
    {
        ReconnectionMgr.getInstance();
        NetMgr.inst().connectWebSocket(GameConfig.serverAddress);
        SelfData.getInstance().platformId = GameConfig.PLATFORM_DEFAULT_ID;
        SelfData.getInstance().username = this._accountInput.getString();

        var send = function(owner)
        {
            var account = owner._accountInput.getString();
            var password = owner._passwordInput.getString();
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

        this._loginCtlTimer = setTimeout(send, 500, this);
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

    recordUserInfo : function(info)
    {
        cc.error("info:" + JSON.stringify(info));
        var storagePath = jsb.fileUtils ? jsb.fileUtils.getWritablePath() : "./";
        var file = jsb.fileUtils.writeToFile({"lastLoginName":info[0], "lastLoginPassword":info[1], "lastLoginToken":info[2]}, storagePath + LoginingModule.LOGIN_HISTORY_INI);
    },

	//登录
	checkAccountPW : function()
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
        url += "?accountName=" + this._accountInput.getString();
        url += "&password=" + this._passwordInput.getString();
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
                     param.objs[0].setFontSize(22);
                     param.objs[0].setString(errMsg);
                     param.objs[0].setContentSize(cc.size(393, 22));
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
                       uiError(param.objs[0], value + ret.retryCount + value1);
                       break;
                    case 80105:
                       ModuleMgr.inst().closeModule("NetworkWaitModule");
                        var value = ResMgr.inst().getString("denglu_19");
                        uiError(param.objs[0], value);
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
        }, null, {"objs":[this._passwordErrorTip], "loginRequest":this.loginRequest, "owner":this});
	},

    showUIObjs : function(show)
    {
        var childs = this._panel.getChildren();
        for(var i = 0; i < childs.length; ++i)
        {
            childs[i].setVisible(show);
        }
        this._accountErrorTip.setVisible(false);
        this._passwordErrorTip.setVisible(false);
    },

    //历史登陆存在
    autoLoginAuthenticate : function()
    {
        var cache = this.fetchUserInfo();
        if(cache)
        {
            this.showUIObjs(false);
            ModuleMgr.inst().openModule("NetworkWaitModule");
            var accountId = cache.username;
            var password = cache.password;
            var oldToken = cache.token;
            var token = CD.genRandToken();
            var head = GameConfig.PLATFORM_AUTHENTICATE_ADDR + "renewal";
            var url = head;
            url += "?accountName=" + accountId;
            url += "&oldToken=" + oldToken;
            url += "&token=" + token;

            NetMgr.inst().sendHttp(url, null, false, function(data, param){
                cc.error("收到:" + data);
                var objAssert = function(obj)
                {
                    return (null != obj && undefined != obj) ? true : false;
                }

                var ret = JSON.parse(data);
                if(ret)
                {
                    switch(ret.errCode)
                    {
                        case 0:
                            cc.error("身份刷新成功，登陆ing");
                            param.changeMode.apply(param.owner, [accountId, password, token]);
                            break;
                        case 80101:
                            var value = ResMgr.inst().getString("denglu_21");
                            ModuleMgr.inst().openModule("AlertPanel", {"txt":value, "type":2});
                            ModuleMgr.inst().closeModule("NetworkWaitModule");
                            param.showPanel.apply(param.owner, [true]);
                            break;
                        case 80103:
                        case 80108:
                            var value = ResMgr.inst().getString("denglu_22");
                            ModuleMgr.inst().openModule("AlertPanel", {"txt":value, "type":2});
                            ModuleMgr.inst().closeModule("NetworkWaitModule");
                            param.showPanel.apply(param.owner, [true]);
                            break;
                        default:
                            var value = ResMgr.inst().getString("denglu_23");
                            ModuleMgr.inst().openModule("AlertPanel", {"txt":value + ret.errCode, "type":2});
                            param.showPanel.apply(param.owner, [true]);
                            ModuleMgr.inst().closeModule("NetworkWaitModule");
                            break;
                    }
                }
                else
                {
                    ModuleMgr.inst().closeModule("NetworkWaitModule");
                    var value = ResMgr.inst().getString("denglu_24");
                    ModuleMgr.inst().openModule("AlertPanel", {"txt":value, "type":2});
                }

            },
            function(url, response)
            {
                if("" == response)
                {
                    cc.error("服务器连接失败");
                    var value = ResMgr.inst().getString("denglu_25");
                    ModuleMgr.inst().openModule("AlertPanel", {"txt":value, "type":2, "okFun":function(){cc.director.end()}});
                }
            },
            {"objs":[this._panel], "changeMode":this.autoLoginPrepare, "showPanel":this.showUIObjs, "owner":this});
        }
    },

    autoLoginPrepare : function(v1, v2, v3)
    {
        cc.error("ac:" + v1);
        cc.error("pw:" + v2);
        cc.error("tok:" + v3);
        this._accountInput.setString(v1);
        this._passwordInput.setString(v2);
        SelfData.getInstance().token = v3;

        this.loginRequest();
    },

    onCommonBtnEvtDispatcher : function(target, type)
    {
        if(type == ccui.Widget.TOUCH_ENDED)
        {
            NodeUtils.playButtonSoundEffect();
            switch(target)
            {
                case this._panel:
                    cc.error("panel");
                    this.checkAccountNO(1);
                    this.checkPassword();
                    this._panelMotionCtrl.adjustLayoutOnIMEShown(false, "bkg");
                    break;
                case this._accountInputBkg:
                    cc.error("accountInputBkg");
                    if(!this._panelMotionCtrl.getIMEStatus())
                    {
                        this._accountErrorTip.setVisible(false);
                        this._panelMotionCtrl.adjustLayoutOnIMEShown(true, "bkg");
                    }
                    this._accountInput.attachWithIME();
                    break;
                case this._accountInput:
                    cc.error("accountInput");
                    if(!this._panelMotionCtrl.getIMEStatus())
                    {
                        this._accountErrorTip.setVisible(false);
                        this._panelMotionCtrl.adjustLayoutOnIMEShown(true, "bkg");
                    }
                    break;
                case this._passwordInputBkg:
                    cc.error("passwordInputBkg");
                    if(!this._panelMotionCtrl.getIMEStatus())
                    {
                        this._passwordErrorTip.setVisible(false);
                        this._panelMotionCtrl.adjustLayoutOnIMEShown(true, "bkg");
                    }
                    this._passwordInput.attachWithIME();
                    break;
                case this._passwordInput:
                    cc.error("passwordInput");
                    if(!this._panelMotionCtrl.getIMEStatus())
                    {
                        this._passwordErrorTip.setVisible(false);
                        this._panelMotionCtrl.adjustLayoutOnIMEShown(true, "bkg");
                    }
                    break;
                case this._loginBtn:
                    cc.error("loginBtn");
                    SysCall.closeCustomIMEMode();
                    this._panelMotionCtrl.adjustLayoutOnIMEShown(false, "bkg");
                    ModuleMgr.inst().openModule("NetworkWaitModule");
                    if(this._isAccountNOChecked) this.checkAccountPW();
                    else this.checkAccountNO(2);
                    break;
                case this._register:
                    cc.error("register");
                    this._register.setOpacity(255);
                    this._registerBottomLine.setOpacity(255);
                    ModuleMgr.inst().closeModule("Logining", {"closeSound":false});
                    ModuleMgr.inst().openModule("Registering", {"data":null, "openSound":true});
                    break;
                case this._lost:
                    cc.error("lost");
                    this._lost.setOpacity(255);
                    this._findLostBottomLine.setOpacity(255);
                    ModuleMgr.inst().closeModule("Logining", {"closeSound":false});
                    ModuleMgr.inst().openModule("Retrieving", {"data":null, "openSound":true});
                    break;
                default:
                    break;
            }
        }
        else if(type == ccui.Widget.TOUCH_BEGAN)
        {
            switch(target)
            {
                case this._register:
                    this._register.setOpacity(128);
                    this._registerBottomLine.setOpacity(128);
                    break;
                case this._lost:
                    this._lost.setOpacity(128);
                    this._findLostBottomLine.setOpacity(128);
                    break;
                default:
                    break;
            }
        }
        else if(type == ccui.Widget.TOUCH_CANCELED)
        {
            this._register.setOpacity(255);
            this._registerBottomLine.setOpacity(255);
            this._lost.setOpacity(255);
            this._findLostBottomLine.setOpacity(255);
        }
        else if(type == ccui.Widget.TOUCH_MOVED)
        {
        }
    },

    show : function(data)
    {
        if(null != data && undefined != data)
        {
            this._super(data.data, data.openSound);

            this._cancelAutoLogin = data.auto;

            this._panelEffectCtrl = new FadingEffectController(this._panel,
            FadingEffectController.DEFAULT_EFFECT_DURATION * 2,
            FADING_EFFECT_DIR.DOWN_TO_UP,
            0);

            //注销游戏，取消自动登录
            if(!this._cancelAutoLogin) {
                this.autoLoginAuthenticate();
            }

        }
        else
        {
            this._super(null, true);
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
        NodeUtils.removeUI("res/loadingAndLogining/loginingUI.json");
        if(-1 != this._loginCtlTimer)
        {
            clearTimeout(this._loginCtlTimer);
            this._loginCtlTimer = null;
        }

        this._panelEffectCtrl.destroy();
        this._panelEffectCtrl = null;

        this._logo = null;
        this._bkg = null;

        this._accountInputBkg = null;
        //detachWithIME() cocos2d-js3.6版本bug，无法调用成功
        //this._accountInput.detachWithIME();
        this._accountInput = null;
        this._accountErrorTip = null;

        this._passwordInputBkg = null;
        //this._passwordInput.detachWithIME();
        this._passwordInput = null;
        this._passwordErrorTip = null;

        this._loginBtn = null;

        this._register = null;
        this._registerBottomLine = null;

        this._lost = null;
        this._findLostBottomLine = null;

        this._panelMotionCtrl.destroy();
        this._panelMotionCtrl = null;

        this._scene = null;
        this._panel = null;

        this._isIMEOpened = null;
        this._arrUIActions = null;

        this._isAccountNOChecked = null;
        this._isPasswordChecked = null;
    },

    destroy : function()
    {
        this._super();
        this.clean();
        NetMgr.inst().removeEventListener(LoginingNetEvent.PES_LOGIN, this.onLoginNotifier, this);
        //防止删游戏登录后的事件
        //this._commonQuitCtrl.destroy();
        this._commonQuitCtrl = null;
        SysCall.setCustomIMEMode(0);
        SysCall.closeCustomIMEMode();
    }
});
//缓存
LoginingModule.LOGIN_HISTORY_INI = "cache";
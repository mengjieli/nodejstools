/*
** 快速登陆模块 2015-9-10 shenwei
*/
var RegisteringModule = ModuleBase.extend({

    _scene : null,
    _panel : null,

    _panelEffectCtrl : null,

    _bkg : null,
    _logo : null,
    _accountInputBkg : null,
    _accountInput : null,

    _invitationCodeInputBkg : null,
    _invitationCodeInput : null,
    _invitationCodeError : null,

    _accountInputError : null, //包括错误提示以及正常提醒
    _findLostAccount : null,
    _findLostBottomLine : null,

    _fastRegisterBtn : null,
    _tipLeft : null,
    _tipRight : null,

    _login : null,
    _loginBottomLine : null,

    //UI显示调整
    _panelMotionCtrl : null,

    //登陆信息
    _loginAccount : null,
    _loginToken : null,

    _commonQuitCtrl : null,

    ctor : function()
    {
        this._super();
    },

    initUI : function()
    {
        this._super();

        this._scene = NodeUtils.getUI("res/loadingAndLogining/registeringUI.json");

        if(null == this._scene)
        {
            cc.error("RegisteringModule模块加载registeringUI.json失败");
            return;
        }

        this.addChild(this._scene);

        this._panel = this._scene.getChildByName("panel");

        var node = this._panel.getChildByName("phone_input");
        node.setPlaceHolder(ResMgr.inst().getString("denglu_46"));

        node = this._panel.getChildByName("phone_input_error");
        node.setString(ResMgr.inst().getString("denglu_66"));

        node = this._panel.getChildByName("find_lost_phone");
        node.setString(ResMgr.inst().getString("denglu_62"));

        node = this._panel.getChildByName("invitation_code_input");
        node.setPlaceHolder(ResMgr.inst().getString("denglu_67"));

        node = this._panel.getChildByName("invitation_code_input_error");
        node.setString(ResMgr.inst().getString("denglu_68"));

        node = this._panel.getChildByName("fast_register");
        node.setTitleText(ResMgr.inst().getString("denglu_69"));

        node = this._panel.getChildByName("tip_left");
        node.setString(ResMgr.inst().getString("denglu_70"));
        node.setPosition(475,134);

        node = this._panel.getChildByName("tip_right");
        node.setString(ResMgr.inst().getString("denglu_71"));
        node.setAnchorPoint(0.5,0.5);
        node.setPosition(475,106);

        node = this._panel.getChildByName("login");
        node.setString(ResMgr.inst().getString("denglu_61"));


        AutoResizeUtils.stretch(this._panel, 3, true, 3);
        AutoResizeUtils.resetNode(this._panel);
        this.updateRegisterPanel();

        this._commonQuitCtrl = new CommonQuitGame(this);
        SysCall.setCustomIMEMode(1);
    },

    updateRegisterPanel : function()
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

        this._logo = this._panel.getChildByName("logo");
        this._logo.attr({"originPoX":this._logo.x, "originPoY":this._logo.y});
        this._logo.setVisible(false);

        this._accountInputBkg = this._panel.getChildByName("phone_input_bkg");
        this._accountInputBkg.attr({"originPoX":this._accountInputBkg.x, "originPoY":this._accountInputBkg.y});
        this._accountInputBkg.setTouchEnabled(true);
        this._accountInputBkg.addTouchEventListener(this.onCommonBtnEvtDispatcher, this);

        this._accountInput = this._panel.getChildByName("phone_input");
        this._accountInput.attr({"originPoX":this._accountInput.x, "originPoY":this._accountInput.y});
        this._accountInput.addTouchEventListener(this.onCommonBtnEvtDispatcher, this);

        this._accountInputError = this._panel.getChildByName("phone_input_error");
        this._accountInputError.attr({"originPoX":this._accountInputError.x, "originPoY":this._accountInputError.y});
        this._accountInputError.setVisible(false);

        this._invitationCodeInputBkg = this._panel.getChildByName("invitation_code_input_bkg");
        this._invitationCodeInputBkg.attr({"originPoX":this._invitationCodeInputBkg.x, "originPoY":this._invitationCodeInputBkg.y});
        this._invitationCodeInputBkg.setTouchEnabled(true);
        this._invitationCodeInputBkg.addTouchEventListener(this.onCommonBtnEvtDispatcher, this);

        this._invitationCodeInput = this._panel.getChildByName("invitation_code_input");
        this._invitationCodeInput.attr({"originPoX":this._invitationCodeInput.x, "originPoY":this._invitationCodeInput.y});
        this._invitationCodeInput.addTouchEventListener(this.onCommonBtnEvtDispatcher, this);

        this._invitationCodeError = this._panel.getChildByName("invitation_code_input_error");
        this._invitationCodeError.attr({"originPoX":this._invitationCodeError.x, "originPoY":this._invitationCodeError.y});
        this._invitationCodeError.setVisible(false);

        this._findLostAccount = this._panel.getChildByName("find_lost_phone");
        this._findLostAccount.attr({"originPoX":this._findLostAccount.x, "originPoY":this._findLostAccount.y});
        this._findLostAccount.setTouchEnabled(true);
        this._findLostAccount.addTouchEventListener(this.onCommonBtnEvtDispatcher, this);
        this._findLostAccount.setVisible(false);

        this._findLostBottomLine = this._panel.getChildByName("find_lost_bottom_line");
        this._findLostBottomLine.attr({"originPoX":this._findLostBottomLine.x, "originPoY":this._findLostBottomLine.y});
        this._findLostBottomLine.setVisible(false);

        this._fastRegisterBtn = this._panel.getChildByName("fast_register");
        this._fastRegisterBtn.attr({"originPoX":this._fastRegisterBtn.x, "originPoY":this._fastRegisterBtn.y});
        this._fastRegisterBtn.addTouchEventListener(this.onCommonBtnEvtDispatcher, this);

        //用户默认同意
        this._tipLeft = this._panel.getChildByName("tip_left");
        this._tipLeft.attr({"originPoX":this._tipLeft.x, "originPoY":this._tipLeft.y});

        //用户最终协议
        this._tipRight = this._panel.getChildByName("tip_right");
        this._tipRight.attr({"originPoX":this._tipRight.x, "originPoY":this._tipRight.y});
        this._tipRight.setTouchEnabled(true);
        this._tipRight.addTouchEventListener(this.onCommonBtnEvtDispatcher, this);

        this._login = this._panel.getChildByName("login");
        this._login.attr({"originPoX":this._login.x, "originPoY":this._login.y});
        this._login.setTouchEnabled(true);
        this._login.addTouchEventListener(this.onCommonBtnEvtDispatcher, this);

        this._loginBottomLine = this._panel.getChildByName("login_bottom_line");
        this._loginBottomLine.attr({"originPoX":this._loginBottomLine.x, "originPoY":this._loginBottomLine.y});

        this._panelMotionCtrl = new KeyboardPanController(this._panel, 120, 0.08);
    },

    isValidAccountIdLength : function()
    {
        var phone = this._accountInput.getString();
        var isValidRange = CD.isPhoneNum(phone);

        if(0 == phone.length || !isValidRange)
        {
            this._accountInputError.setAnchorPoint(0.5, 0.5);
            this._accountInputError.setColor(cc.color(212, 74, 74));
            this._accountInputError.setFontSize(22);
            var value = ResMgr.inst().getString("denglu_29");
            this._accountInputError.setString(value);
            this._accountInputError.setContentSize(cc.size(405, 22));
            this._accountInputError.setVisible(true);
            return false;
        }
        return true;
    },

    inputTip : function()
    {
        this._accountInputError.setAnchorPoint(0.47, 0.5);
        this._accountInputError.setColor(cc.color(77, 77, 77));
        this._accountInputError.setFontSize(16);
        var value = ResMgr.inst().getString("denglu_30");
        this._accountInputError.setString(value);
        this._accountInputError.setContentSize(cc.size(405, 22));
        this._accountInputError.setVisible(true);
    },

    //账号重复注册
    isInputError : function()
    {
        this._accountInputError.setAnchorPoint(0.5, 0.5);
        this._accountInputError.setColor(cc.color(212, 74, 74));
        this._accountInputError.setFontSize(22);
        var value = ResMgr.inst().getString("denglu_31");
        this._accountInputError.setString(value);
        this._accountInputError.setContentSize(cc.size(405, 22));
        this._accountInputError.setVisible(true);
    },

    //账号注册申请
    sendAccountRequest : function()
    {
        cc.error("账号注册申请");
        this._loginAccount = this._accountInput.getString();
        this._loginToken = CD.genRandToken();
        var platform = "";
        if(cc.sys.os == cc.sys.OS_ANDROID)
        {
            platform = "android";
        }
        else if(cc.sys.os == cc.sys.OS_IOS)
        {
            platform = "ios";
        }
        else
        {
            platform = "others";
        }

        var head = GameConfig.PLATFORM_AUTHENTICATE_ADDR + "create";
        var url = head;
        url += "?accountName=" + this._loginAccount;
        url += "&token=" + this._loginToken;
        url += "&remarks=" + "from:" + platform;

        NetMgr.inst().sendHttp(url, null, false, function(data, param){
                cc.error("接收:" + data);
                var objAssert = function(obj)
                {
                    return (null != obj && undefined != obj) ? true : false;
                }

                //适用对象为Text
                var uiError = function(obj, errMsg)
                {
                    if(objAssert(obj))
                    {
                        param.objs[0].setAnchorPoint(0.5, 0.5);
                        param.objs[0].setColor(cc.color(212, 74, 74));
                        param.objs[0].setFontSize(22);
                        param.objs[0].setString(errMsg);
                        param.objs[0].setContentSize(cc.size(405, 22));
                        param.objs[0].setVisible(true);
                    }
                }

                var ret = JSON.parse(data);
                if(ret)
                {
                    switch(ret.errCode)
                    {
                        case 0:
                            cc.error("注册成功");
                            ModuleMgr.inst().closeModule("Registering", {"closeSound":false});
                            if(!param.objs[2] && !param.objs[3])
                            {
                                var value = ResMgr.inst().getString("denglu_32");
                                ModuleMgr.inst().openModule("AlertPanel", {"txt":value, "type":2});
                            }
                            ModuleMgr.inst().openModule("Presetting", {"data":null, "openSound":true, "loginAccount":param.objs[2], "loginToken":param.objs[3]});
                            break;
                        case 80104:
                            var value = ResMgr.inst().getString("denglu_31");
                            uiError(param.objs[0], value);//用户名已存在
                            if(objAssert(param.objs[1])) param.objs[1].setVisible(true);
                            break;
                        case 80105:
                            var value = ResMgr.inst().getString("denglu_33");
                            uiError(param.objs[0], value);
                            break;
                        case 80107:
                            var value = ResMgr.inst().getString("denglu_34");

                            uiError(param.objs[0], value);
                            break;
                        case 80109:
                            var value = ResMgr.inst().getString("denglu_35");

                            uiError(param.objs[0], value);
                        default:
                            break;
                    }
                }
                else
                {
                    var value = ResMgr.inst().getString("denglu_36");

                    ModuleMgr.inst().openModule("AlertPanel", {"txt":value, "type":2});
                }
            },
            function(url, response)
            {
                if("" == response)
                {
                    cc.error("服务器连接失败");
                    var value = ResMgr.inst().getString("denglu_37");

                    ModuleMgr.inst().openModule("AlertPanel", {"txt":value, "type":2, "okFun":function(){cc.director.end()}});
                }
            },
            {"objs":[this._accountInputError, this._findLostAccount, this._loginAccount, this._loginToken], "errorReminder":null, "owner":this}
        );
    },

    onCommonBtnEvtDispatcher : function(target, type)
    {
        if(type == ccui.Widget.TOUCH_ENDED)
        {
            NodeUtils.playButtonSoundEffect();
            switch(target)
            {
                case this._panel:
                    this._panelMotionCtrl.adjustLayoutOnIMEShown(false, "bkg");
                    this.isValidAccountIdLength();
                    break;
                case this._accountInputBkg:
                    this._accountInput.attachWithIME();
                    if(!this._panelMotionCtrl.getIMEStatus())
                    {
                        this._accountInputError.setVisible(false);
                        this._findLostAccount.setVisible(false);
                        this._panelMotionCtrl.adjustLayoutOnIMEShown(true, "bkg");
                        this.inputTip();
                    }
                    break;
                case this._accountInput:
                    if(!this._panelMotionCtrl.getIMEStatus())
                    {
                        this._accountInputError.setVisible(false);
                        this._findLostAccount.setVisible(false);
                        this._panelMotionCtrl.adjustLayoutOnIMEShown(true, "bkg");
                        this.inputTip();
                    }
                    break;
                case this._invitationCodeInputBkg:
                    this._invitationCodeInput.attachWithIME();
                    if(!this._panelMotionCtrl.getIMEStatus())
                    {
                        this._invitationCodeError.setVisible(false);
                        this._panelMotionCtrl.adjustLayoutOnIMEShown(true, "bkg");
                    }
                    break;
                case this._invitationCodeInput:
                    if(!this._panelMotionCtrl.getIMEStatus())
                    {
                        this._invitationCodeError.setVisible(false);
                        this._panelMotionCtrl.adjustLayoutOnIMEShown(true, "bkg");
                    }
                    break;
                case this._fastRegisterBtn:
                    cc.error("快速注册");
                    SysCall.closeCustomIMEMode();
                    this._panelMotionCtrl.adjustLayoutOnIMEShown(false, "bkg");
                    if(this.isValidAccountIdLength())
                    {
                        this.sendAccountRequest();
                    }
                    break;
                case this._login:
                    this._login.setOpacity(255);
                    this._loginBottomLine.setOpacity(255);
                    ModuleMgr.inst().closeModule("Registering", {"closeSound":false});
                    ModuleMgr.inst().openModule("Logining", {"data":null, "openSound":true});
                    break;
                case this._tipRight:
                    this._tipRight.setOpacity(255);
                    cc.error("用户最终协议");
                    ModuleMgr.inst().openModule("UserAnnouncing", {"data":null, "openSound":true});
                    break;
                case this._findLostAccount:
                    this._findLostAccount.setOpacity(255);
                    this._findLostBottomLine.setOpacity(255);
                    ModuleMgr.inst().closeModule("Registering", {"closeSound":false});
                    ModuleMgr.inst().openModule("Retrieving", {"data":null, "openSound":true});
                    cc.error("找回密码");
                    break;
                default:
                    break;
            }
        }
        else if(type == ccui.Widget.TOUCH_BEGAN)
        {
            switch(target)
            {
                case this._login:
                    this._login.setOpacity(128);
                    this._loginBottomLine.setOpacity(128);
                    break;
                case this._tipRight:
                    this._tipRight.setOpacity(128);
                    break;
                case this._findLostAccount:
                    this._findLostAccount.setOpacity(128);
                    this._findLostBottomLine.setOpacity(128);
                    break;
                default:
                    break;
            }
        }
        else if(type == ccui.Widget.TOUCH_CANCELED)
        {
            switch(target)
            {
                case this._login:
                    this._login.setOpacity(255);
                    this._loginBottomLine.setOpacity(255);
                    break;
                case this._tipRight:
                    this._tipRight.setOpacity(255);
                    break;
                case this._findLostAccount:
                    this._findLostAccount.setOpacity(255);
                    this._findLostBottomLine.setOpacity(255);
                    break;
                default:
                    break;
            }
        }
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
            this._super(null, data.closeSound);
        }
        else
        {
            this._super(true);
        }
    },

    clean : function()
    {
        NodeUtils.removeUI("res/loadingAndLogining/registeringUI.json");
        this._logo = null;
        this._accountInputBkg = null;
        this._accountInput = null;
        this._accountInputError = null;
        this._invitationCodeInputBkg = null;
        this._invitationCodeInput = null;
        this._invitationCodeError = null;
        this._findLostAccount = null;
        this._findLostBottomLine = null;

        this._fastRegisterBtn = null;
        this._tipLeft = null;
        this._tipRight = null;

        this._login = null;
        this._loginBottomLine = null;

        this._panelEffectCtrl.destroy();
        this._panelEffectCtrl = null;

        this._panelMotionCtrl.destroy();
        this._panelMotionCtrl = null;

        this._loginAccount = null;
        this._loginToken = null;

        this._bkg = null;
        this._scene = null;
        this._panel = null;
    },

    destroy : function()
    {
        this._super();
        this.clean();
        this._commonQuitCtrl.destroy();
        this._commonQuitCtrl = null;
        SysCall.closeCustomIMEMode();
    }
});
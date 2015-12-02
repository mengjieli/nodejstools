/*
**密码找回 shenwei 2015-9-15
*/
var RetrievingModule = ModuleBase.extend({

    _scene : null,
    _panel : null,

    _panelEffectCtrl : null,

    _bkg : null,
    _title : null,

    _accountInputBkg : null,
    _accountInput : null,
    _accountInputError : null,

    _nextStepBtn : null,

    _login : null,
    _loginBottomLine : null,

    //UI显示调整
    _panelMotionCtrl : null,

    //一级跳转还是二级跳转:_panel 二级 _nextStepBtn 一级
    _entranceMode : null,
    _isAccountValid : null,
    _accountValidExpireTime : null, //密码有效期
    _regainPwCooldownTimeout : null, //找回冷却间隔

    _commonQuitCtrl : null,

    ctor : function()
    {
        this._super();

        this._entranceMode = 2;
        this._isAccountValid = false;
        this._accountValidExpireTime = 0;
        this._regainPwCooldownTimeout = 0;
    },

    initUI : function()
    {
        this._super();

        this._scene = NodeUtils.getUI("res/loadingAndLogining/pwRetrievingUI.json");
        if(null == this._scene)
        {
            cc.error("RetrievingModule模块加载pwRetrievingUI.json失败");
            return;
        }
        this.addChild(this._scene);

        this._panel = this._scene.getChildByName("panel");


        var node = this._panel.getChildByName("retrieve_pw");
        node.setString(ResMgr.inst().getString("denglu_62"));

        node = this._panel.getChildByName("phone_input");
        node.setPlaceHolder(ResMgr.inst().getString("denglu_46"));

        node = this._panel.getChildByName("phone_input_error");
        node.setString(ResMgr.inst().getString("denglu_63"));

        node = this._panel.getChildByName("next_btn");
        node.setTitleText(ResMgr.inst().getString("denglu_64"));

        node = this._panel.getChildByName("login");
        node.setString(ResMgr.inst().getString("denglu_65"));


        AutoResizeUtils.stretch(this._panel, 3, true, 3);
        AutoResizeUtils.resetNode(this._panel);
        this.updateRetrievingPanel();

        this._commonQuitCtrl = new CommonQuitGame(this);
        SysCall.setCustomIMEMode(1);
    },

    updateRetrievingPanel : function()
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

         this._title = this._panel.getChildByName("retrieve_pw");
         this._title.attr({"originPoX":this._title.x, "originPoY":this._title.y});
         this._title.setContentSize(cc.size(442, 33));

         this._accountInputBkg = this._panel.getChildByName("phone_input_bkg");
         this._accountInputBkg.attr({"originPoX":this._accountInputBkg.x, "originPoY":this._accountInputBkg.y});
         this._accountInputBkg.setTouchEnabled(true);
         this._accountInputBkg.addTouchEventListener(this.onCommonBtnEvtDispatcher, this);

         this._accountInput = this._panel.getChildByName("phone_input");
         this._accountInput.attr({"originPoX":this._accountInput.x, "originPoY":this._accountInput.y});
         this._accountInput.addTouchEventListener(this.onCommonBtnEvtDispatcher, this);

         this._accountInputError = this._panel.getChildByName("phone_input_error");
         this._accountInputError.attr({"originPoX":this._accountInputError.x, "originPoY":this._accountInputError.y});
         this._accountInputError.setContentSize(cc.size(397, 22));
         this._accountInputError.setVisible(false);

         this._nextStepBtn = this._panel.getChildByName("next_btn");
         this._nextStepBtn.attr({"originPoX":this._nextStepBtn.x, "originPoY":this._nextStepBtn.y});
         this._nextStepBtn.addTouchEventListener(this.onCommonBtnEvtDispatcher, this);

         this._login = this._panel.getChildByName("login");
         this._login.attr({"originPoX":this._login.x, "originPoY":this._login.y});
         this._login.setTouchEnabled(true);
         this._login.addTouchEventListener(this.onCommonBtnEvtDispatcher, this);

         this._loginBottomLine = this._panel.getChildByName("login_bottom_line");
         this._loginBottomLine.attr({"originPoX":this._loginBottomLine.x, "originPoY":this._loginBottomLine.y});

         this._panelMotionCtrl = new KeyboardPanController(this._panel, 200, 0.08);
    },

    //一级跳转还是二级跳转:_panel 二级 _nextStepBtn 一级
    //_panel 2
    //_nextStepBtn 1
    checkAccount : function(mode)
    {
         var input = this._accountInput.getString();
         if(0 == input.length)
         {
               this._accountInputError.setAnchorPoint(0.5, 0.5);
                var value = ResMgr.inst().getString("denglu_38");
               this._accountInputError.setString(value);
               this._accountInputError.setContentSize(cc.size(397, 22));
               this._accountInputError.setVisible(true);
         }
         else
         {
               //至少请求一次
               if(1 == mode)
               {
                   if(this._isAccountValid && 0 < this._regainPwCooldownTimeout)
                   {
                        ModuleMgr.inst().openModule("MSGActivating", {"data":null, "openSound":true, "inputAccount":this._accountInput.getString(), "regainCooldownTime":this._regainPwCooldownTimeout});
                        ModuleMgr.inst().closeModule("Retrieving", {"closeSound":false});
                        return;
                   }
               }

               var head = GameConfig.PLATFORM_AUTHENTICATE_ADDR + "regain";
               var url = head;
               url += "?accountName=" + input;

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
                                 param.objs[0].setContentSize(cc.size(397, 22));
                                 param.objs[0].setVisible(true);
                             }
                        }

                        var ret = JSON.parse(data);
                        if(ret)
                        {
                            switch(ret.errCode)
                            {
                                case 80101:
                                    var value = ResMgr.inst().getString("denglu_38");
                                    uiError(param.objs[0], value);
                                    break;
                                case 80111:
                                    param.errorTip.apply(param.owner);
                                    break;
                                case 0:
                                    cc.error("当前mode:" + mode);
                                    cc.error("短信有效时间:" + ret.disposablePasswordExpiryDuration);
                                    param.changeMode.apply(param.owner, [true, ret.disposablePasswordExpiryDuration, ret.passwordRegainCooldown, mode]);
                                    break;
                                default:
                                    break;
                            }
                        }
                    }, null, {"objs":[this._accountInputError], "changeMode":this.changeMode, "errorTip":this.setCooldownTip, "owner":this}
               );
         }
    },
    //, this._isAccountValid

    setCooldownTip : function()
    {
        if(this._isAccountValid && 0 < this._regainPwCooldownTimeout)
        {
            var value = ResMgr.inst().getString("denglu_39");

            this._accountInputError.setString(value);
        }
        else
        {
            var value = ResMgr.inst().getString("denglu_40");

            this._accountInputError.setString( value );
        }
        this._accountInputError.setContentSize(cc.size(397, 22));
        this._accountInputError.setVisible(true);
    },

    changeMode : function(v1, v2, v3, v4)
    {
        this._isAccountValid = v1;
        this._accountValidExpireTime = v2;
        this._regainPwCooldownTimeout = v3;

        if(1 == v4)
        {
            ModuleMgr.inst().openModule("MSGActivating", {"data":null, "openSound":true, "inputAccount":this._accountInput.getString(), "regainCooldownTime":this._regainPwCooldownTimeout});
            ModuleMgr.inst().closeModule("Retrieving", {"close":false});
            SysCall.setCustomIMEMode(1);
        }
    },

    onCommonBtnEvtDispatcher : function(target, type)
    {
         if(ccui.Widget.TOUCH_ENDED == type)
         {
                switch(target)
                {
                    case this._panel:
                        this._panelMotionCtrl.adjustLayoutOnIMEShown(false, "bkg");
                        this.checkAccount(2);
                        break;
                      case this._accountInputBkg:
                        this._accountInput.attachWithIME();
                        if(!this._panelMotionCtrl.getIMEStatus())
                        {
                            this._accountInputError.setVisible(false);
                            this._panelMotionCtrl.adjustLayoutOnIMEShown(true, "bkg");
                        }
                        break;
                      case this._accountInput:
                        if(!this._panelMotionCtrl.getIMEStatus())
                        {
                            this._accountInputError.setVisible(false);
                            this._panelMotionCtrl.adjustLayoutOnIMEShown(true, "bkg");
                        }
                        break;
                      case this._nextStepBtn:
                        SysCall.closeCustomIMEMode();
                        this._panelMotionCtrl.adjustLayoutOnIMEShown(false, "bkg");
                        this.checkAccount(1);
                        break;
                      case this._login:
                        this._login.setOpacity(255);
                        this._loginBottomLine.setOpacity(255);
                        ModuleMgr.inst().closeModule("Retrieving", {"closeSound":false});
                        ModuleMgr.inst().openModule("Logining", {"data":null, "openSound":true});
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
            this._super(data.closeSound);
        }
        else
        {
            this._super(true);
        }
    },

    clean : function()
    {
        NodeUtils.removeUI("res/loadingAndLogining/pwRetrievingUI.json");

        this._title = null;

        this._accountInputBkg = null;
        this._accountInput = null;
        this._accountInputError = null;

        this._nextStepBtn = null;

        this._login = null;
        this._loginBottomLine = null;

        this._panelEffectCtrl.destroy();
        this._panelEffectCtrl = null;

        this._panelMotionCtrl.destroy();
        this._panelMotionCtrl = null;

        this._entranceMode = null;
        this._isAccountValid = null;
        this._accountValidExpireTime = null;
        this._regainPwCooldownTimeout = null;

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
        //SysCall.setCustomIMEMode(0);
        SysCall.closeCustomIMEMode();
    }
});
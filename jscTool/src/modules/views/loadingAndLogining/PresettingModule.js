/*
**预设面板 2015-9-14 shenwei
*/
var PresettingModule = ModuleBase.extend({

    _scene : null,
    _panel : null,

    _panelEffectCtrl : null,

    //头像保留未使用状态
    _portraitBkg : null,
    _portrait : null,
    _changePortrait : null,

    _bkg : null,
    _nicknameInputBkg : null,
    _nicknameInput : null,
    _nicknameInputError : null,

    _saveAndEnterBtn : null,

    //UI显示调整
    _panelMotionCtrl : null,

    _presetAccount : null,
    _presetToken : null,

    _isValidNickname : null,

    _commonQuitCtrl : null,
    //登陆请求
    _delayTimer : null,


    ctor : function()
    {
        this._super();

        this._presetAccount = "";
        this._presetToken = "";
        this._isValidNickname = false;
        this._delayTimer = -1;
    },

    initUI : function()
    {
        this._super();

        this._scene = NodeUtils.getUI("res/loadingAndLogining/presettingUI.json");
        if(null == this._scene)
        {
            cc.error("PresettingModule模块加载presettingUI.json失败");
            return;
        }
        this.addChild(this._scene);

        this._panel = this._scene.getChildByName("panel");


        var node = this._panel.getChildByName("nickname_input");
        node.setPlaceHolder(ResMgr.inst().getString("denglu_50"));

        var node = this._panel.getChildByName("nickname_input_error");
        node.setString(ResMgr.inst().getString("denglu_51"));

        var node = this._panel.getChildByName("save_and_enter");
        node.setTitleText(ResMgr.inst().getString("denglu_52"));


        AutoResizeUtils.stretch(this._panel, 3, true, 3);
        AutoResizeUtils.resetNode(this._panel);
        this.updateSettingPanel();
        SysCall.setCustomIMEMode(0);
        this._commonQuitCtrl = new CommonQuitGame(this);






    },

    updateSettingPanel : function()
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

        this._portraitBkg = this._panel.getChildByName("por_bkg");
        this._portraitBkg.attr({"originPoX":this._portraitBkg.x, "originPoY":this._portraitBkg.y});
        this._portraitBkg.setTouchEnabled(true);
        this._portraitBkg.addTouchEventListener(this.onCommonBtnEvtDispatcher, this);
        this._portraitBkg.setVisible(false);

        this._portrait = this._panel.getChildByName("por");
        this._portrait.attr({"originPoX":this._portrait.x, "originPoY":this._portrait.y});
        this._portrait.setVisible(false);

        this._changePortrait = this._panel.getChildByName("change_por");
        this._changePortrait.attr({"originPoX":this._changePortrait.x, "originPoY":this._changePortrait.y});
        this._changePortrait.setTouchEnabled(true);
        this._changePortrait.addTouchEventListener(this.onCommonBtnEvtDispatcher, this);
        this._changePortrait.setVisible(false);

        this._nicknameInputBkg = this._panel.getChildByName("nickname_bkg");
        this._nicknameInputBkg.attr({"originPoX":this._nicknameInputBkg.x, "originPoY":this._nicknameInputBkg.y});
        this._nicknameInputBkg.setTouchEnabled(true);
        this._nicknameInputBkg.addTouchEventListener(this.onCommonBtnEvtDispatcher, this);

        this._nicknameInput = this._panel.getChildByName("nickname_input");
        this._nicknameInput.attr({"originPoX":this._nicknameInput.x, "originPoY":this._nicknameInput.y});
        this._nicknameInput.setTouchEnabled(true);
        this._nicknameInput.addTouchEventListener(this.onCommonBtnEvtDispatcher, this);

        this._nicknameInputError = this._panel.getChildByName("nickname_input_error");
        this._nicknameInputError.attr({"originPoX":this._nicknameInputError.x, "originPoY":this._nicknameInputError.y});
        this._nicknameInputError.setAnchorPoint(0.5, 0.5);
        this._nicknameInputError.setContentSize(cc.size(400, 22));
        this._nicknameInputError.setVisible(false);

        this._saveAndEnterBtn = this._panel.getChildByName("save_and_enter");
        this._saveAndEnterBtn.attr({"originPoX":this._saveAndEnterBtn.x, "originPoY":this._saveAndEnterBtn.y});
        this._saveAndEnterBtn.addTouchEventListener(this.onCommonBtnEvtDispatcher, this);

        this._panelMotionCtrl = new KeyboardPanController(this._panel, 120, 0.08);

        NetMgr.inst().addEventListener(LoginingNetEvent.PES_LOGIN, this.onLoginNotifier, this);
        //TODO::测试用，后续单独分离出去
        NetMgr.inst().addEventListener(LoginingNetEvent.ACCOUNT_ATTRIBUTES, this.onAccountAttributesNotifier, this);
    },

    presetPersonalInfo : function()
    {
        //昵称
        var nickname = this._nicknameInput.getString();
        var msg = new SocketBytes();
        msg.writeUint(LoginingNetEvent.PEC_NICKNAME);
        msg.writeString(nickname);
        NetMgr.inst().send(msg);
    },

    recordUserInfo : function(info)
    {
        cc.error("info:" + JSON.stringify(info));
        var storagePath = jsb.fileUtils ? jsb.fileUtils.getWritablePath() : "./";
        var file = jsb.fileUtils.writeToFile({"lastLoginName":info[0], "lastLoginPassword":info[1], "lastLoginToken":info[2]}, storagePath + LoginingModule.LOGIN_HISTORY_INI);
    },

    onAccountAttributesNotifier : function(cmd, data)
    {
        if(LoginingNetEvent.ACCOUNT_ATTRIBUTES == cmd)
        {
            data.resetCMDData();
            var accountUuid = data.readString();
            cc.error("accountUuid::" + accountUuid);
            var nickname = data.readString();
            cc.error("nickname::" + nickname);
            var attributesLen = data.readUint();
            for(var i = 0; i < attributesLen; ++i)
            {
                var slot = data.readUint();
                cc.error("slot::" + slot);
                var value = data.readString();
                cc.error("value::" + value);
            }

            var publicItemsLen = data.readUint();
            for(var i = 0; i < publicItemsLen; ++i)
            {
                var itemId = data.readUint();
                cc.error("itemId::" + itemId);
                var count = data.readUint();
                cc.error("count::" + count);
            }
            data.resetCMDData();
        }
    },

    onLoginNotifier : function(cmd, data)
    {
        if(LoginingNetEvent.PES_LOGIN == cmd)
        {
            data.resetCMDData();
            SelfData.getInstance().accountId = data.readString();
            this.recordUserInfo([this._presetAccount, "", this._presetToken]);
            this.presetPersonalInfo();
            cc.error("当前账号:" + SelfData.getInstance().accountId);
            SelfData.getInstance().token = this._presetToken;
            SelfData.getInstance().username = this._presetAccount;
            data.resetCMDData();

            //等待网络消息返回
            new EnterGameNet(function(){
                ModuleMgr.inst().closeModule("NetworkWaitModule");
                ModuleMgr.inst().closeModule("Presetting", {"closeSound":false});
                //ModuleMgr.inst().openModule("MapModule");


                ModuleMgr.inst().openModule("MainResourcesModule");
                ModuleMgr.inst().openModule("CastleModule");
                ModuleMgr.inst().openModule("MainMenuModule");
                ModuleMgr.inst().openModule("BattleUIModule");//战斗UI

                //test
                //ModuleMgr.inst().getData("ItemModule").loadItem();
                //ModuleMgr.inst().openModule("StoreModule");//测试用

                //ModuleMgr.inst().openModule("BigMapModule");
            });

        }
    },

    isValidNickname : function()
    {
        if(this._isValidNickname) return true;

        var input = this._nicknameInput.getString();
        var ret = CD.validNameByRule(input);
        if(1 != ret)
        {
            this._nicknameInputError.setVisible(true);
            this._isValidNickname = false;
        }
        else
        {
            this._isValidNickname = true;
        }

        return this._isValidNickname;
    },

    checkUserPresettings : function()
    {
        if(this.isValidNickname())
        {
            ModuleMgr.inst().openModule("NetworkWaitModule");
            this.loginRequest();
        }
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
                    this.isValidNickname();
                    break;
                case this._nicknameInputBkg:
                    this._nicknameInput.attachWithIME();
                    if(!this._panelMotionCtrl.getIMEStatus())
                    {
                        this._nicknameInputError.setVisible(false);
                        this._panelMotionCtrl.adjustLayoutOnIMEShown(true, "bkg");
                    }
                    break;
                case this._nicknameInput:
                    if(!this._panelMotionCtrl.getIMEStatus())
                    {
                        this._nicknameInputError.setVisible(false);
                        this._panelMotionCtrl.adjustLayoutOnIMEShown(true, "bkg");
                    }
                    break;
                case this._saveAndEnterBtn:
                    cc.error("保存设置");
                    SysCall.closeCustomIMEMode();
                    this._panelMotionCtrl.adjustLayoutOnIMEShown(false, "bkg");
                    this.checkUserPresettings();
                    break;
                case this._portraitBkg:
                    break;
                case this._changePortrait:
                    this._changePortrait.setOpacity(255);
                    break;
                default:
                    break;
            }
        }
        else if(type == ccui.Widget.TOUCH_BEGAN)
        {
            switch(target)
            {
                case this._changePortrait:
                    this._changePortrait.setOpacity(128);
                    break;
                default:
                    break;
            }
        }
        else if(type == ccui.Widget.TOUCH_CANCELED)
        {
            switch(target)
            {
                case this._changePortrait:
                    this._changePortrait.setOpacity(255);
                    break;
                default:
                    break;
            }
        }
    },

    loginRequest : function()
    {
        ReconnectionMgr.getInstance();
        NetMgr.inst().connectWebSocket(GameConfig.serverAddress);
        SelfData.getInstance().platformId = GameConfig.PLATFORM_DEFAULT_ID;

        var send = function(owner)
        {
            var msg = new SocketBytes();
            msg.writeUint(LoginingNetEvent.PEC_LOGIN);
            msg.writeUint(SelfData.getInstance().platformId);
            msg.writeString(owner._presetAccount);
            msg.writeString(owner._presetToken);
            NetMgr.inst().send(msg);
        }

        this._delayTimer = setTimeout(send, 500, this);
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

            this._presetAccount = data.loginAccount;
            this._presetToken = data.loginToken;
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
        NodeUtils.removeUI("res/loadingAndLogining/presettingUI.json");

        this._portraitBkg = null;
        this._portrait = null;
        this._changePortrait = null;

        this._nicknameInputBkg = null;
        this._nicknameInput = null;
        this._nicknameInputError = null;
        this._saveAndEnterBtn = null;

        this._panelEffectCtrl.destroy();
        this._panelEffectCtrl = null;

        this._panelMotionCtrl.destroy();
        this._panelMotionCtrl = null;

        this._presetAccount = null;
        this._presetToken = null;

        this._isValidNickname = null;

        if(-1 != this._delayTimer)
        {
            clearTimeout(this._delayTimer);
            this._delayTimer = null;
        }

        this._bkg = null;
        this._scene = null;
        this._panel = null;
    },

    destroy : function()
    {
        this._super();
        this.clean();
        this._commonQuitCtrl = null;
        NetMgr.inst().removeEventListener(LoginingNetEvent.PES_LOGIN, this.onLoginNotifier, this);
        //TODO::测试用，后续单独分离出去
        NetMgr.inst().removeEventListener(LoginingNetEvent.ACCOUNT_ATTRIBUTES, this.onAccountAttributesNotifier, this);
        SysCall.closeCustomIMEMode();
    }
});

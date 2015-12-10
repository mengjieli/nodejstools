/**
 * Created by Administrator on 2015/10/23.
 */

var MainMenuModule = ModuleBase.extend({

    ctor:function()
    {
        this._super();
    },

    initUI:function()
    {

        EventMgr.inst().addEventListener( MailEvent.SEND_NEW_MAIL, this.mailNewCall, this );

        this._ui = ccs.load("res/images/ui/mainMenuModule/Layer.json","res/images/ui/").node;
        this.addChild( this._ui );

        for( var i=0; i<6; i++ )
        {
            var but = this._ui.getChildByName("item" + i );
            but.setTouchEnabled(true);
            but.setTag(i);
            but.addTouchEventListener( this.buttonCall, this );
            var title = but.getChildByName("zi");
            title.ignoreContentAdaptWithSize(true);
            title.setString(ResMgr.inst().getString("mainmenu_"+i));//注意索引的对应关系
            //记录底边按钮，用于UI切换动画
            ModuleMgr.inst().getData("BattleUIModule").pushRowList(but);
        }

        //返回地图
        var item_back = this._ui.getChildByName("item_back");
        item_back.setTouchEnabled(true);
        item_back.addTouchEventListener( this.backButtonCall, this );
        var title = item_back.getChildByName("zi");
        title.ignoreContentAdaptWithSize(true);
        title.setString(ResMgr.inst().getString("mainmenu_100"));

        ModuleMgr.inst().getData("BattleUIModule").pushRowList(item_back);

        //我的主城
        var item_castle = this._ui.getChildByName("item_castle");
        item_castle.setTouchEnabled(true);
        item_castle.addTouchEventListener( this.castleButtonCall, this );
        title = item_castle.getChildByName("zi");
        title.ignoreContentAdaptWithSize(true);
        title.setString(ResMgr.inst().getString("mainmenu_101"));

        ModuleMgr.inst().getData("BattleUIModule").pushColumnList(item_castle);

        var down = GameMgr.inst().frameSize.height - GameMgr.inst().scaleViewSize.height;
        down = down * (1/GameMgr.inst().scaleX);
        var posY = item_castle.getPositionY();
        posY += down;
        item_castle.setPositionY( posY );

        //我的部队
        var item_army = this._ui.getChildByName("item_arm");
        item_army.setTouchEnabled(true);
        item_army.addTouchEventListener( this.armyButtonCall, this );
        title = item_army.getChildByName("zi");
        title.ignoreContentAdaptWithSize(true);
        title.setString(ResMgr.inst().getString("mainmenu_102"));
        var posY = item_army.getPositionY();//适配
        posY += down;
        item_army.setPositionY( posY );

        //ModuleMgr.inst().getData("BattleUIModule").pushColumnList(item_army);
        item_army.setVisible(false);

        //切换，默认隐藏
        var item_exchange = this._ui.getChildByName("item_exchange");
        item_exchange.setTouchEnabled(true);
        item_exchange.setVisible(false);
        item_exchange.addTouchEventListener( this.exchangButtonCall, this );
        title = item_exchange.getChildByName("zi");
        title.ignoreContentAdaptWithSize(true);
        title.setString(ResMgr.inst().getString("mainmenu_103"));

        ModuleMgr.inst().getData("BattleUIModule").setExchangeBtn(item_exchange);

        //适配
        var size = cc.director.getVisibleSize();
        this._ui.setContentSize( size );
        ccui.helper.doLayout( this._ui );
    },

    destroy:function()
    {
        //EventMgr.inst().removeEventListener( TestEvent.SEND_TEX_TEVENT, this.textCallBack, this );
        EventMgr.inst().removeEventListener( MailEvent.SEND_NEW_MAIL, this.mailNewCall, this );

    },

    show:function( data )
    {

    },

    close:function()
    {

    },

    buttonCall:function( node, type )
    {
        if( type == ccui.Widget.TOUCH_BEGAN )
        {
            this.min( node );
        }
        else if( type == ccui.Widget.TOUCH_ENDED )
        {
            this.max( node );
            cc.log(node.getTag());
            this.openModuleByIndex(node.getTag());
        }
        else if( type == ccui.Widget.TOUCH_CANCELED )
        {
            this.max( node );
        }
    },

    //返回地图
    backButtonCall: function (node,type) {
        if( type == ccui.Widget.TOUCH_BEGAN )
        {
            this.min( node );
        }
        else if( type == ccui.Widget.TOUCH_ENDED )
        {
            this.max( node );
            if(UIData.getInstance().showType == UIData.SHOW_CASTLE) {
                //若UI弹框打开，需要关闭
                ModuleMgr.inst().openModule("BuildingUIModule",{objectid:null});
                ModuleMgr.inst().openModule("CreateBuildingUIModule",{objectid:null});
                ModuleMgr.inst().openModule("BattleUIModule");//战斗UI刷新
                ModuleMgr.inst().openModule("MapChangeModule",{"type":MapChangeModule.SHOW_MAP});
            }

        }
        else if( type == ccui.Widget.TOUCH_CANCELED )
        {
            this.max( node );
        }
    },

    //我的主城
    castleButtonCall: function (node,type) {
        if( type == ccui.Widget.TOUCH_BEGAN )
        {
            this.min( node );
        }
        else if( type == ccui.Widget.TOUCH_ENDED )
        {
            this.max( node );
            ModuleMgr.inst().openModule("MainCitysModule");
        }
        else if( type == ccui.Widget.TOUCH_CANCELED )
        {
            this.max( node );
        }
    },

    armyButtonCall: function (node,type) {
        if( type == ccui.Widget.TOUCH_BEGAN )
        {
            this.min( node );
        }
        else if( type == ccui.Widget.TOUCH_ENDED )
        {
            this.max( node );
            ModuleMgr.inst().openModule("CorpsAssembledModule");
        }
        else if( type == ccui.Widget.TOUCH_CANCELED )
        {
            this.max( node );
        }
    },

    exchangButtonCall: function (node,type) {
        if( type == ccui.Widget.TOUCH_BEGAN )
        {
            this.min( node );
        }
        else if( type == ccui.Widget.TOUCH_ENDED )
        {
            this.max( node );
            ModuleMgr.inst().getData("BattleUIModule").switchUI(null);
        }
        else if( type == ccui.Widget.TOUCH_CANCELED )
        {
            this.max( node );
        }
    },

    min:function( node )
    {
        node.stopAllActions();
        var ac = cc.scaleTo(0.1,0.8);
        node.runAction(ac);
    },
    max:function( node )
    {
        node.stopAllActions();
        var ac = cc.scaleTo(0.1,1 );
        node.runAction(ac);
    },

    openModuleByIndex: function (index) {
        trace("点击？",index);
        switch (index) {
            case 0://结盟
                //ModuleMgr.inst().openModule("AlertString", {
                //    str: "功能暂未开启",
                //    color: null,
                //    time: null,
                //    pos: cc.p(cc.Director.getInstance().getWinSize().width / 2, cc.Director.getInstance().getWinSize().height / 2)
                //});
                ModuleMgr.inst().openModule("FriendModule");
                break;
            case 1://邮件
                ModuleMgr.inst().openModule("MailModule");
                break;
            case 2://收藏夹
                ModuleMgr.inst().openModule("CollectModule");
                break;
            case 3://世界地图
                ModuleMgr.inst().openModule("AlertString", {
                    str: "功能暂未开启",
                    color: null,
                    time: null,
                    pos: cc.p(cc.Director.getInstance().getWinSize().width / 2, cc.Director.getInstance().getWinSize().height / 2)
                });
                break;
            case 4://商城
                ModuleMgr.inst().openModule("StoreModule");
                break;
            case 5://背包
                ModuleMgr.inst().openModule("BagModule");
                break;
            default :
                break;
        }
    },

    //邮件有更新
    mailNewCall:function( e )
    {
        var data = ModuleMgr.inst().getData("MailModule");
        if( data == null ) return;
        var v = data.getNewMailNum();
        if( v > 0 )
        {
            cc.log("有新邮件没有读:" + v);
        }
    },



});
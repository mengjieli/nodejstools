/**
 * Created by Administrator on 2015/11/12.
 */


var FriendModule = ModuleBase.extend({

    _ui:null,
    _scroll:null,
    _sliderBack:null,
    _slider:null,

    _item0:null,                        //朋友UI单元
    _item1:null,                        //添加朋友UI单元
    _item2:null,                        //申请朋友UI单元

    _tabs:null,                         //tab标签列表
    _selectTab:null,                    //当前Tab
    _itemPanels:null,
    _friendItems:null,                  //朋友item列表
    _currentFriendItem:null,            //当前朋友
    _friendAddItems:null,               //朋友item列表
    _currentAddFriendItem:null,         //当前朋友
    _friendApplyItems:null,             //朋友item列表
    _currentApplyFriendItem:null,       //当前朋友

    _bottomFriend:null,
    _bottomAdd:null,
    _bottomApply:null,

    _friendMsgWindow:null,
    ctor:function()
    {
        this._super();
    },

    initUI:function()
    {

        EventMgr.inst().addEventListener( FriendEvent.SEND_LOAD_FRIEND,         this.loadFriendsCall,       this );
        EventMgr.inst().addEventListener( FriendEvent.SEND_ADD_FRIEND,          this.addFriendCall,         this );
        EventMgr.inst().addEventListener( FriendEvent.SEND_DELETE_FRIEND,       this.deleteFriendCall,      this );
        EventMgr.inst().addEventListener( FriendEvent.SEND_UPDATE_FRIEND,       this.updateFriendCall,      this );
        EventMgr.inst().addEventListener( FriendEvent.SEND_UPDATE_SIGNATURE,    this.updateSignatureCall,   this );
        EventMgr.inst().addEventListener( FriendEvent.SEND_UPDATE_APP_LIST,     this.updateAppListCall,   this );

        this._friendItems       = [];
        this._friendAddItems    = [];
        this._friendApplyItems  = [];


        this._ui            = ccs.load("res/images/ui/friend/Layer.json","res/images/ui/").node;
        this.addChild( this._ui );
        this._scroll        = this._ui.getChildByName("zhongjian").getChildByName("ScrollView_1");
        this._sliderBack    = this._ui.getChildByName("zhongjian").getChildByName("Panel_7");
        this._slider        = this._ui.getChildByName("zhongjian").getChildByName("Panel_7").getChildByName("Slider_2");
        this._item0         = this._ui.getChildByName("zhongjian").getChildByName("item0");
        this._item1         = this._ui.getChildByName("zhongjian").getChildByName("item1");
        this._item2         = this._ui.getChildByName("zhongjian").getChildByName("item2");
        var head0           = this._ui.getChildByName("zhongjian").getChildByName("item0").getChildByName("Image_19");
        var head1           = this._ui.getChildByName("zhongjian").getChildByName("item1").getChildByName("Image_19");
        var head2           = this._ui.getChildByName("zhongjian").getChildByName("item2").getChildByName("Image_19");
        var deleteFriend    = this._item0.getChildByName("Panel_13");
        var appFriend       = this._item1.getChildByName("Button_11");
        var okButton        = this._item2.getChildByName("Button_11_0");
        var noButton        = this._item2.getChildByName("Button_11");
        var updateButton    = this._ui.getChildByName("dibu").getChildByName("haoyoude").getChildByName("Button_4");
        var findFriend      = this._ui.getChildByName("dibu").getChildByName("tianjiahaoyou").getChildByName("Button_4_1");
        var exchange        = this._ui.getChildByName("dibu").getChildByName("tianjiahaoyou").getChildByName("Button_4");
        var allApp          = this._ui.getChildByName("dibu").getChildByName("tianjiahaoyou").getChildByName("Button_4_0");
        var allOk           = this._ui.getChildByName("dibu").getChildByName("shengqing").getChildByName("Button_4");
        var allNo           = this._ui.getChildByName("dibu").getChildByName("shengqing").getChildByName("Button_4_0");
        var signatureInput  = this._ui.getChildByName("dibu").getChildByName("haoyoude").getChildByName("TextField_1");
        var findInput       = this._ui.getChildByName("dibu").getChildByName("tianjiahaoyou").getChildByName("TextField_3");
        var bgl             = this._ui.getChildByName("zhongjian").getChildByName("Image_11");
        var bgr             = this._ui.getChildByName("zhongjian").getChildByName("Image_11_0");
        var appTxt          = this._ui.getChildByName("dibu").getChildByName("shengqing").getChildByName("Text_9");
        var signatureText   = this._ui.getChildByName("dibu").getChildByName("haoyoude").getChildByName("Text_11");
        signatureText.setString( ResMgr.inst().getString("friend_6") );
        this._item0.setVisible( false );
        this._item1.setVisible( false );
        this._item2.setVisible( false );
        head0.setTouchEnabled( true );
        head1.setTouchEnabled( true );
        head2.setTouchEnabled( true );

        //layer
        this._itemPanels = [];
        for( var i=0; i<3; i++ )
        {
            var ui  = this._scroll.getChildByName("Panel_"+i);
            ui.setVisible( false );
            this._itemPanels.push( ui );
        }
        //tab
        this._tabs  = [];
        var panel   = this._ui.getChildByName("top").getChildByName("tou");
        for( var i=0; i<3; i++ )
        {
            var ui  = panel.getChildByName( "Image_"+i );
            ui.setTouchEnabled(true);
            ui.ignoreContentAdaptWithSize( true );
            ui.addTouchEventListener( this.tabItemCall,this );
            var uiText = ui.getChildByName("Text");
            uiText.ignoreContentAdaptWithSize( true );
            uiText.setString( ResMgr.inst().getString("friend_0_"+i));
            ui.index = i;
            this._tabs.push(ui);
        }
        var xt              = this._ui.getChildByName("top").getChildByName("tou").getChildByName("xiaotiao");
        xt.setLocalZOrder(20);
        this._bottomFriend  = this._ui.getChildByName("dibu").getChildByName("haoyoude");
        this._bottomAdd     = this._ui.getChildByName("dibu").getChildByName("tianjiahaoyou");
        this._bottomApply   = this._ui.getChildByName("dibu").getChildByName("shengqing");
        //适配
        var sc              = 1/GameMgr.inst().scaleX;
        var minSc           = GameMgr.inst().minScale;
        var down            = GameMgr.inst().frameSize.height - GameMgr.inst().scaleViewSize.height;
        down                = down * sc;
        var size            = bgl.getContentSize();
        size.height         += (down >> 1);
        bgl.setContentSize( size );
        bgr.setContentSize( size );
        var size            = this._scroll.getContentSize();
        size.height         += down;
        this._scroll.setContentSize( size );
        var size            = this._sliderBack.getContentSize();
        size.height         += down;
        this._sliderBack.setContentSize( size );
        var size            = this._slider.getContentSize();
        size.width          += down;
        this._slider.setContentSize( size );


        this._scroll.addTouchEventListener(         this.scrollTouchCall, this );
        this._scroll.addEventListener(              this.scrollEventCall, this );
        this._item0.addTouchEventListener(          this.itemOneCall, this );
        this._item1.addTouchEventListener(          this.itemTwoCall, this );
        this._item2.addTouchEventListener(          this.itemThreeCall, this );
        head0.addTouchEventListener(                this.itemHeadOneCall, this );
        head1.addTouchEventListener(                this.itemHeadTwoCall, this );
        head2.addTouchEventListener(                this.itemHeadThreeCall, this );
        deleteFriend.addTouchEventListener(         this.deleteFriendButtonCall, this );
        appFriend.addTouchEventListener(            this.appFriendButtonCall, this );
        okButton.addTouchEventListener(             this.okButtonButtonCall, this );
        noButton.addTouchEventListener(             this.noButtonButtonCall, this );
        updateButton.addTouchEventListener(         this.updateButtonButtonCall, this );
        findFriend.addTouchEventListener(           this.findFriendButtonCall, this );
        exchange.addTouchEventListener(             this.exchangeButtonCall, this );
        allApp.addTouchEventListener(               this.allAppButtonCall, this );
        allOk.addTouchEventListener(                this.allOkButtonCall, this );
        allNo.addTouchEventListener(                this.allNoButtonCall, this );
        //signatureInput.addTouchEventListener(       this.signatureInputCall, this );
        //findInput.addTouchEventListener(            this.findInputCall, this );
        deleteFriend.getChildByName("Text_31").ignoreContentAdaptWithSize(true);
        deleteFriend.getChildByName("Text_31").setString( ResMgr.inst().getString("friend_5") );
        appFriend.setTitleText( ResMgr.inst().getString("friend_16") );
        okButton.setTitleText( ResMgr.inst().getString("friend_12") );
        noButton.setTitleText( ResMgr.inst().getString("friend_13") );
        updateButton.setTitleText( ResMgr.inst().getString("friend_7") );
        findFriend.setTitleText( ResMgr.inst().getString("friend_18") );
        exchange.setTitleText( ResMgr.inst().getString("friend_17") );
        allApp.setTitleText( ResMgr.inst().getString("friend_14") + ResMgr.inst().getString("friend_16") );
        allOk.setTitleText( ResMgr.inst().getString("friend_14") + ResMgr.inst().getString("friend_12") );
        allNo.setTitleText( ResMgr.inst().getString("friend_14") + ResMgr.inst().getString("friend_13") );
        appTxt.ignoreContentAdaptWithSize( true );
        appTxt.setString( ResMgr.inst().getString( "friend_15" ) + ": ");
        findInput.ignoreContentAdaptWithSize(true);
        findInput.setPlaceHolder( ResMgr.inst().getString("friend_19") );
        this._bottomFriend.getChildByName("Text_9").ignoreContentAdaptWithSize(true);
        this._bottomFriend.getChildByName("Text_9").setString( ResMgr.inst().getString("friend_4") + ": " );
        this._sliderBack.setVisible( false );
        var size            = cc.director.getVisibleSize();
        this._ui.setContentSize( size );
        ccui.helper.doLayout( this._ui );

        this.setSelectTab(0);
        this.updateFriendNum();
    },

    destroy:function()
    {
        EventMgr.inst().removeEventListener( FriendEvent.SEND_LOAD_FRIEND,      this.loadFriendsCall,       this );
        EventMgr.inst().removeEventListener( FriendEvent.SEND_ADD_FRIEND,       this.addFriendCall,         this );
        EventMgr.inst().removeEventListener( FriendEvent.SEND_DELETE_FRIEND,    this.deleteFriendCall,      this );
        EventMgr.inst().removeEventListener( FriendEvent.SEND_UPDATE_FRIEND,    this.updateFriendCall,      this );
        EventMgr.inst().removeEventListener( FriendEvent.SEND_UPDATE_SIGNATURE, this.updateSignatureCall,   this );
        EventMgr.inst().removeEventListener( FriendEvent.SEND_UPDATE_APP_LIST,  this.updateAppListCall,   this );


        if( this._friendMsgWindow ) this._friendMsgWindow.removeFromParent();
    },

    show:function( data )
    {

    },

    close:function()
    {

    },

    showFriendMsgWindow:function( show, roleId )
    {
        if( this._selectTab == null ) return;
        if( this._friendMsgWindow == null )
        {
            this._friendMsgWindow = ccs.load("res/images/ui/friend/Layer1.json","res/images/ui/").node;
            ModuleMgr.inst().addNodeTOLayer(this._friendMsgWindow, ModuleLayer.LAYER_TYPE_TOP );
            var size        = cc.director.getVisibleSize();
            this._friendMsgWindow.setContentSize( size );
            ccui.helper.doLayout( this._friendMsgWindow );

            var title       = this._friendMsgWindow.getChildByName("Panel_2").getChildByName("biaoti");
            var close       = this._friendMsgWindow.getChildByName("Panel_2").getChildByName("guanbi");
            var chatBut     = this._friendMsgWindow.getChildByName("Panel_2").getChildByName("queren");
            var chatText    = this._friendMsgWindow.getChildByName("Panel_2").getChildByName("queren").getChildByName("Text_4");
            title.ignoreContentAdaptWithSize( true );
            title.setString( ResMgr.inst().getString("friend_10") );
            chatText.ignoreContentAdaptWithSize( true );
            chatText.setString( ResMgr.inst().getString("friend_9") );

            close.addTouchEventListener( this.closeWindowsCall, this );
            chatBut.addTouchEventListener( this.chatWindowsCall, this );
        }

        this._friendMsgWindow.setVisible( show );
        var data        = ModuleMgr.inst().getData("FriendModule");
        if( roleId != undefined && data!= null )
        {
            var info        = data.getFriendInfo( this._selectTab.index, roleId );
            var head        = this._friendMsgWindow.getChildByName("Panel_2").getChildByName("Image_19").getChildByName("Image_19_0");
            var name        = this._friendMsgWindow.getChildByName("Panel_2").getChildByName("Text_15");
            var level       = this._friendMsgWindow.getChildByName("Panel_2").getChildByName("Text_15_0_0");
            var f           = this._friendMsgWindow.getChildByName("Panel_2").getChildByName("Text_15_0");
            var signature   = this._friendMsgWindow.getChildByName("Panel_2").getChildByName("Text_15_0_0_0");
            head.loadTexture( ResMgr.inst().getIcoPath(info.headId));
            name.ignoreContentAdaptWithSize(true);
            name.setString( ResMgr.inst().getString("friend_1") + ": "      + info.name );
            level.setString( ResMgr.inst().getString("friend_3") + ": "     + info.level );
            level.ignoreContentAdaptWithSize(true);
            f.setString( ResMgr.inst().getString("friend_2") + ": "  + info.fighting );
            f.ignoreContentAdaptWithSize(true);
            signature.setString( ResMgr.inst().getString("friend_4") + ": " + info.signature );
        }
        else
        {
            this._friendMsgWindow.setVisible( false );
        }
    },

    updateFriendNum:function()
    {
        var data        = ModuleMgr.inst().getData("FriendModule");
        if( data == null ) return;
        var len         = data.getListLenght( 0 );
        var txt = this._ui.getChildByName("top").getChildByName("tou").getChildByName("Text_8");
        txt.ignoreContentAdaptWithSize( true );
        txt.setString( ResMgr.inst().getString("friend_8") + ": " + len + "/100" );
    },

    //设置Tab
    setSelectTab:function( index )
    {
        if( this._selectTab && this._selectTab.index == index ) return;

        //还原上一个按钮
        if( this._selectTab != null )
        {
            this._selectTab.ignoreContentAdaptWithSize( true );
            this._selectTab.loadTexture("gy_yeqian_xuanze.png", ccui.Widget.PLIST_TEXTURE);
            ccui.helper.doLayout( this._selectTab );
            this._selectTab = null;
        }
        //隐藏上一个选择的UI
        var listPanel = this._itemPanels[index];
        if(listPanel)listPanel.setVisible(true);
        this.updateCacheUI();
        this._sliderBack.setVisible( false );

        //设置当前选择的按钮。
        var len = this._tabs.length;
        for( var i=0; i<len; i++ )
        {
            var tab = this._tabs[i];
            if( tab.isVisible() == false ) continue;
            var txt = tab.getChildByName("Text");
            if( i == index )
            {
                tab.ignoreContentAdaptWithSize( true );
                tab.loadTexture("gy_yeqian_anxia.png", ccui.Widget.PLIST_TEXTURE);
                tab.setLocalZOrder(10);
                this._selectTab = tab;
                ccui.helper.doLayout( this._selectTab );
            }
            else
            {
                tab.setLocalZOrder( len - i );
            }

            txt.setTextColor( i == index ? cc.color(255,255,255) : cc.color( 134,134,134) );
        }

        this.updateUI();
        this.updateBottomUI();
    },


    updateUI:function()
    {
        this.updataCache();
        if( this._selectTab == null ) return;
        var index       = this._selectTab.index;
        var listPanel   = this._itemPanels[index];
        var bottomUI    = this.getBottomUI( index );
        var list        = this.getItemList( index );
        if( listPanel ) listPanel.setVisible(true);
        if( bottomUI  ) bottomUI.setVisible(true);
        if( list == null || list.length <= 0 )
        {
            this.createItemList( index );
        }
        else
        {
            this.itemItemPos( index );
        }
    },

    updataCache:function()
    {
        this._currentFriendItem         = null;
        this._currentAddFriendItem      = null;
        this._currentApplyFriendItem    = null;
    },

    updateCacheUI:function()
    {
        for( var i in this._itemPanels )
        {
            this._itemPanels[i].setVisible( false );
        }

        this._bottomFriend.setVisible( false );
        this._bottomAdd.setVisible( false );
        this._bottomApply.setVisible( false );
    },

    createItemList:function( type )
    {
        var data        = ModuleMgr.inst().getData("FriendModule");
        if( data == null ) return;
        var infoList    = data.getFriendList( type );
        var len         = data.getListLenght( type );
        if( infoList == null || len <= 0 ) return;
        for( var key in infoList )
        {
            var objInfo = infoList[key];
            this.createFriendItem( type, objInfo );
        }
        this.itemItemPos( type );
    },

    createFriendItem:function( type, info )
    {
        var itemUI  = this.getItemUI( type );
        var ui = itemUI.clone();
        if( type == 0 ) this.setFriendItemInfo( ui, info );
        if( type == 1 ) this.setAddFriendItemInfo( ui, info );
        if( type == 2 ) this.setAppFriendItemInfo( ui, info );
        ui.setVisible(true);
        this.addItemTOList( type, ui );
    },

    //设置朋友Item数据
    setFriendItemInfo:function( ui, info )
    {
        var headBack    = ui.getChildByName("Image_19");
        var head        =  ui.getChildByName("Image_19").getChildByName("Image_19_0");
        var name        =  ui.getChildByName("Text_19");
        var level       =  ui.getChildByName("Text_19_1");
        var fighting    =  ui.getChildByName("Text_19_0");
        var signature   =  ui.getChildByName("Text_19_0_0");
        var deleteBut   =  ui.getChildByName("Panel_13");

        ui.info = info;
        head.loadTexture( ResMgr.inst().getIcoPath(info.headId));
        name.ignoreContentAdaptWithSize(true);
        name.setString( ResMgr.inst().getString("friend_1") + ": "      + info.name );
        level.setString( ResMgr.inst().getString("friend_3") + ": "     + info.level );
        level.ignoreContentAdaptWithSize(true);
        fighting.setString( ResMgr.inst().getString("friend_2") + ": "  + info.fighting );
        fighting.ignoreContentAdaptWithSize(true);
        signature.setString( ResMgr.inst().getString("friend_4") + ": " + info.signature );
        signature.ignoreContentAdaptWithSize(true);
        deleteBut.id = info.id;
        headBack.id = info.id;
    },

    //设置添加好友Item数据
    setAddFriendItemInfo:function( ui, info )
    {
        var headBack    = ui.getChildByName("Image_19");
        var head        =  ui.getChildByName("Image_19").getChildByName("Image_19_0");
        var name        =  ui.getChildByName("Text_19");
        var level       =  ui.getChildByName("Text_19_1");
        var fighting    =  ui.getChildByName("Text_19_0");
        var signature   =  ui.getChildByName("Text_19_0_0");
        var applyBut    =  ui.getChildByName("Button_11");

        ui.info = info;
        head.loadTexture( ResMgr.inst().getIcoPath(info.headId));
        name.ignoreContentAdaptWithSize(true);
        name.setString( ResMgr.inst().getString("friend_1") + ": "      + info.name );
        level.setString( ResMgr.inst().getString("friend_3") + ": "     + info.level );
        level.ignoreContentAdaptWithSize(true);
        fighting.setString( ResMgr.inst().getString("friend_2") + ": "  + info.fighting );
        fighting.ignoreContentAdaptWithSize(true);
        signature.setString( ResMgr.inst().getString("friend_4") + ": " + info.signature );
        signature.ignoreContentAdaptWithSize(true);
        applyBut.setTouchEnabled( !info.isApply );
        applyBut.setBright( !info.isApply );
        applyBut.id = info.id;
        headBack.id = info.id;
    },
    //设置申请好友Item数据
    setAppFriendItemInfo:function( ui, info )
    {
        var headBack    =  ui.getChildByName("Image_19");
        var head        =  ui.getChildByName("Image_19").getChildByName("Image_19_0");
        var name        =  ui.getChildByName("Text_19");
        var level       =  ui.getChildByName("Text_19_1");
        var fighting    =  ui.getChildByName("Text_19_0");
        var signature   =  ui.getChildByName("Text_19_0_0");
        var ok          =  ui.getChildByName("Button_11_0");
        var no          =  ui.getChildByName("Button_11");
        ui.info = info;
        head.loadTexture( ResMgr.inst().getIcoPath(info.headId));
        name.ignoreContentAdaptWithSize(true);
        name.setString( ResMgr.inst().getString("friend_1") + ": "      + info.name );
        level.setString( ResMgr.inst().getString("friend_3") + ": "     + info.level );
        level.ignoreContentAdaptWithSize(true);
        fighting.setString( ResMgr.inst().getString("friend_2") + ": "  + info.fighting );
        fighting.ignoreContentAdaptWithSize(true);
        signature.setString( ResMgr.inst().getString("friend_4") + ": " + info.signature );
        signature.ignoreContentAdaptWithSize(true);
        headBack.id = info.id;
        ok.id = info.id;
        no.id = info.id;
    },

    resetSelect:function()
    {
        this._currentFriendItem = null;
        this._currentAddFriendItem = null;
        this._currentApplyFriendItem = null;
    },

    updateBottomUI:function( )
    {
        var data        = ModuleMgr.inst().getData("FriendModule");
        if( data == null ) return;

        //申请朋友
        var allOk           = this._ui.getChildByName("dibu").getChildByName("shengqing").getChildByName("Button_4");
        var allNo           = this._ui.getChildByName("dibu").getChildByName("shengqing").getChildByName("Button_4_0");
        var num             = this._ui.getChildByName("dibu").getChildByName("shengqing").getChildByName("Text_9_0");
        var len             = data.getListLenght( 2 );
        allOk.setTouchEnabled( len > 0);
        allOk.setBright( len > 0);
        allNo.setTouchEnabled( len > 0);
        allNo.setBright( len > 0);
        num.ignoreContentAdaptWithSize(true);
        num.setString( len );
    },

    addItemTOList:function( type , item )
    {
        var panel = this._itemPanels[type];
        var list = this.getItemList( type );
        list.push(item)
        panel.addChild(item);
        this.updateBottomUI();
    },

    deleteItemTOList:function( type , id )
    {
        var list = this.getItemList( type );
        for( var key in list )
        {
            var item = list[key];
            if( item.info.id == id )
            {
                item.removeFromParent();
                list.splice( key, 1 );
                break;
            }
        }
        this.resetSelect();
        this.itemItemPos( type );
        this.updateBottomUI();

    },

    updateInfoTOItem:function( type , id )
    {
        var data = ModuleMgr.inst().getData("FriendModule");
        if( data == null ) return;
        var list = this.getItemList( type );
        for( var key in list )
        {
            var item = list[key];
            if( item.info.id == id )
            {
                var info = data.getFriendInfo( type, id );
                if( type == 0 ) this.setFriendItemInfo( item, info );
                if( type == 1 ) this.setAddFriendItemInfo( item, info );
                if( type == 2 ) this.setAppFriendItemInfo( item, info );
                break;
            }
        }

    },

    itemItemPos:function( type )
    {
        var item0       = this.getItemUI(type);
        var scroll      = this._scroll;
        var list        = this.getItemList( type );
        var len         = list.length;
        var itemH       = item0.getContentSize().height;
        itemH           += 2;
        var h           = len * itemH;
        var size        = scroll.getContentSize();
        size.height     = h > size.height ? h : size.height;
        for( var i =0; i<len; i++ )
        {
            var it = list[i];
            it.index = i;
            it.setPosition( 0, (size.height - itemH) - i*itemH );
        }
        scroll.setInnerContainerSize( size );
        scroll.jumpToTop();
    },

    updateSlider:function()
    {
        if( this._scroll == null || this._slider == null ) return;

        var panelH  = this._scroll.getContentSize().height;
        var textH   = this._scroll.getInnerContainerSize().height ;
        var pos     = this._scroll.getInnerContainer().getPosition();

        if( textH<= panelH )
        {
            this._sliderBack.setVisible( false );
            this._sliderBack.setOpacity(0);
            return;
        }
        else
        {
            this._sliderBack.setVisible( true );
        }

        if( pos.y > 0 ) pos.y = 0;
        if( pos.y < (panelH - textH) ) pos.y = panelH - textH;
        var posY            = Math.abs( pos.y );
        var p               = 0;
        p                   = posY / ( textH - panelH );
        p                   = Math.round(p * 100);
        if (p < 0) p        = 0;
        if (p > 100) p      = 100;
        p                   = (100 - p);
        if( isNaN(p) ) p    = 0;

        this._slider.setPercent( p );
    },

    getBottomUI:function( i )
    {
        var ui = null;
        if( i == 0 ) ui = this._bottomFriend;
        if( i == 1 ) ui = this._bottomAdd;
        if( i == 2 ) ui = this._bottomApply;
        return ui;
    },

    getItemUI:function( i )
    {
        var ui = null;
        if( i == 0 ) ui = this._item0;
        if( i == 1 ) ui = this._item1;
        if( i == 2 ) ui = this._item2;
        return ui;
    },

    getItemList:function( i )
    {
        var list = null;
        if( i == 0 ) list = this._friendItems;
        if( i == 1 ) list = this._friendAddItems;
        if( i == 2 ) list = this._friendApplyItems;

        return list;
    },

    reductionItemPos:function()
    {
        if( this._currentFriendItem != undefined && this._currentFriendItem.index != -1 )
        {
            //还原位置
            var current = this._currentFriendItem;
            var pos = current.getPosition();
            if( pos.x != 0 )
            {
                current.stopAllActions();
                pos.x = 0;
                var ac = cc.moveTo(0.1, pos );
                current.runAction( ac );
            }
        }
    },


    /************************
     * 消息
     */

    loadFriendsCall:function( event, type )
    {

    },

    addFriendCall:function( event, type, id )
    {
        var data = ModuleMgr.inst().getData("FriendModule");
        if( data == null ) return;
        var info = data.getFriendInfo( type, id );
        this.createFriendItem( type, info );
        this.itemItemPos( type );
        this.updateFriendNum();
    },

    deleteFriendCall:function( event, type, id )
    {
        this.deleteItemTOList( type, id );
        this.updateFriendNum();
    },

    updateFriendCall:function( event, type,id )
    {
        this.updateInfoTOItem( type, id );
    },

    updateSignatureCall:function( evnet )
    {

    },

    updateAppListCall:function( event )
    {
        this._friendAddItems    = [];
        var panel               = this._itemPanels[1];
        panel.removeAllChildren();
        if( this._selectTab.index == 1 ) this.createItemList( 1 );
    },

    /************************
     * 控件回调
     */


    tabItemCall:function( node ,type )
    {
        if( type == ccui.Widget.TOUCH_ENDED )
        {
            this.setSelectTab( node.index );
        }
    },

    scrollTouchCall:function( node, type )
    {
        if( ccui.Widget.TOUCH_BEGAN == type )
        {
            if( this._selectTab.index == 0 ) this.reductionItemPos();
            this._sliderBack.stopAllActions();
            var sc = cc.fadeTo(0.2,255);
            this._sliderBack.runAction( sc );
        }
        if( type == ccui.Widget.TOUCH_ENDED || type == ccui.Widget.TOUCH_CANCELED )
        {
            this._sliderBack.stopAllActions();
            var sc = cc.fadeTo(0.2,0);
            this._sliderBack.runAction( sc );
        }
    },

    scrollEventCall:function( node, type )
    {
        if( type ==  ccui.ScrollView.EVENT_SCROLLING || type == ccui.ScrollView.EVENT_BOUNCE_TOP || type == ccui.ScrollView.EVENT_BOUNCE_BOTTOM )
        {
            this.updateSlider();
        }
    },

    _touchMovePos:null,
    itemOneCall:function( node, type )
    {
        if( type == ccui.Widget.TOUCH_BEGAN )
        {
            this.reductionItemPos();

            this._sliderBack.stopAllActions();
            var sc = cc.fadeTo(0.2,255);
            this._sliderBack.runAction( sc );
        }
        if( type == ccui.Widget.TOUCH_MOVED )
        {
            if( node != this._currentFriendItem ) return;
            var strPos = node.getTouchBeganPosition();
            var endPos = node.getTouchMovePosition();
            if( this._touchMovePos != null && ( Math.abs( strPos.x - endPos.x ) > 30 ))
            {
                var speedX              = this._touchMovePos.x - endPos.x;
                var nodeX               = node.getPositionX();
                nodeX                   -= speedX;
                if( nodeX < -87 ) nodeX = -87;
                if( nodeX > 0 ) nodeX   = 0;
                node.setPositionX( nodeX );
            }
            this._touchMovePos = node.getTouchMovePosition();
        }

        if( type == ccui.Widget.TOUCH_ENDED )
        {
            var starPos = node.getTouchBeganPosition();
            var endPos = node.getTouchEndPosition();
            if( Math.abs( starPos.x - endPos.x ) < 30 || Math.abs( starPos.y - endPos.y ) < 30 )
            {
                //点击事件
                this._currentFriendItem = node;
                //this.showFriendMsgWindow( true, node.info.id );
            }
        }

        if( type == ccui.Widget.TOUCH_ENDED || type ==  ccui.Widget.TOUCH_CANCELED )
        {

            this._sliderBack.stopAllActions();
            var sc          = cc.fadeTo(0.2,0);
            this._sliderBack.runAction( sc );

            var nodeX       = node.getPositionX();
            var strPos      = node.getTouchBeganPosition();
            var endPos      = node.getTouchEndPosition();

            if( ( Math.abs( strPos.x - endPos.x ) < 20 ))
            {
                return;
            }

            if( nodeX == 0 ) return;
            if( nodeX < -30 )
            {
                node.stopAllActions();
                var pos     = node.getPosition();
                pos.x       = -87;
                var ac      = cc.moveTo(0.1, pos );
                node.runAction( ac );
            }
            else
            {
                node.stopAllActions();
                var pos     = node.getPosition();
                pos.x       = 0;
                var ac      = cc.moveTo(0.1, pos );
                node.runAction( ac );
            }
        }
    },

    itemTwoCall:function( node,type )
    {
        if( type == ccui.Widget.TOUCH_BEGAN )
        {
            this._sliderBack.stopAllActions();
            var sc = cc.fadeTo(0.2,255);
            this._sliderBack.runAction( sc );
        }

        if( type == ccui.Widget.TOUCH_ENDED )
        {
            var starPos = node.getTouchBeganPosition();
            var endPos = node.getTouchEndPosition();
            if( Math.abs( starPos.x - endPos.x ) < 30 || Math.abs( starPos.y - endPos.y ) < 30 )
            {
                //点击事件
                //this.showFriendMsgWindow( true, node.info.id );
            }
        }
        if( type == ccui.Widget.TOUCH_ENDED || type ==  ccui.Widget.TOUCH_CANCELED ) {

            this._sliderBack.stopAllActions();
            var sc = cc.fadeTo(0.2, 0);
            this._sliderBack.runAction(sc);
        }
    },

    itemThreeCall:function( node,type )
    {
        if( type == ccui.Widget.TOUCH_BEGAN )
        {
            this._sliderBack.stopAllActions();
            var sc = cc.fadeTo(0.2,255);
            this._sliderBack.runAction( sc );
        }

        if( type == ccui.Widget.TOUCH_ENDED )
        {
            var starPos = node.getTouchBeganPosition();
            var endPos = node.getTouchEndPosition();
            if( Math.abs( starPos.x - endPos.x ) < 30 || Math.abs( starPos.y - endPos.y ) < 30 )
            {
                //点击事件
            }
        }

        if( type == ccui.Widget.TOUCH_ENDED || type ==  ccui.Widget.TOUCH_CANCELED )
        {
            this._sliderBack.stopAllActions();
            var sc = cc.fadeTo(0.2, 0);
            this._sliderBack.runAction(sc);
        }
    },

    itemHeadOneCall:function( node, type )
    {
        if( type == ccui.Widget.TOUCH_BEGAN )
        {
            var starPos = node.getTouchBeganPosition();
            var endPos = node.getTouchEndPosition();
            if( Math.abs( starPos.x - endPos.x ) < 30 || Math.abs( starPos.y - endPos.y ) < 30 )
            {
                //点击事件
                this.showFriendMsgWindow( true, node.id );
            }
        }
    },

    itemHeadTwoCall:function( node, type )
    {
        if( type == ccui.Widget.TOUCH_BEGAN )
        {
            var starPos = node.getTouchBeganPosition();
            var endPos = node.getTouchEndPosition();
            if( Math.abs( starPos.x - endPos.x ) < 30 || Math.abs( starPos.y - endPos.y ) < 30 )
            {
                //点击事件
                this.showFriendMsgWindow( true, node.id );
            }
        }
    },

    itemHeadThreeCall:function( node, type )
    {
        var starPos = node.getTouchBeganPosition();
        var endPos = node.getTouchEndPosition();
        if( Math.abs( starPos.x - endPos.x ) < 30 || Math.abs( starPos.y - endPos.y ) < 30 )
        {
            //点击事件
            this.showFriendMsgWindow( true, node.id );
        }
    },

    //删除好友
    deleteFriendButtonCall:function( node, type )
    {
        if( type == ccui.Widget.TOUCH_ENDED )
        {
            var starPos = node.getTouchBeganPosition();
            var endPos = node.getTouchEndPosition();
            if( Math.abs( starPos.x - endPos.x ) < 30 || Math.abs( starPos.y - endPos.y ) < 30 )
            {
                //点击事件
                var data = ModuleMgr.inst().getData("FriendModule");
                if( data ==  null ) return;
                data.ncDeleteFriend( node.id );
            }
        }
    },

    //申请好友
    appFriendButtonCall:function( node, type )
    {
        if( type == ccui.Widget.TOUCH_ENDED )
        {
            var starPos = node.getTouchBeganPosition();
            var endPos = node.getTouchEndPosition();
            if( Math.abs( starPos.x - endPos.x ) < 30 || Math.abs( starPos.y - endPos.y ) < 30 )
            {
                //点击事件
                var data = ModuleMgr.inst().getData("FriendModule");
                if( data ==  null ) return;
                data.ncApply( node.id );
            }
        }
    },

    //同意
    okButtonButtonCall:function( node, type )
    {
        if( type == ccui.Widget.TOUCH_ENDED )
        {
            //点击事件
            var data = ModuleMgr.inst().getData("FriendModule");
            if( data ==  null ) return;
            data.ncConsent( node.id );
        }
    },

    //拒绝
    noButtonButtonCall:function( node, type )
    {
        if( type == ccui.Widget.TOUCH_ENDED )
        {
            //点击事件
            var data = ModuleMgr.inst().getData("FriendModule");
            if( data ==  null ) return;
            data.ncRefuse( node.id );
        }
    },

    updateButtonButtonCall:function( node, type )
    {

    },

    //查找
    findFriendButtonCall:function( node, type )
    {
        if( type == ccui.Widget.TOUCH_ENDED )
        {
            var findInput       = this._ui.getChildByName("dibu").getChildByName("tianjiahaoyou").getChildByName("TextField_3");
            var str = findInput.getString();
            cc.log( str );
            if( str == "" )
            {
                cc.log( "没有输入文本" );
                return;
            }
        }
    },

    //换一批
    exchangeButtonCall:function( node, type )
    {

    },

    //全部申请
    allAppButtonCall:function( node, type )
    {

    },
    //全部同意
    allOkButtonCall:function( node, type )
    {

    },
    //全部拒绝
    allNoButtonCall:function( node, type )
    {

    },

    closeWindowsCall:function( node, type )
    {
        if( type == ccui.Widget.TOUCH_ENDED )
        {
            this.showFriendMsgWindow( false );
        }
    },

    chatWindowsCall:function( node, type )
    {
        if( type == ccui.Widget.TOUCH_ENDED )
        {
            cc.log( "私聊" );
            ModuleMgr.inst().closeModule("FriendModule");
        }
    },


});
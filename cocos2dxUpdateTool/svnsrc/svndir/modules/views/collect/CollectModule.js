/**
 * Created by Administrator on 2015/11/24.
 * 收藏夹
 */


var CollectModule = ModuleBase.extend({

    _ui:null,

    _scroll:null,
    _sliderBack:null,
    _slider:null,

    _item:null,                        //单元

    _tabs:null,                        //tab标签列表
    _selectTab:null,                   //当前Tab
    _itemPanels:null,
    _itemLists:null,                    //item列表 2维数组
    _selectItem:null,
    ctor:function()
    {
        this._super();
    },

    initUI:function()
    {
        this._ui = ccs.load("res/images/ui/collect/Layer.json","res/images/ui/").node;
        this.addChild( this._ui );

        this._scroll        = this._ui.getChildByName("Panel_5").getChildByName("ScrollView_1");
        this._sliderBack    = this._ui.getChildByName("Panel_5").getChildByName("Panel_7");
        this._slider        = this._ui.getChildByName("Panel_5").getChildByName("Panel_7").getChildByName("Slider_2");
        this._item          = this._ui.getChildByName("Panel_5").getChildByName("item");
        var editButton      = this._item.getChildByName("Button_0");
        var deleteButton    = this._item.getChildByName("Button_1");
        this._tabs = [];
        var panel = this._ui.getChildByName("Panel_2").getChildByName("Panel_3");
        for( var i=0; i<4; i++ )
        {
            var ui = panel.getChildByName( "Image_"+i );
            ui.setTouchEnabled(true);
            ui.ignoreContentAdaptWithSize( true );
            ui.addTouchEventListener( this.tabItemCall,this );
            var uiText = ui.getChildByName("Text");
            uiText.ignoreContentAdaptWithSize( true );
            uiText.setString( ResMgr.inst().getString("collect_0_"+i));
            ui.index = i;
            this._tabs.push(ui);
        }
        var xt = this._ui.getChildByName("Panel_2").getChildByName("Panel_3").getChildByName("xiaotiao");
        xt.setLocalZOrder(20);
        this._itemPanels = [];
        this._itemLists = [];
        for( var i=0; i<4; i++ )
        {
            var ui  = this._scroll.getChildByName("Panel_"+i);
            ui.setVisible( false );
            this._itemPanels.push( ui );
            this._itemLists[i] = [];
        }
        var bgl             = this._ui.getChildByName("Panel_5").getChildByName("Image_11");
        var bgr             = this._ui.getChildByName("Panel_5").getChildByName("Image_11_0");

        editButton.setTitleText( ResMgr.inst().getString("collect_2") );
        deleteButton.setTitleText( ResMgr.inst().getString("public_delete") );
        this._sliderBack.setVisible( false );
        this._item.setVisible( false );
        this._item.setTouchEnabled(true);
        this._item.addTouchEventListener( this.itemTouchCall, this );
        //适配
        var sc              = 1/GameMgr.inst().scaleX;
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
        var size            = cc.director.getVisibleSize();
        this._ui.setContentSize( size );
        ccui.helper.doLayout( this._ui );

        this._scroll.addTouchEventListener(         this.scrollTouchCall, this );
        this._scroll.addEventListener(              this.scrollEventCall, this );
        editButton.addTouchEventListener(           this.editButtonTouchCall, this );
        deleteButton.addTouchEventListener(         this.deleteButtonTouchCall, this );

        this.setSelectTab( 0 );

        EventMgr.inst().addEventListener( CollectEvent.SEND_NEW_ITEM,       this.newItemCall, this );
        EventMgr.inst().addEventListener( CollectEvent.SEND_DELETE_ITEM,    this.deleteItemCall, this );
        EventMgr.inst().addEventListener( CollectEvent.SEND_UPDATE_ITEM,    this.updateItemCall, this );
    },

    destroy:function()
    {
        EventMgr.inst().removeEventListener( CollectEvent.SEND_NEW_ITEM,       this.newItemCall, this );
        EventMgr.inst().removeEventListener( CollectEvent.SEND_DELETE_ITEM,    this.deleteItemCall, this );
        EventMgr.inst().removeEventListener( CollectEvent.SEND_UPDATE_ITEM,    this.updateItemCall, this );
    },

    show:function( data )
    {
        //ModuleMgr.inst().getData("CollectModule").resetData();
    },

    close:function()
    {
    },


    //设置Tab
    setSelectTab:function( index )
    {
        if (this._selectTab && this._selectTab.index == index) return;
        //还原上一个按钮
        if( this._selectTab != null )
        {
            this._selectTab.ignoreContentAdaptWithSize( true );
            this._selectTab.loadTexture("gy_yeqian_xuanze.png", ccui.Widget.PLIST_TEXTURE);
            ccui.helper.doLayout( this._selectTab );
            this._selectTab = null;
        }

        for( var i in this._itemPanels )
        {
            this._itemPanels[i].setVisible( false );
        }

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
    },

    updateUI:function()
    {
        if( this._selectTab == null ) return;
        var index       = this._selectTab.index;
        var listPanel   = this._itemPanels[index];
        var list        = this.getItemList( index );
        if( listPanel ) listPanel.setVisible(true);
        if( list == null || list.length <= 0 )
        {
            this.createItemList( index );
        }
        else
        {
            this.itemItemPos( index );
        }
    },

    createItemList:function( type )
    {
        var data        = ModuleMgr.inst().getData("CollectModule");
        if( data == null ) return;
        var infoList    = data.getItemList( type );
        var len         = data.getListLenght( type );
        if( infoList == null ) return;
        for( var key in infoList )
        {
            var objInfo = infoList[key];
            this.createItem( type, objInfo );
        }
        this.itemItemPos( type );
    },

    //创建item
    createItem:function( type, info )
    {
        var itemUI  = this._item;
        var ui = itemUI.clone();
        this.setItemInfo( ui, info );
        ui.setPosition(0,0);
        ui.setVisible(true);
        this.addItemTOList( type, ui );
    },

    deleteItemTOList:function( type , id )
    {
        var list = this.getItemList( type );
        for( var key in list )
        {
            var item = list[key];
            if( item.id == id )
            {
                item.removeFromParent();
                list.splice( key, 1 );
                break;
            }
        }
        this.itemItemPos( type );
    },


    //设置Item数据
    setItemInfo:function( ui, info )
    {
        var ico     = ui.getChildByName("sb").getChildByName("ico");
        var name    = ui.getChildByName("zb");
        var pos     = ui.getChildByName("dgcc");

        ico.loadTexture( ResMgr.inst().getIcoPath(info.type) );
        name.ignoreContentAdaptWithSize(true);
        name.setString( info.name );

        var str     = ResMgr.inst().getString("collect_3");
        str         += "X: " + info.pos.x + " Y: " + info.pos.y;
        pos.ignoreContentAdaptWithSize(true);
        pos.setString( str );
        ui.id       = info.id;
    },

    addItemTOList:function( type , item )
    {
        var panel = this._itemPanels[type];
        var list = this.getItemList( type );
        list.push(item)
        panel.addChild(item);
    },

    updateInfoTOItem:function( type , id )
    {
        var data = ModuleMgr.inst().getData("CollectModule");
        if( data == null ) return;
        var list = this.getItemList( type );
        for( var key in list )
        {
            var item = list[key];
            if( item.id == id )
            {
                var info = data.getItemInfo( type, id );
                this.setItemInfo( item, info );
                break;
            }
        }
    },


    itemItemPos:function( type )
    {
        var item0       = this._item;
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


    getItemList:function( i )
    {
        return this._itemLists[i];
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

    /**
     * 整个元素点击
     * @param node
     * @param type
     */
    itemTouchCall:function( node, type )
    {
        if( type == ccui.Widget.TOUCH_ENDED )
        {
            var data = ModuleMgr.inst().getData("CollectModule");
            if( data == null ) return;
            var info = data.getItemInfo( null, node.id );
            var pos = info.pos;

            //if(UIData.getInstance().showType == UIData.getInstance())
            ModuleMgr.inst().openModule("MapChangeModule",{type:MapChangeModule.SHOW_MAP,moduleData:{x:pos.x,y:pos.y}});
            ModuleMgr.inst().closeModule("CollectModule");
        }
    },

    scrollTouchCall:function( node, type )
    {
        if( ccui.Widget.TOUCH_BEGAN == type )
        {
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

    editButtonTouchCall:function( node,type )
    {
        if( type == ccui.Widget.TOUCH_ENDED )
        {
            var pan = node.getParent();
            cc.log("点击" + pan.id );
            if( this._selectTab == null ) return;
            var data = ModuleMgr.inst().getData("CollectModule");
            if( data == null ) return;
            var info = data.getItemInfo( this._selectTab.index, pan.id  );
            if( info ) ModuleMgr.inst().openModule("AddCollectModule", { id:info.id, pos:info.pos } );
        }
    },

    deleteButtonTouchCall:function( node, type )
    {
        if( type == ccui.Widget.TOUCH_ENDED )
        {
            cc.log("点击");
            var data = ModuleMgr.inst().getData("CollectModule");
            if( data == null ) return;
            var pan = node.getParent();
            if( pan.id ) data.ncDelete( pan.id );
        }
    },


    /************************
     * 事件回调
     */

    newItemCall:function( event, type, id )
    {
        var data = ModuleMgr.inst().getData("CollectModule");
        if( data == null ) return;
        var info = data.getItemInfo( type, id );
        if( info == null ) return;
        this.createItem(    type, info );
        this.itemItemPos(   type );
    },

    deleteItemCall:function( event, type, id )
    {
        this.deleteItemTOList( type, id );
    },

    updateItemCall:function( event, type, id )
    {
        this.updateInfoTOItem( type, id );
    },


});
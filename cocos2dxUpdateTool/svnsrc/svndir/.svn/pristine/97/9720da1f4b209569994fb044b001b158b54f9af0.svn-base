/**
 * Created by Administrator on 2015/11/24.
 */

var MainCitysModule = ModuleBase.extend({

    _ui:null,
    _scroll:null,
    _sliderBack:null,
    _slider:null,

    _item:null,
    _items:null,

    ctor:function()
    {
        this._super();
    },

    initUI:function()
    {

        this._items = [];

        this._ui = ccs.load("res/images/ui/mainCitys/Layer.json","res/images/ui/").node;
        this.addChild( this._ui );

        this._scroll        = this._ui.getChildByName("Panel_5").getChildByName("ScrollView_1");
        this._sliderBack    = this._ui.getChildByName("Panel_5").getChildByName("Panel_7");
        this._slider        = this._ui.getChildByName("Panel_5").getChildByName("Panel_7").getChildByName("Slider_2");
        this._item          = this._ui.getChildByName("Panel_5").getChildByName("item");
        this._item.setVisible( false );
        this._sliderBack.setVisible( false );

        //适配
        var sc              = 1/GameMgr.inst().scaleX;
        var down            = GameMgr.inst().frameSize.height - GameMgr.inst().scaleViewSize.height;
        down                = down * sc;
        var size            = this._scroll.getContentSize();
        size.height         += down;
        this._scroll.setContentSize( size );
        var size            = this._sliderBack.getContentSize();
        size.height         += down;
        this._sliderBack.setContentSize( size );
        var size            = this._slider.getContentSize();
        size.width          += down;
        this._slider.setContentSize( size );

        var size = cc.director.getVisibleSize();
        this._ui.setContentSize( size );
        ccui.helper.doLayout( this._ui );

        this._scroll.addTouchEventListener(         this.scrollTouchCall, this );
        this._scroll.addEventListener(              this.scrollEventCall, this );
        this._item.addTouchEventListener(           this.itemTouchCall, this );

        ProfileData.getInstance().addListener(ProfileData.CHANGE_CASTLE,this.onChangeCity,this);

        this.updateUI();
    },
    onChangeCity:function(){
        ModuleMgr.inst().closeModule("MainCitysModule");
    },

    destroy:function()
    {
        ProfileData.getInstance().removeListener(ProfileData.CHANGE_CASTLE,this.onChangeCity,this);
    },

    show:function( data )
    {

    },

    close:function()
    {

    },

    updateUI:function()
    {
        var list = this._items;
        if( list == null || list.length <= 0 )
        {
            this.createItemList();
        }
        else
        {
            this.itemItemPos();
        }
    },

    createItemList:function( )
    {
        var infoList        = ProfileData.getInstance().castleList;
        var len             = infoList.length;
        if( infoList == null || len <= 0 ) return;
        for( var key in infoList )
        {
            var objInfo = infoList[key];
            this.createItem( objInfo );
        }
        this.itemItemPos( );
    },

    //创建item
    createItem:function( info )
    {
        var itemUI  = this._item;
        var ui = itemUI.clone();
        this.setItemInfo( ui, info );
        ui.setVisible(true);
        this.addItemTOList( ui );
    },

    //设置Item数据
    setItemInfo:function( ui, info )
    {
        var titel1  = ui.getChildByName("zb_0");
        titel1.ignoreContentAdaptWithSize(true);
        titel1.setString( ResMgr.inst().getString("mainCitys_0") + ":"  );
        var titel2  = ui.getChildByName("zb_0_0");
        titel2.ignoreContentAdaptWithSize(true);
        titel2.setString( ResMgr.inst().getString("mainCitys_1") + ":" );
        var titel3  = ui.getChildByName("zb_0_0_0");
        titel3.ignoreContentAdaptWithSize(true);
        titel3.setString( ResMgr.inst().getString("mainCitys_2") + ":"  );

        var text1   = ui.getChildByName("zb");
        text1.ignoreContentAdaptWithSize(true);
        text1.setString(info.name);
        var text2   = ui.getChildByName("zb_1");
        text2.ignoreContentAdaptWithSize(true);
        text2.setString( ResMgr.inst().getString("mainCitys_3_0") );

        var text3   = ui.getChildByName("zb_1_0");
        text3.ignoreContentAdaptWithSize(true);
        var str     = "";
        str         = "X: " + info.coordX + "Y: " + info.coordY;
        text3.setString( str );

        var castle  = ProfileData.getInstance().castle;
        if( castle && castle.id == info.id )
        {
            var select = ui.getChildByName("sb").getChildByName("select");
            select.setVisible( true );
        }

        ui.id = info.id;
    },

    addItemTOList:function( item )
    {
        this._items.push(item)
        this._scroll.addChild(item);
    },


    itemItemPos:function( )
    {
        var item0       = this._item;
        var scroll      = this._scroll;
        var list        = this._items;
        var len         = list.length;
        var itemSize    = item0.getContentSize();
        var itemH       = itemSize.height;
        itemH           += 3;
        var h           = len * itemH;
        var size        = scroll.getContentSize();
        size.height     = h > size.height ? h : size.height;
        for( var i =0; i<len; i++ )
        {
            var col     = i % 2;
            var row     = Math.floor(i / 2);
            var it      = list[i];
            it.index    = i;
            it.setPosition( col * itemSize.width + (col * 5), (size.height - itemH) - row * itemH );
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

    /************************
     * 控件回调
     */

    itemTouchCall:function( node, type )
    {
        if( ccui.Widget.TOUCH_BEGAN == type )
        {
            this._sliderBack.stopAllActions();
            var sc = cc.fadeTo(0.2,255);
            this._sliderBack.runAction( sc );
        }
        else if( ccui.Widget.TOUCH_ENDED == type )
        {
            var strPos = node.getTouchBeganPosition();
            var endPos = node.getTouchEndPosition();
            if( Math.abs( strPos.x - endPos.x ) < 30 && Math.abs( strPos.y - endPos.y ) < 30 )
            {
                ProfileData.getInstance().selectCastle( node.id );
            }
        }
        if( type == ccui.Widget.TOUCH_ENDED || type ==  ccui.Widget.TOUCH_CANCELED )
        {
            this._sliderBack.stopAllActions();
            var sc          = cc.fadeTo(0.2,0);
            this._sliderBack.runAction( sc );
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

});
/**
 * Created by Administrator on 2015/10/26.
 */



var WarehouseUI = cc.Node.extend({

    _ui:null,
    _id:0,
    _blockId:null,
    _info:null,
    _demandItems:null,
    _resourceItems:null,

    ctor:function( id, blockId )
    {
        this._super();
        this._id = id;
        this._blockId = blockId;

        var data = ModuleMgr.inst().getData("CastleModule");
        var list = null;
        var info = null;
        if( data )
        {
            list = data.getNetBlock( );
        }
        if( list != null && list[this._blockId] != null )
        {
            this._info = list[this._blockId];
        }

        this.initUI();
    },

    initUI:function()
    {
        this._ui = ccs.load("res/images/ui/warehouseParticulars/Layer.json","res/images/ui/").node;
        this.addChild( this._ui );

        //适配
        var sc = 1/GameMgr.inst().scaleX;
        var minSc = GameMgr.inst().minScale;
        var down = GameMgr.inst().frameSize.height - GameMgr.inst().scaleViewSize.height;
        down = down * sc;
        var minDown = down >> 1;

        var control = this._ui.getChildByName("Image_1");
        var posY  = control.getPositionY();
        posY += down;
        control.setPositionY( posY );
        var control = this._ui.getChildByName("Panel0");
        var posY  = control.getPositionY();
        posY += down;
        control.setPositionY( posY );
        var control = this._ui.getChildByName("up0");
        var posY  = control.getPositionY();
        posY += down;
        control.setPositionY( posY );
        var control = this._ui.getChildByName("ScrollView_1");
        var posY  = control.getPositionY();
        posY += minDown;
        control.setPositionY( posY );
        var size = control.getContentSize();
        size.height += minDown;
        control.setContentSize( size );
        control = this._ui.getChildByName("Image_2");
        posY  = control.getPositionY();
        posY += minDown;
        control.setPositionY( posY );
        control = this._ui.getChildByName("down0");
        posY  = control.getPositionY();
        posY += minDown;
        control.setPositionY( posY );

        control = this._ui.getChildByName("Image_1_0");
        posY  = control.getPositionY();
        posY += minDown;
        control.setPositionY( posY );
        control = this._ui.getChildByName("Panel1");
        posY  = control.getPositionY();
        posY += minDown;
        control.setPositionY( posY );
        var control = this._ui.getChildByName("up1");
        var posY  = control.getPositionY();
        posY += minDown;
        control.setPositionY( posY );
        control = this._ui.getChildByName("ScrollView_2");
        var size = control.getContentSize();
        size.height += minDown;
        control.setContentSize( size );

        var size = cc.director.getVisibleSize();
        this._ui.setContentSize( size );
        ccui.helper.doLayout( this._ui );

        var txt = this._ui.getChildByName("Panel0").getChildByName("Text_0");
        txt.ignoreContentAdaptWithSize( true );
        txt.setString( ResMgr.inst().getString("xiangqing_2") );

        txt = this._ui.getChildByName("Panel0").getChildByName("Text_1");
        txt.ignoreContentAdaptWithSize( true );
        txt.setString( ResMgr.inst().getString("xiangqing_3") );

        txt = this._ui.getChildByName("Panel0").getChildByName("Text_2");
        txt.ignoreContentAdaptWithSize( true );
        txt.setString( ResMgr.inst().getString("xiangqing_4") );

        txt = this._ui.getChildByName("Panel0").getChildByName("Text_3");
        txt.ignoreContentAdaptWithSize( true );
        txt.setString( ResMgr.inst().getString("xiangqing_5") );

        txt = this._ui.getChildByName("Panel1").getChildByName("Text_0");
        txt.ignoreContentAdaptWithSize( true );
        txt.setString( ResMgr.inst().getString("xiangqing_6") );

        txt = this._ui.getChildByName("Panel1").getChildByName("Text_1");
        txt.ignoreContentAdaptWithSize( true );
        txt.setString( ResMgr.inst().getString("xiangqing_7") );

        txt = this._ui.getChildByName("Panel1").getChildByName("Text_2");
        txt.ignoreContentAdaptWithSize( true );
        txt.setString( ResMgr.inst().getString("xiangqing_8") );

        txt = this._ui.getChildByName("Panel1").getChildByName("Text_3");
        txt.ignoreContentAdaptWithSize( true );
        txt.setString( ResMgr.inst().getString("xiangqing_9") );

        txt = this._ui.getChildByName("Panel1").getChildByName("Text_4");
        txt.ignoreContentAdaptWithSize( true );
        txt.setString( ResMgr.inst().getString("xiangqing_14") );

        var item0 = this._ui.getChildByName("item0");
        item0.setVisible(false);
        var scroll = this._ui.getChildByName("ScrollView_1");
        scroll.addEventListener(this.scrollOneCall, this );

        var item0 = this._ui.getChildByName("item1");
        item0.setVisible(false);
        var scroll = this._ui.getChildByName("ScrollView_2");
        scroll.addEventListener(this.scrollTwoCall, this );


        this.updateUp();
        this.updateDown();
    },

    updateUp:function()
    {
        if( this._demandItems )
        {
            for( var i in this._demandItems )
            {
                var item = this._demandItems[i];
                item.removeFromParent();
            }
        }

        this._demandItems = [];

        var item0 = this._ui.getChildByName("item0");
        item0.setVisible(false);
        var scroll = this._ui.getChildByName("ScrollView_1");

        //var config = ResMgr.inst().getJSON( "City_Storage", null, true );
        var config = ModuleMgr.inst().getData("ConfigTableUpdator").getConfigTableValueAll("City_Storage");
        var level = this._info._building_level;
        var dataList = [];

        for( var i in config )
        {
            dataList.push( config[i] );
        }
        var len = dataList.length;
        for( var i=0; i<len; i++  )
        {
            var it = item0.clone();
            scroll.addChild( it );
            it.setVisible(true);
            this._demandItems.push( it );

            var data = dataList[i];
            it.info = {};
            it.info.level = data.storage_level;
            var resourceObj = data.resource_max;
            if( typeof resourceObj == "string" )
            {
                resourceObj = JSON.parse( resourceObj );
            }

            var itemUI = it.getChildByName("txt0");
            itemUI.ignoreContentAdaptWithSize(true);
            itemUI.setString( data.storage_level );
            itemUI = it.getChildByName("txt1");
            itemUI.ignoreContentAdaptWithSize(true);
            itemUI.setString( resourceObj["1101001"] );
            itemUI = it.getChildByName("txt2");
            itemUI.ignoreContentAdaptWithSize(true);
            itemUI.setString( resourceObj["1101002"] );
            itemUI = it.getChildByName("txt3");
            itemUI.ignoreContentAdaptWithSize(true);
            itemUI.setString( resourceObj["1101003"] );
        }
        this.updateDemandScrollItemPos( 0 );

        this.updateScrollviewSelecting( scroll, len,item0.getContentSize().height, level );

    },

    updateDown:function()
    {
        this._resourceItems = [];

        if( this._resourceItems )
        {
            for( var i in this._resourceItems )
            {
                var item = this._resourceItems[i];
                item.removeFromParent();
            }
        }
        this._resourceItems = [];

        var item0 = this._ui.getChildByName("item1");
        item0.setVisible(false);
        var scroll = this._ui.getChildByName("ScrollView_2");

        //var config = ResMgr.inst().getJSON( "City_Storage", null, true );
        var config = ModuleMgr.inst().getData("ConfigTableUpdator").getConfigTableValueAll("City_Storage");
        var level = this._info._building_level;
        var dataList = [];

        for( var i in config )
        {
            dataList.push( config[i] );
        }
        var len = dataList.length;
        for( var i=0; i<len; i++  )
        {
            var it = item0.clone();
            scroll.addChild( it );
            it.setVisible(true);
            this._resourceItems.push( it );

            var data = dataList[i];
            it.info = {};
            it.info.level = data.storage_level;
            var resourceObj = data.resource_max;
            if( typeof resourceObj == "string" )
            {
                resourceObj = JSON.parse( resourceObj );
            }

            var itemUI = it.getChildByName("txt0");
            itemUI.setString( resourceObj["1102001"] );
            itemUI = it.getChildByName("txt1");
            itemUI.setString( resourceObj["1102002"] );
            itemUI = it.getChildByName("txt2");
            itemUI.setString( resourceObj["1102003"] );
            itemUI = it.getChildByName("txt3");
            itemUI.setString( resourceObj["1102004"] );
            itemUI = it.getChildByName("txt4");
            itemUI.setString( data.prosperity );
        }
        this.updateDemandScrollItemPos( 1 );
        this.updateScrollviewSelecting( scroll, len,item0.getContentSize().height, level );
    },

    //更新滚动层里的item坐标
    updateDemandScrollItemPos:function( n )
    {

        var item0 = null;
        var scroll = null;
        var list = null;
        if( n == 0 )
        {
            list = this._demandItems;
            item0 = this._ui.getChildByName("item0");
            scroll = this._ui.getChildByName("ScrollView_1");
        }
        else
        {
            list = this._resourceItems;
            item0 = this._ui.getChildByName("item1");
            scroll = this._ui.getChildByName("ScrollView_2");
        }


        //把等级与自己想等的提到前面
        //var itemList = [];
        //for( var i in list )
        //{
        //    var item = list[i];
        //    if( item.info.level == this._info._building_level )
        //    {
        //        var forItem = list.splice( i ,1 );
        //        list.unshift(item);
        //        break;
        //    }
        //}

        var len  = list.length;
        var itemH = item0.getContentSize().height;
        var h = len * itemH;
        var size = scroll.getContentSize();
        size.height = h > size.height ? h : size.height;
        for( var i =0; i<len; i++ )
        {
            var it = list[i];
            it.setPosition( 0, (size.height - itemH) - i*itemH );

            var b = it.getChildByName("back");
            if( i % 2 == 0 )
            {
                b.loadTexture("gy_xiangqing_xialan_di_01.png", ccui.Widget.PLIST_TEXTURE);
            }
            else
            {
                b.loadTexture("gy_xiangqing_shanglan_di_01.png", ccui.Widget.PLIST_TEXTURE);
            }
        }
        var level = this._info._building_level;
        var select = scroll.getChildByName("select");
        select.setVisible(true);
        select.setPosition(0, (size.height - itemH)- ((level -1)*itemH)-2 );

        scroll.setInnerContainerSize( size );
        scroll.jumpToTop();
        this.updateScroll(n);
    },

    //更新上下箭头
    updateScroll:function( n )
    {
        var scroll = null;
        var up = null;
        var down = null;

        if( n == 0 )
        {
            scroll = this._ui.getChildByName("ScrollView_1");
            up = this._ui.getChildByName("up0");
            down = this._ui.getChildByName("down0");
        }
        else
        {
            scroll = this._ui.getChildByName("ScrollView_2");
            up = this._ui.getChildByName("up1");
            down = this._ui.getChildByName("down1");
        }

        var scrollSize = scroll.getContentSize();
        var size = scroll.getInnerContainerSize();

        var inner = scroll.getInnerContainer();
        var pos = inner.getPosition();

        up.setVisible(false);
        down.setVisible( false );

        if( size.height <= scrollSize.height )
        {
            up.setVisible( false );
            down.setVisible( false );
        }
        else
        {
            if( pos.y >= 0 && size.height <= scrollSize.height )
            {
                up.setVisible( false );
            }
            else
            {
                up.setVisible( pos.y >= 0 ? false : true );
            }

            var endY = scrollSize.height - size.height;

            down.setVisible( pos.y <= endY ? false : true );
        }
    },

    scrollOneCall:function( node, type )
    {
        if( type ==  ccui.ScrollView.EVENT_SCROLLING || type == ccui.ScrollView.EVENT_BOUNCE_TOP || type == ccui.ScrollView.EVENT_BOUNCE_BOTTOM )
        {
            this.updateScroll(0);
        }
    },

    scrollTwoCall:function( node, type )
    {
        if( type ==  ccui.ScrollView.EVENT_SCROLLING )
        {
            this.updateScroll(1);
        }
    },


    updateScrollviewSelecting: function (scrollview, length,itemH,selecting)
    {
        var size = scrollview.getContentSize();
        var h = scrollview.getInnerContainerSize().height;
        var number = parseInt(size.height / itemH);
        if (selecting>= length-number)
        {
            this.runAction(cc.Sequence(cc.DelayTime(0.001),cc.CallFunc(function () {
                scrollview.jumpToBottom();
            })));
        }
        else
        {
            this.runAction(cc.Sequence(cc.DelayTime(0.001),cc.CallFunc(function (sender) {
                //var size = scrollview.getContentSize();
                var percent = (selecting-1)*itemH / (h- size.height) * 100;
                scrollview.jumpToPercentVertical(percent)
            })));
        }
    }

});
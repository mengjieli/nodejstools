/**
 * Created by Administrator on 2015/10/27.
 */


var WarehouseUpgradeUI = cc.Node.extend({


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
        if( data )
        {
            list = data.getNetBlock( );
        }

        if( list == null || list[this._blockId] == null )
        {
            cc.error("找不到地块数据");
            return;
        }

        this._info = list[this._blockId];

        this.initUI();

        EventMgr.inst().addEventListener( CastleEvent.UPGRADE_COMPLETE, this.upgradeCall, this );
    },

    onExit:function()
    {
        this._super();
        EventMgr.inst().removeEventListener( CastleEvent.UPGRADE_COMPLETE, this.upgradeCall, this );
    },

    initUI:function()
    {
        this._ui = ccs.load("res/images/ui/warehouseUpgrade/Layer.json","res/images/ui/").node;
        this.addChild( this._ui );


        //适配
        var sc = 1/GameMgr.inst().scaleX;
        var minSc = GameMgr.inst().minScale;
        var down = GameMgr.inst().frameSize.height - GameMgr.inst().scaleViewSize.height;
        down = down * sc;
        var minDown = down >> 1;

        //上面的滚动层
        var control = this._ui.getChildByName("Image_1");
        var posY  = control.getPositionY();
        posY += down;
        control.setPositionY( posY );
        control = this._ui.getChildByName("Text_23");
        posY  = control.getPositionY();
        posY += down;
        control.setPositionY( posY );
        control = this._ui.getChildByName("up0");
        posY  = control.getPositionY();
        posY += down;
        control.setPositionY( posY );
        control = this._ui.getChildByName("ScrollView_1");
        posY  = control.getPositionY();
        posY += minDown;
        control.setPositionY( posY );
        var size = control.getContentSize();
        size.height += minDown;
        control.setContentSize( size );
        control = this._ui.getChildByName("down0");
        posY  = control.getPositionY();
        posY += minDown;
        control.setPositionY( posY );
        control = this._ui.getChildByName("Image_2");
        posY  = control.getPositionY();
        posY += minDown;
        control.setPositionY( posY );

        //下面的滚动层
        control = this._ui.getChildByName("Image_1_0");
        posY  = control.getPositionY();
        posY += minDown;
        control.setPositionY( posY );
        control = this._ui.getChildByName("Text_24");
        posY  = control.getPositionY();
        posY += minDown;
        control.setPositionY( posY );
        control = this._ui.getChildByName("up1");
        posY  = control.getPositionY();
        posY += minDown;
        control.setPositionY( posY );

        control = this._ui.getChildByName("ScrollView_2");
        var size = control.getContentSize();
        size.height += minDown;
        control.setContentSize( size );
        posY  = control.getPositionY();
        posY += 4;
        control.setPositionY( posY );

        var size = cc.director.getVisibleSize();
        this._ui.setContentSize( size );
        ccui.helper.doLayout( this._ui );

        var txt = this._ui.getChildByName("Text_23");
        txt.ignoreContentAdaptWithSize( true );
        txt.setString( ResMgr.inst().getString("shengji_1") );


        var scroll = this._ui.getChildByName("ScrollView_1");
        scroll.removeAllChildren();
        scroll.addEventListener(this.scrollOneCall, this );

        scroll = this._ui.getChildByName("ScrollView_2");
        scroll.addEventListener(this.scrollTwoCall, this );

        this._demandItems = [];
        this._resourceItems = [];

        this.updateToUI();
    },


    updateToUI:function()
    {
        this.setDemand();
        this.setResource();
    },

    setDemand:function()
    {
        this._demandItems = [];
        this.updateDemandAccelerate();
        this.updateDemandObjectConfig();
        this.updateDemandConfig();
        this.updateDemandScrollItemPos(0);
    },

    setResource:function()
    {
        this._resourceItems = [];
        this.updateResourceConfig();
        this.updateDemandScrollItemPos(1);
    },

    //当建筑升级之后刷新
    updateDemandObjectData:function()
    {
        for( var i in this._demandItems )
        {
            var item = this._demandItems[i];
            if( item.info && item.info.itemType == 1 )
            {
                this.setDemandObjectItem( item );
            }
        }
    },

    updateDemandConfigData:function()
    {
        for( var i in this._demandItems )
        {
            var item = this._demandItems[i];
            if( item.info && item.info.itemType == 3 )
            {
                this.setDemandConfigItem( item );
            }
        }
    },



    //设置升级对象
    updateDemandAccelerate:function()
    {
        var data = ModuleMgr.inst().getData("CastleModule");
        if( data == null ) return;
        var list = data.getNetBlockByState( CastleData.STATE_UPGRADE );
        if( list.length <= 0 ) return;
        var len = list.length;
        for( var i=0; i<len; i++ )
        {
            this.addDemandAccelerateItem( list[i], i );
        }
    },

    addDemandAccelerateItem:function( info, i )
    {
        var item0 = this._ui.getChildByName("Panel_0");
        item0.setVisible( false );
        var scroll = this._ui.getChildByName("ScrollView_1");

        var it = item0.clone();
        scroll.addChild( it );
        this._demandItems.splice( i, 0, it );
        it.setVisible(true);

        it.info = {};
        it.info.blockId = info._index;
        it.info.configId = info._building_id;
        it.info.itemType = 0;

        var itemUI = it.getChildByName("ico");
        itemUI.ignoreContentAdaptWithSize( true );
        itemUI.loadTexture( "gy_shalou.png" , ccui.Widget.PLIST_TEXTURE );
        itemUI = it.getChildByName("text0");
        itemUI.ignoreContentAdaptWithSize(true);
        itemUI.setTextColor( cc.color(255,0,0) );
        itemUI.setString( ResMgr.inst().getString( info._building_id + "0" ) + ResMgr.inst().getString("xiangqing_18") + " " + StringUtils.formatTimer( info._state_remain ) );
        itemUI = it.getChildByName("zt");
        itemUI = it.getChildByName("Button");
        itemUI.info = it.info;
        itemUI.addTouchEventListener( this.speedCall, this );
        itemUI = it.getChildByName("Button").getChildByName("Text");
        itemUI.ignoreContentAdaptWithSize(true);
        itemUI.setString( ResMgr.inst().getString("xiangqing_16") );
    },

    //设置建筑需求Item
    updateDemandObjectConfig:function()
    {

        var data = ModuleMgr.inst().getData("CastleModule");
        if( data == null ) return;
        var list = data.getNetBlockByState( CastleData.STATE_UPGRADE );
        var len = list.length;

        //var configData = ResMgr.inst().getJSON( "City_Storage",this._info._building_level, true );
        var configData =  ModuleMgr.inst().getData("ConfigTableUpdator").getConfigTableValueByKey("City_Storage",this._info._building_level + 1 );

        if( configData == null ) return;

        var item0 = this._ui.getChildByName("Panel_0");
        item0.setVisible( false );
        var scroll = this._ui.getChildByName("ScrollView_1");

        var it = item0.clone();
        scroll.addChild( it );
        it.setVisible(true);
        this._demandItems.splice( len, 0, it );

        var configObj = {};
        var obj = configData.need;
        if( typeof obj == "string" )
        {
            obj = JSON.parse(obj);
        }
        for( var j in obj )
        {
            configObj.id = j;
            configObj.value = obj[j];
        }

        var list = data.getNetBlockByBuildingId( configObj.id );
        if( list.length <= 0 ) return;

        it.info = {};
        it.info.blockId = list[0]._index;
        it.info.configId = configObj.id;
        it.info.itemType = 1;
        it.info.value = configObj.value;

        var itemUI = it.getChildByName("ico");
        itemUI.ignoreContentAdaptWithSize(true);
        itemUI.loadTexture(ResMgr.inst().getIcoPath( 1104001 ) );
        itemUI = it.getChildByName("text0");
        itemUI.ignoreContentAdaptWithSize(true);
        itemUI.setString( ResMgr.inst().getString( configObj.id + "0") + " " + ResMgr.inst().getString("xiangqing_2") + " " + configObj.value );
        itemUI = it.getChildByName("Button");
        itemUI.info = it.info;
        itemUI.addTouchEventListener( this.gotoCall, this );
        itemUI = it.getChildByName("Button").getChildByName("Text");
        itemUI.ignoreContentAdaptWithSize(true);
        itemUI.setString( ResMgr.inst().getString("xiangqing_17") );
        this.setDemandObjectItem( it );

    },

    //跟新需求建筑状态
    setDemandObjectItem:function( it )
    {
        var itemUI = it.getChildByName("zt");
        var arr = ModuleMgr.inst().getData("CastleModule").getNetBlockByBuildingId( it.info.configId );
        var level = 0;
        for( var i in arr )
        {
            var item = arr[i];
            level = Math.max( level, item._building_level );
        }
        itemUI.loadTexture( level >= it.info.value ? "gy_dui_01.png" : "gy_cuo_01.png", ccui.Widget.PLIST_TEXTURE );

        itemUI = it.getChildByName("text0");
        itemUI.setTextColor( level >= it.info.value ? cc.color(255,255,255) : cc.color(255,0,0) );

        itemUI = it.getChildByName("Button");
        itemUI.setVisible( level >= it.info.value ? false : true );
    },


    //设置资源需求Item
    updateDemandConfig:function()
    {
        //var configData = ResMgr.inst().getJSON( "City_Storage",this._info._building_level, true );
        var configData =  ModuleMgr.inst().getData("ConfigTableUpdator").getConfigTableValueByKey("City_Storage",this._info._building_level + 1 );

        if( configData == null ) return;

        var item0 = this._ui.getChildByName("Panel_0");
        item0.setVisible( false );
        var scroll = this._ui.getChildByName("ScrollView_1");

        var objList = configData.need_resource;
        if( typeof objList == "string" )
        {
            objList = JSON.parse(objList);
        }
        var dataList = [];
        for( var j in objList )
        {
            var oo = {};
            oo.id = j;
            oo.value = objList[j];
            dataList.push( oo );
        }
        var len = dataList.length
        for( var i = 0; i<len; i++ )
        {
            var it = item0.clone();
            scroll.addChild( it );
            it.setVisible(true);
            this._demandItems.push( it );

            var configObj = dataList[i];
            it.info = {};
            it.info.blockId = 0;
            it.info.configId = configObj.id;
            it.info.itemType = 2;
            it.info.value = configObj.value;
            this.setDemandConfigItem( it );

            var itemUI = it.getChildByName("ico");
            itemUI.loadTexture(ResMgr.inst().getIcoPath( it.info.configId ) );
            itemUI = it.getChildByName("text0");
            itemUI.setString( it.info.value );
            itemUI = it.getChildByName("Button");
            itemUI.addTouchEventListener( this.demandConfigButCall, this );
            itemUI.info = it.info;
            itemUI = it.getChildByName("Button").getChildByName("Text");
            itemUI.ignoreContentAdaptWithSize(true);
            itemUI.setString( ResMgr.inst().getString("xiangqing_15") );
        }
    },

    //跟新资源状态
    setDemandConfigItem:function( it )
    {
        var itemUI = it.getChildByName("zt");
        var num = ModuleMgr.inst().getData("CastleModule").getNetResource( null, it.info.configId );
        itemUI.loadTexture( num >= it.info.value ? "gy_dui_01.png" : "gy_cuo_01.png", ccui.Widget.PLIST_TEXTURE );
        itemUI = it.getChildByName("text0");
        itemUI.setTextColor( num >= it.info.value ? cc.color(255,255,255) : cc.color(255,0,0) );
        itemUI = it.getChildByName("Button");
        itemUI.setVisible( num >= it.info.value ? false : true );

    },


    //跟新资源需求
    updateResourceConfig:function()
    {
        //var current = ResMgr.inst().getJSON( "City_Storage",this._info._building_level, true );
        //var next =  ResMgr.inst().getJSON( "City_Storage",this._info._building_level + 1, true );
        var current =  ModuleMgr.inst().getData("ConfigTableUpdator").getConfigTableValueByKey("City_Storage",this._info._building_level );
        var next =   ModuleMgr.inst().getData("ConfigTableUpdator").getConfigTableValueByKey("City_Storage",this._info._building_level+1 );
        if( current == null ) return;

        var currentList = [];
        var objList = current.resource_max;
        if( typeof objList == "string" )
        {
            objList = JSON.parse(objList);
        }
        for( var key in objList )
        {
            var itemData = {};
            itemData.id = key;
            itemData.value = objList[key];
            itemData.max = next == null ? "-" : ("+" + objList[key]);
            currentList.push( itemData );
        }

        var txt = this._ui.getChildByName("Text_24");
        txt.ignoreContentAdaptWithSize( true );
        txt.setString( ResMgr.inst().getString("shengji_2") + " " + (next == null ? "-" : (this._info._building_level + 1)) );

        var len = currentList.length;
        var item0 = this._ui.getChildByName("Panel_1");
        item0.setVisible(false);
        var scroll = this._ui.getChildByName("ScrollView_2");
        scroll.removeAllChildren();

        for( var i = 0; i<len; i++ )
        {
            var it = item0.clone();
            scroll.addChild( it );
            it.setVisible(true);
            this._resourceItems.push( it );

            var d = currentList[i];
            var itemUI = it.getChildByName("ico");
            itemUI.ignoreContentAdaptWithSize(true);
            itemUI.loadTexture( ResMgr.inst().getIcoPath(d.id ) );
            itemUI = it.getChildByName("text0");
            itemUI.ignoreContentAdaptWithSize(true);
            itemUI.setString( d.value + "" );
            itemUI = it.getChildByName("Text");
            itemUI.ignoreContentAdaptWithSize(true);
            itemUI.setString( d.max+ ""  );
        }
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
            item0 = this._ui.getChildByName("Panel_0");
            scroll = this._ui.getChildByName("ScrollView_1");
        }
        else
        {
            list = this._resourceItems;
            item0 = this._ui.getChildByName("Panel_1");
            scroll = this._ui.getChildByName("ScrollView_2");
        }

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
        scroll.setInnerContainerSize( size );
        scroll.jumpToTop();
        this.updateScroll(n);
    },

    //更新滚动层的上下箭头
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
        if( type ==  ccui.ScrollView.EVENT_SCROLLING )
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


    //加速
    speedCall:function( node, type )
    {
        if( type == ccui.Widget.TOUCH_ENDED )
        {
            ModuleMgr.inst().openModule("AccelerateModule", { id:node.info.configId, blockId:node.info.blockId, type:3 } );
        }
    },

    //跳转
    gotoCall:function( node, type )
    {
        if( type == ccui.Widget.TOUCH_ENDED )
        {
            //ModuleMgr.inst().openModule( "UpgradeModule" , { id:node.info.configId,blockId:node.info.blockId } );
            ModuleMgr.inst().closeModule( "UpgradeModule" );
            EventMgr.inst().dispatchEvent( CastleEvent.MOVETO_BUILDING, node.info.configId );
        }
    },

    //需求
    demandConfigButCall:function( node ,type )
    {
        if( type == ccui.Widget.TOUCH_ENDED )
        {

        }
    },

    upgradeCall:function( event, id )
    {
        for( var i=0; i<this._demandItems.length; i++ )
        {
            var item = this._demandItems[i];
            if( item.info && item.info.itemType == 0 && item.info.blockId == id )
            {
                item.removeFromParent();
                this._demandItems.splice(i,1);
            }
        }
        this.updateDemandScrollItemPos(0);

        if( id == this._blockId )
        {
            this.setResource();
        }

        this.updateDemandObjectData();
    },

});
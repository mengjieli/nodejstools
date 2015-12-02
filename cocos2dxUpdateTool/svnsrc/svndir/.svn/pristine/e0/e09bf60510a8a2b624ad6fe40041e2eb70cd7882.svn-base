

/**
 * Created by Administrator on 2015/11/27.
 *
 *
 *
 *
 *  使用说明
 *  ModuleMgr.inst().openModule("UseScrollModule", id );
 *
 *  id 不能为空
 *
 */


var UseScrollModule = ModuleBase.extend({

    _ui:null,

    _itemUI:null,
    _scroll:null,

    _resource:null,
    _items:null,
    _selectRes:null,
    _selectItem:null,

    _id:null,
    _configValue:null,
    _resId:null,

    _castleId:null,
    _x:null,
    _y:null,

    ctor:function()
    {
        this._super();
    },

    initUI:function()
    {
        this._ui = ccs.load("res/images/ui/useScroll/Layer.json","res/images/ui/").node;
        this.addChild( this._ui );

        var panel       = this._ui.getChildByName("Panel_2");
        var title       = panel.getChildByName("biaoti");
        var close       = panel.getChildByName("guanbi");
        var button      = panel.getChildByName("queren");
        var buttonText  = button.getChildByName("Text_4");
        this._itemUI    = panel.getChildByName("item");
        this._scroll    = panel.getChildByName("ScrollView_1");

        title.ignoreContentAdaptWithSize( true );
        title.setString(  ResMgr.inst().getString("useScroll_0") );
        buttonText.setString( ResMgr.inst().getString("useScroll_1") );
        close.addTouchEventListener( this.closeCall, this );
        button.addTouchEventListener( this.okCall, this );
        this._itemUI.addTouchEventListener( this.itemCall, this );
        this._itemUI.setVisible(false);
        this._resource  = [];
        var arr         = [1101001,1101002,1101003];
        for( var i=0; i<3; i++ )
        {
            var resourceItem = panel.getChildByName("Button_"+i);
            var ico          = resourceItem.getChildByName("Image_3");
            ico.ignoreContentAdaptWithSize(true);
            ico.loadTexture( ResMgr.inst().getIcoPath(arr[i]) );
            this._resource.push( resourceItem );
            resourceItem.addTouchEventListener( this.resourceCall, this );
            resourceItem.id = arr[i];
        }
        //适配
        var size = cc.director.getVisibleSize();
        this._ui.setContentSize( size );
        ccui.helper.doLayout( this._ui );

        EventMgr.inst().addEventListener( ITEM_EVENT.ITEM_UPDATE, this.itemUpdateCall, this );
    },

    destroy:function()
    {
        EventMgr.inst().removeEventListener( ITEM_EVENT.ITEM_UPDATE, this.itemUpdateCall, this );
    },

    show:function( data )
    {
        this._id = null;

        if( data == null )
        {
            ModuleMgr.inst().closeModule("UseScrollModule");
            return;
        }
        this._id            = data.id;
        this._castleId = data.castleId;
        this._x = data.x;
        this._y = data.y;
        this._selectItem    = null;
        this._selectRes     = null;
        this.updateUI();
    },

    close:function()
    {

    },

    updateUI:function()
    {
        var config =  ModuleMgr.inst().getData("ConfigTableUpdator").getConfigTableValueByKey("Territory_product",this._id );
        if( config == null )
        {
            cc.error("表出错");
            return;
        }
        //资源类型
        var itemId          = config.production;
        this._resId         = itemId;
        this._configValue   = config.output_perminute;
        for( var i=0; i<3; i++ )
        {
            var item = this._resource[i];
            this.updateResourceData( item );
        }
        //土地卷轴
        do
        {
            if( this._items != null && this._items.length > 0) break;
            this._items = [];
            var itemConfigList = ModuleMgr.inst().getData("ConfigTableUpdator").getConfigTableValueAll("Territory_levelup");
            var index = 0;
            for( var key in itemConfigList )
            {
                var it              = itemConfigList[key];
                var itemConfig      = ModuleMgr.inst().getData("ConfigTableUpdator").getConfigTableValueByKey("item",it.territory_certificate );
                var type            = itemConfig.type; //物品等级
                var ui              = this._itemUI.clone();
                ui.id               = it.territory_certificate;
                ui.multiple         = Number(it.output_multiple);
                ui.setVisible(true);
                var ico             = ui.getChildByName("ico");
                var nameUI          = ui.getChildByName("mz");
                var levelStrUI      = ui.getChildByName("dj");
                var levelUI         = ui.getChildByName("dj_0");
                var itemNum         = ui.getChildByName("Text_10");
                var select          = ui.getChildByName("slect");
                ui.select           = select;
                //ico.ignoreContentAdaptWithSize(true);
                nameUI.ignoreContentAdaptWithSize(true);
                levelStrUI.ignoreContentAdaptWithSize(true);
                levelUI.ignoreContentAdaptWithSize(true);
                itemNum.ignoreContentAdaptWithSize(true);
                select.setVisible(false);
                ico.loadTexture( ResMgr.inst().getIcoPath(ui.id) );
                nameUI.setString( ResMgr.inst().getItemName(ui.id) );
                levelStrUI.setString( ResMgr.inst().getString("useScroll_3") + ": " );
                levelUI.setString( type );
                itemNum.setString( this.getItemNum(ui.id) );

                ui.setPosition( 70 + index*120, 71 );
                this._items.push(ui);
                this._scroll.addChild( ui );
                index++;
            }
            var len  = index;
            var itemW = 120;
            var w = len * itemW ;
            var size = this._scroll.getContentSize();
            size.width = w > size.width ? w : size.width;
            this._scroll.setInnerContainerSize( size );
        }
        while ( false );
    },

    selectRes:function( ui )
    {
        if( this._selectRes != null )
        {
            this._selectRes.setTouchEnabled(true);
            this._selectRes.setBright(true);
        }
        this._selectRes = ui;
        if( this._selectRes == null ) return;
        this._selectRes.setTouchEnabled(false);
        this._selectRes.setBright(false);
    },

    selectItem:function( ui )
    {
        if( this._selectItem != null )
        {
            this._selectItem.select.setVisible(false);
        }
        this._selectItem = ui;
        if( this._selectItem == null ) return;
        this.updateResUi( this._selectItem.multiple );
        this._selectItem.select.setVisible( true );
    },

    /**
     * 更新资源的产量数字
     * @param num 卷轴的倍速
     */
    updateResUi:function( num )
    {
        for( var i=0; i<3; i++ )
        {
            var item = this._resource[i];
            this.updateResourceData( item, num);
        }
    },

    /**
     * 更新资源的产量数字
     * @param node
     * @param multiple 卷轴的倍数
     */
    updateResourceData:function( node, multiple )
    {
        if( multiple == undefined ) multiple = 1;
        var percent = 100;
        var value   = this._configValue;
        value       =  value * 60;

        if( node.id != this._resId )
        {
            percent = percent>>1;
            value   = value>>1;
        }

        value = percent * multiple;

        var name    = ResMgr.inst().getItemName( node.id );
        var itmeStr = ResMgr.inst().getString( "useScroll_2" );
        var nameUi  = node.getChildByName("Text_3");
        var valueUI = node.getChildByName("Text_3_0");
        nameUi.ignoreContentAdaptWithSize(true);
        valueUI.ignoreContentAdaptWithSize(true);
        nameUi.setString( name + " " + percent + "%");
        valueUI.setString( "+ " + value + "/" + itmeStr );
    },

    /**
     * 更新物品数量
     * @param ui
     * @param n
     */
    updateItemNum:function( ui, n )
    {
        if( ui == null ) return;
        var num = ui.getChildByName("Text_10");
        num.ignoreContentAdaptWithSize(true);
        num.setString( n );
    },

    /**
     * 获取物品数量
     * @param id  物品Id
     * @returns {number}
     */
    getItemNum:function( id )
    {
        var n = 0;
        var data = ModuleMgr.inst().getData("ItemModule");
        if( data == null ) return n;
        n = data.getCountsByItemId( id );
        return n;
    },

    /**
     * 控件回调
     */

    /**
     * 关闭的回调
     */
    closeCall:function( node,type )
    {
        if( type == ccui.Widget.TOUCH_ENDED )
        {
            ModuleMgr.inst().closeModule("UseScrollModule");
        }
    },

    /**
     * 使用的回调
     */
    okCall:function( node,type )
    {
        if( type == ccui.Widget.TOUCH_ENDED )
        {
            var str = "";
            //没选东西
            if( this._selectRes == null )
            {
                str = ResMgr.inst().getString("useScroll_4");
                ModuleMgr.inst().openModule("AlertString",{str:str});
                return;
            }
            else if( this._selectItem == null )
            {
                str = ResMgr.inst().getString("useScroll_5");
                ModuleMgr.inst().openModule("AlertString",{str:str});
                return;
            }

            //发消息 使用土地倦的消息
            var msg = new SocketBytes();
            msg.writeUint(304);
            msg.writeString(this._castleId);
            msg.writeInt(this._x);
            msg.writeInt(this._y);
            msg.writeUint(this._selectRes.id);
            msg.writeUint(this._selectItem.id);
            NetMgr.inst().send(msg);
            /////////////////////////////////////////////////////
            //关闭
            ModuleMgr.inst().closeModule("UseScrollModule");

        }
    },

    /**
     * 点击物品的回调
     */
    itemCall:function( node, type )
    {
        if( type == ccui.Widget.TOUCH_ENDED )
        {
            var strPos = node.getTouchBeganPosition();
            var endPos = node.getTouchEndPosition();
            if( Math.abs( strPos.x - endPos.x ) < 30 && Math.abs( strPos.y - endPos.y ) < 30 )
            {
                var num = this.getItemNum( node.id );
                if( num == 0 ) return;
                node.multiple;
                this.selectItem( node );
            }
        }
    },

    /**
     * 点击资源的回调
     */
    resourceCall:function( node, type )
    {
        if( type == ccui.Widget.TOUCH_ENDED )
        {
            this.selectRes( node );
        }
    },


    /**
     * 消息
     */

    /**
     * 物品数量有更新
     */
    itemUpdateCall:function( event, id, num )
    {
        if( this._items == null )return;

        for( var i in this._items )
        {
            var item = this._items[i];
            if( item.id == id )
            {
                this.updateItemNum( item, num );
                break;
            }
        }
    },
});
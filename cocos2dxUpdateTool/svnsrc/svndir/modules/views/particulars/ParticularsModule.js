/**
 * Created by Administrator on 2015/10/24.
 */

//详情

var ParticularsModule = ModuleBase.extend({


    _back:null,
    _ui:null,

    _id:null,
    _blockId:0,

    _button:null,
    ctor:function()
    {
        this._super();
    },

    initUI:function()
    {

        this._back = ccs.load("res/images/ui/publicBackdrop/Layer.json","res/images/ui/").node;
        this.addChild( this._back );

        var btn = this._back.getChildByName("Panel").getChildByName("left").getChildByName("Button");
        btn.addTouchEventListener( this.particularsCall, this );
        this._button = btn;

        var sc = 1/GameMgr.inst().scaleX;
        var minSc = GameMgr.inst().minScale;
        var down = GameMgr.inst().frameSize.height - GameMgr.inst().scaleViewSize.height;
        down = down * sc;

        var panel = this._back.getChildByName("Panel");
        var size = panel.getContentSize();
        size.height += down;
        panel.setContentSize( size );
        var left = panel.getChildByName("left");
        left.setScale( sc * minSc );
        var itemSize = left.getContentSize();
        var posY = size.height - itemSize.height >> 1;
        left.setPositionY( posY );


        var size = cc.director.getVisibleSize();
        this._back.setContentSize(size);
        ccui.helper.doLayout(this._back);

        EventMgr.inst().addEventListener( CastleEvent.UPGRADE_COMPLETE, this.upgradeLevelCall, this );
    },

    destroy: function ()
    {
        EventMgr.inst().removeEventListener( CastleEvent.UPGRADE_COMPLETE, this.upgradeLevelCall, this );
    },

    show:function( data )
    {
        if( data == null ) return;

        this._id = data.id;
        this._blockId = data.blockId;
        this.showUI();
    },

    close:function()
    {

    },

    showUI: function ()
    {

        this.updateLeft();
        this.updateRight();
        this.setRemove( this._id );
        this.upgradeLevelCall();
    },

    updateLeft:function()
    {
        var img = this._back.getChildByName("Panel").getChildByName("left").getChildByName("ico");
        img.ignoreContentAdaptWithSize( true );
        //cc.log( this._id );
        img.loadTexture( ResMgr.inst()._icoPath + this._id + "4.png" );

        var name = this._back.getChildByName("Panel").getChildByName("left").getChildByName("name");
        name.ignoreContentAdaptWithSize( true );
        name.setString(ResMgr.inst().getString(this._id + "0"));
        var msg = this._back.getChildByName("Panel").getChildByName("left").getChildByName("msg");
        var str = this._id + "1";
        msg.setString(ResMgr.inst().getString(str));

        var buttonText = this._back.getChildByName("Panel").getChildByName("left").getChildByName("Button").getChildByName("Text");
        buttonText.ignoreContentAdaptWithSize( true );
        buttonText.setString( ResMgr.inst().getString("xiangqing_0") );
    },

    _son:null,
    updateRight:function()
    {
        if( this._son )
        {
            this._son.removeFromParent();
        }

        var ui = null;
        if( this._id == 1901001 )//主城堡
        {
            ui = new CastleParticularsUI( this._id ,this._blockId );
            this.addChild( ui );
        }
        if( this._id == 1906001 )
        {
            ui = new WarehouseUI( this._id ,this._blockId );
            this.addChild( ui );
        }
        else if( this._id == 1913001 || this._id == 1913002 )
        {
            ui = new TowerParticularsUI(this._id ,this._blockId);
            this.addChild(ui);
        }
		else if(this._id == 1903001) //学院
		{
            ui = new CollegeUI( this._id,this._blockId );
            this.addChild( ui );
        }
        else if(this._id == 1907001) //城墙
        {
            ui = new TheWallUI( this._id,this._blockId );
            this.addChild( ui );
        }

        this._son = ui;
    },

    setRemove: function ( id )
    {
        this._button.setVisible( false );

        var data = ModuleMgr.inst().getData("CastleModule");
        var list = null;
        var info = null;
        if( data )
        {
            list = data.getNetBlock( );
        }

        if( list == null || list[this._blockId] == null )
        {
            return;
        }

        info = list[this._blockId];

        var buildingConfig = ModuleMgr.inst().getData("ConfigTableUpdator").getConfigTableValueByKey("castle_buildingxy", id );//ResMgr.inst().getJSON( "castle_buildingxy", id ,true );
        var config = ModuleMgr.inst().getData("ConfigTableUpdator").getConfigTableValueByKey(this.getConfigPath( buildingConfig.type ),info._building_level);

        if( config == null ) return;

        this._button.setVisible( config.demolition == 0 ? false : true );
    },

    getConfigPath:function( type )
    {

        var str = "City_";
        if( type == 6 )//仓库
        {
            str += "Storage";
        }
        else if( type = 8 ) //箭塔
        {
            str += "Tower";
        }
        else if( type == 3 )//学院
        {
            str += "College";
        }
        else if( type == 7 )//城墙
        {
            str += "Wall";
        }

        return str;
    },

    particularsCall:function( node, type )
    {
        if( type != ccui.Widget.TOUCH_ENDED )return;
        ModuleMgr.inst().closeModule("ParticularsModule");
        EventMgr.inst().dispatchEvent( CastleEvent.REMOVE_SUCCESS, this._blockId );
    },

    upgradeLevelCall:function( node, type )
    {
        var level = this._back.getChildByName("Panel").getChildByName("left").getChildByName("level");
        level.ignoreContentAdaptWithSize(true);

        var level_ = 0;
        var data = ModuleMgr.inst().getData("CastleModule");
        var list = null;
        var info = null;
        if( data )
        {
            list = data.getNetBlock( );
        }
        // ( this._blockId );
        if( list != null && list[this._blockId] != null )
        {
            info = list[this._blockId];
            if( info )
            {
                level_ = info._building_level;
            }
        }
        level.setString(ResMgr.inst().getString("xiangqing_1") + " " + level_);
    }
});
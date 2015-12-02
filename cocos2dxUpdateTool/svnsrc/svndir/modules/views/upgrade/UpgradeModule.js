/**
 * Created by Administrator on 2015/10/24.
 */

//升级

var UpgradeModule = ModuleBase.extend({

    _back: null,

    _id: null,
    _blockId: 0,

    _button:null,
    ctor: function () {
        this._super();
    },

    initUI: function () {

        this._back = ccs.load("res/images/ui/publicBackdrop/Layer.json", "res/images/ui/").node;
        this.addChild(this._back);

        var btn = this._back.getChildByName("Panel").getChildByName("left").getChildByName("Button");
        btn.addTouchEventListener(this.UpgradeCall, this);
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

        if (this._son)
        {
            if( this._son.destroy && (typeof this._son.destroy == "function") )
            {
                this._son.destroy();
            }
            this._son.removeFromParent();
        }

    },

    show: function (data)
    {
        if (data == null) return;

        this._id = data.id;//建筑ID
        this._blockId = data.blockId;//地块索引

        this.showUI();
    },

    close: function () {

    },

    showUI: function () {

        this.updateLeft();
        this.updateRight();
        this.upgradeLevelCall();
    },

    updateLeft: function () {
        var img = this._back.getChildByName("Panel").getChildByName("left").getChildByName("ico");
        img.ignoreContentAdaptWithSize(true);
        img.loadTexture(ResMgr.inst()._icoPath + this._id + "4.png");

        var name = this._back.getChildByName("Panel").getChildByName("left").getChildByName("name");
        name.ignoreContentAdaptWithSize(true);
        name.setString(ResMgr.inst().getString(this._id + "0"));
        var msg = this._back.getChildByName("Panel").getChildByName("left").getChildByName("msg");
        var str = this._id + "1";
        msg.setString(ResMgr.inst().getString(str));

        var buttonText = this._back.getChildByName("Panel").getChildByName("left").getChildByName("Button").getChildByName("Text");
        buttonText.ignoreContentAdaptWithSize(true);
        buttonText.setString(ResMgr.inst().getString("shengji_0"));
    },

    _son: null,
    updateRight: function () {
        if (this._son)
        {
            if( this._son.destroy && (typeof this._son.destroy == "function") )
            {
                this._son.destroy();
            }
            this._son.removeFromParent();
        }
        var ui = null;
        if (this._id == 1901001)//主城堡
        {
            ui = new CastleUpgradeUI(this._id, this._blockId);
            this.addChild(ui);
        }
        if (this._id == 1906001)//仓库
        {
            ui = new WarehouseUpgradeUI(this._id, this._blockId);
            this.addChild(ui);
        }
        else if (this._id == 1913001 || this._id == 1913002) //箭塔
        {
            ui = new TowerUpgradeUI(this._id, this._blockId);
            this.addChild(ui);
        }
        else if (this._id == 1903001)//学院
        {
            ui = new CollegeUpgradeUI(this._id, this._blockId );
            this.addChild(ui);
        }
        else if (this._id == 1907001)//城墙
        {
            ui = new TheWallUpgradeUI(this._id, this._blockId);
            this.addChild(ui);
        }

        this._son = ui;
    },

    UpgradeCall: function (node, type) {
        if (type != ccui.Widget.TOUCH_ENDED)return;

        EventMgr.inst().dispatchEvent(CastleEvent.UPGRADE_SUCCESS, this._blockId);
        ModuleMgr.inst().closeModule("UpgradeModule");
    },


    upgradeLevelCall:function()
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
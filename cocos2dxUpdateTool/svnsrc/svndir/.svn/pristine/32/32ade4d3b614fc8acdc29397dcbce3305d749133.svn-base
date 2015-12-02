/**
 * Created by Administrator on 2015/10/23.
 */

var MainResourcesModule = ModuleBase.extend({

    _text:null,
    _resPanel:null,
    _msgPanel:null,

    _head:null,
    _back:null,


    _filters:null,  //过滤列表
    _heads:null,    //头像列表

    _modules:null,

    ctor: function () {
        this._super();

        //NetMgr.inst().addEventListener(599, this.netUpdateItem, this);//更新道具
        //this.getItem();
        //ModuleMgr.inst().getData("ItemModule").loadItem();//测试用，获取道具
    },

    initUI: function () {

        EventMgr.inst().addEventListener(AnnouncementEvent.SEND_ANNOUNCEMENT_MSG, this.msgCall, this);
        EventMgr.inst().addEventListener(CastleEvent.UPDATE_RESOURCE, this.resourceCall, this);
        EventMgr.inst().addEventListener(ModuleEvent.SEND_OPEN_MODULE, this.openCall, this);
        EventMgr.inst().addEventListener(ModuleEvent.SEND_CLOSE_MODULE, this.closeCall, this);
        EventMgr.inst().addEventListener(CastleEvent.UPDATE_RESOURCE, this.resUpdata, this);
        //修改头像成功事件监听
        EventMgr.inst().addEventListener(HEADEVENT.CHANGE_HEAD_SUCCESS,this.updateHeadIcon,this);
        //道具更新，用于金币数量更新
        EventMgr.inst().addEventListener(ITEM_EVENT.ITEM_UPDATE,this.refreshGoldCounts,this);

        this._ui = ccs.load("res/images/ui/mainResourcesModule/Layer.json", "res/images/ui/").node;
        this.addChild(this._ui);
        //
        //var button = this._ui.getChildByName("Button_1");
        //button.addTouchEventListener( this.buttonCallBack, this );
        //
        var panel = this._ui.getChildByName("Panel");
        ModuleMgr.inst().getData("BattleUIModule").setTopBar(panel);//UI动画切换

        this._resPanel = panel.getChildByName("res_Panel");
        this._msgPanel = panel.getChildByName("msg_panel");

        var head = panel.getChildByName("res_Panel").getChildByName("head_layer").getChildByName("head");
        var headname = SelfData.getInstance().headId;
        if(headname == 0) {
            headname = ResMgr.inst().getCSV("head",1).head_id;//默认配置第一个  var headArray = ResMgr.inst().getCSV("head");
        }
        head.loadTexture(ResMgr.inst().getIcoPath(headname));
        head.setSize(70, 70);
        head.setTouchEnabled(true);
        head.addTouchEventListener( this.headCall, this );

        this._head = panel.getChildByName("res_Panel").getChildByName("head_layer");

        this._back = panel.getChildByName("res_Panel").getChildByName("Button");
        this._back.addTouchEventListener( this.backCall, this );

        var qian_layer = this._resPanel.getChildByName("qian_layer");
        qian_layer.setTouchEnabled(true);
        qian_layer.addTouchEventListener(this.goldCall,this);

        var img = panel.getChildByName("res_Panel").getChildByName("img0");
        img.loadTexture("res/images/ico/11010010.png");
        img.setSize(45, 45);
        var img = panel.getChildByName("res_Panel").getChildByName("img1");
        img.loadTexture("res/images/ico/11010020.png");
        img.setSize(45, 45);
        var img = panel.getChildByName("res_Panel").getChildByName("img2");
        img.loadTexture("res/images/ico/11010030.png");
        img.setSize(45, 45);
        var img = panel.getChildByName("res_Panel").getChildByName("img3");
        img.loadTexture("res/images/ico/1101004.png");
        img.setScale(0.8);

        this._text = new ccui.Text();
        this._text.setAnchorPoint(0,0);
        this._text.ignoreContentAdaptWithSize( true );
        this._text.setFontSize(18);
        this._text.setPosition(0,5);
        this._text.setString("");
        this._msgPanel.addChild( this._text );

        //适配
        var size = cc.director.getVisibleSize();
        this._ui.setContentSize(size);
        ccui.helper.doLayout(this._ui);

        //当前打开的模块需要返回的模块列表
        this._modules = [];

        //过滤列表
        this._filters =
        {
            "MainResourcesModule":1,
            "TileMenuModule":1,
            "BuildingUIModule":1,
            "CreateBuildingUIModule":1,
            "AccelerateModule":1,
            "AlertString":1,
            "AlertPanel":1,
            "MainMenuModule":1,
            "SignModule":1,
            "AddCollectModule":1,
            "BlockInfoModule":1,
            "BlockLevelupModule":1,
            "BattleUIModule":1
        };

        //显示头像列表
        this._heads =
        {
            "CastleModule":1,
            "BigMapModule":1
        };

        this.resUpdata();

        //temp
        //this.getItem();
        //var temp = ModuleMgr.inst().getData("ItemModule").getCountsByItemId(1103001);
        //cc.log("$$$$",temp);
    },

    acBack:function( node )
    {
        var obj = {castleId:1,resourceId:1101001,differ:50,current:10};
        this.resourceCall( null, obj );
    },

    destroy: function ()
    {
        EventMgr.inst().removeEventListener(AnnouncementEvent.SEND_ANNOUNCEMENT_MSG, this.msgCall, this);
        EventMgr.inst().removeEventListener(CastleEvent.UPDATE_RESOURCE, this.resourceCall, this);
        EventMgr.inst().removeEventListener(ModuleEvent.SEND_OPEN_MODULE, this.openCall, this);
        EventMgr.inst().removeEventListener(ModuleEvent.SEND_CLOSE_MODULE, this.closeCall, this);
        EventMgr.inst().removeEventListener(CastleEvent.UPDATE_RESOURCE, this.resUpdata, this);
        EventMgr.inst().removeEventListener(HEADEVENT.CHANGE_HEAD_SUCCESS,this.updateHeadIcon,this);

        //NetMgr.inst().removeEventListener(599, this.netUpdateItem, this);//更新道具
        EventMgr.inst().removeEventListener(ITEM_EVENT.ITEM_UPDATE,this.refreshGoldCounts,this);
    },

    show: function (data)
    {
        this.showMsg();

        if( data == null ) return;
        var b = data.isShowBack;
        if( this._head && this._back )
        {
            this._head.setVisible( !b );
            this._back.setVisible( b );
        }
    },

    close: function ()
    {

    },

    resUpdata:function()
    {
        var ui0 = this._ui.getChildByName("Panel").getChildByName("res_Panel").getChildByName("txt0");
        var ui1 = this._ui.getChildByName("Panel").getChildByName("res_Panel").getChildByName("txt1");
        var ui2 = this._ui.getChildByName("Panel").getChildByName("res_Panel").getChildByName("txt2");
        var ui3 = this._ui.getChildByName("Panel").getChildByName("res_Panel").getChildByName("txt3");
        //var ui4 = this._ui.getChildByName("Panel").getChildByName("res_Panel").getChildByName("qian_layer").getChildByName("qian");

        ui0.setString( this.getRes(1101001) );
        ui1.setString( this.getRes(1101002) );
        ui2.setString( this.getRes(1101003) );
        ui3.setString( this.getRes(1101004) );
        //ui4.setString("0");
    },

    getRes:function( id )
    {
        var data = ModuleMgr.inst().getData("CastleModule");
        if( data == null )return 0;
        var dic = data.getNetResource();
        if( dic == undefined ) return 0;
        var n = dic[id];
        if( n == undefined ) return 0;
        if( n > 0 )
        {
            cc.log( n );
            var str = StringUtils.getUnitNumber( n );
            return str;
        }
        return 0;
    },

    _count:0,
    _run:true,
    showMsg:function()
    {
        if( this._count > 0  || this._run == false ) return;

        var gg = ModuleMgr.inst().getData("announcement");
        var data = gg.getAnnouncement();
        if( data == null ) return;

        this._count = data.num;
        this._text.setString( data.msg );
        this._text.setPosition( 960,5 );

        this.run();
    },

    run:function()
    {
        this._text.setPosition( 960,5 );
        var size = this._text.getSize();
        var endPos = cc.p( -size.width, 5 );

        var ac = cc.sequence( cc.moveTo( 15, endPos ), cc.callFunc( this.actionEnd, this ) );
        this._text.runAction( ac );
    },

    actionEnd:function()
    {
        this._count --;
        if( this._count <= 0  )
        {
            this.showMsg();
            return;
        }
        this.run();
    },

    headCall:function( node, type )
    {
        if( type != ccui.Widget.TOUCH_ENDED ) return;

        cc.log("touch head icon");
        ModuleMgr.inst().openModule("HeadModule");
    },

    goldCall: function (node, type) {
        if( type != ccui.Widget.TOUCH_ENDED ) return;

        cc.log("touch gold icon");
        ModuleMgr.inst().openModule("PayModule");
    },

    backCall:function( node, type )
    {
        if( type != ccui.Widget.TOUCH_ENDED ) return;
        cc.log(this._modules.length );
        if( this._modules != null && this._modules.length > 0 )
        {
            var moduleName = this._modules.pop();
            cc.log(this._modules.length );
            ModuleMgr.inst().closeModule(moduleName);
        }

    },


    msgCall: function ()
    {
        this.showMsg();
    },

    _moduleName:null,
    openCall:function( event, moduleName )
    {
        //过滤列表
        if( this._filters[moduleName] != null ) return;

        //根据模块来显示对应东西

        var b = false;

        //是否显示头像
        if( this._heads[moduleName] == true )
        {
            b = true;
        }

        this._head.setVisible( b );
        this._back.setVisible( !b );
        //this._moduleName = moduleName;
        if( !b )this._modules.push(moduleName);
    },

    closeCall:function( event, moduleName )
    {
        //当前需要返回的模块不为空
        cc.log( this._modules.length );
        if( this._modules.length > 0 ) return;

        //过滤列表
        if( this._filters[moduleName] != null ) return;

        var b = true;

        //是否显示头像
        if( this._heads[moduleName] == true )
        {
            b = false;
        }

        this._head.setVisible( b );
        this._back.setVisible( !b );
    },
    //更新头像icon
    updateHeadIcon: function (event,data) {
        var head = this._ui.getChildByName("Panel").getChildByName("res_Panel").getChildByName("head_layer").getChildByName("head");
        head.loadTexture(ResMgr.inst().getIcoPath(SelfData.getInstance().headId));
    },

    //TODO: 测试用
    //getItem: function () {
    //    var msg = new SocketBytes();
    //    msg.writeUint(500);//加载道具列表
    //    NetMgr.inst().send(msg);
    //},

    //netUpdateItem: function (cmd, data) {
    //    if (599 == cmd) {
    //        data.resetCMDData();
    //        var itemid = data.readUint();
    //        var counts = data.readUint();
    //        //cc.log("update item",itemid,counts);
    //        if (itemid==1103001) {
    //            cc.log("黄金",counts);
    //            var ui4 = this._ui.getChildByName("Panel").getChildByName("res_Panel").getChildByName("qian_layer").getChildByName("qian");
    //            ui4.ignoreContentAdaptWithSize(true);
    //            ui4.setString( StringUtils.getUnitNumber( counts ) );
    //        }
    //    }
    //},

    refreshGoldCounts: function (event,itemid,counts) {
        if(itemid == 1103001) {
            cc.log("黄金数量更新~",counts);
            var ui4 = this._ui.getChildByName("Panel").getChildByName("res_Panel").getChildByName("qian_layer").getChildByName("qian");
            ui4.ignoreContentAdaptWithSize(true);
            ui4.setString( StringUtils.getUnitNumber( counts ) );
        }
    },

    resourceCall:function( event, obj )
    {
        if( obj == null ) return;
        var ui0         = this._ui.getChildByName("Panel").getChildByName("res_Panel").getChildByName("txt0");
        var ui1         = this._ui.getChildByName("Panel").getChildByName("res_Panel").getChildByName("txt1");
        var ui2         = this._ui.getChildByName("Panel").getChildByName("res_Panel").getChildByName("txt2");
        var ui3         = this._ui.getChildByName("Panel").getChildByName("res_Panel").getChildByName("txt3");
        var dic         = {"1101001":ui0,"1101002":ui1,"1101003":ui2,"1101004":ui3};
        var resId       = obj.resourceId;
        var v           = obj.differ;
        if( isNaN(v) )v = 0;
        if( v == 0 ) return;
        var cor         = cc.color(0,204,0);
        if( v < 0 ) cor = cc.color(255,0,0);
        var ui          = dic[resId];
        var pos         = ui.getParent().convertToWorldSpace(ui.getPosition());
        var txt         = new ccui.Text();
        txt.setFontSize(25);
        var str         = v;
        if( v < 0 ) str =  "-" + v;
        else str        =  "+" + v;
        txt.setString(str);
        txt.setPosition(pos);
        txt.setTextColor( cor );
        var ac = cc.sequence( cc.moveBy( 0.5, cc.p(0,20) ), cc.callFunc( this.txtCall,this) );
        txt.runAction( ac );
        this.addChild( txt );
    },

    txtCall:function( node )
    {
        node.removeFromParent();
    }
});
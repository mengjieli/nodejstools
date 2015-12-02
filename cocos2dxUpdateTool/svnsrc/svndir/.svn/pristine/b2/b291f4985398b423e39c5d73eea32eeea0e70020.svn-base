/**
 * Created by Administrator on 2015/10/31.
 */



AccelerateModuleType = {};
AccelerateModuleType.common = 1;
AccelerateModuleType.drill = 2; //训练加速
AccelerateModuleType.build = 3; //建造加速
AccelerateModuleType.college = 4; //学院加速



var AccelerateModule = ModuleBase.extend({

    _ui:null,

    _type:0,
    _id:0,
    _blockId:0,     //地块Id
    _collegeId:0,   //科技ID

    _progress:null,
    _progressTime:null,

    _numSlider:null,
    _numTIme:null,
    _numNum:null,
    _numAdd:null,
    _numSub:null,

    _scroll:null,

    _timeRecord:null, //毫秒
    _minNum:0,
    _maxNum:0,
    _selectId:null,

    _totalTime:0,

    _itemNum:null,
    _items:null,
    _configList:null,

    ctor:function()
    {
        this._super();
    },

    initUI:function()
    {
        this._itemNum = {};
        this._items = [];
        this._configList = [];
        this._itemNum["2001001"] = 3;
        this._itemNum["2001002"] = 3;
        this._itemNum["2001003"] = 3;

        this._itemNum["2002001"] = 3;
        this._itemNum["2002002"] = 3;
        this._itemNum["2002003"] = 3;

        this._itemNum["2003001"] = 3;
        this._itemNum["2003002"] = 3;
        this._itemNum["2003003"] = 3;

        this._itemNum["2004001"] = 3;
        this._itemNum["2004002"] = 3;
        this._itemNum["2004003"] = 3;

        this._ui = ccs.load("res/images/ui/accelerate/Layer.json","res/images/ui/").node;
        this.addChild( this._ui );

        var btn = this._ui.getChildByName("Panel_2").getChildByName("queren");
        btn.addTouchEventListener( this.butCall, this );

        var close = this._ui.getChildByName("Panel_2").getChildByName("guanbi");
        close.addTouchEventListener( this.closeCall, this );

        var btnText = this._ui.getChildByName("Panel_2").getChildByName("queren").getChildByName("Text_4");
        btnText.ignoreContentAdaptWithSize(true);
        btnText.setString( ResMgr.inst().getString("accelerate_0"));

        var msg = this._ui.getChildByName("Panel_2").getChildByName("suoming");
        msg.ignoreContentAdaptWithSize(true);
        msg.setString( ResMgr.inst().getString("accelerate_2") );


        this._progress = this._ui.getChildByName("Panel_2").getChildByName("jidu");
        this._progressTime = this._ui.getChildByName("Panel_2").getChildByName("shijian");
        this._numSlider = this._ui.getChildByName("Panel_2").getChildByName("huadongtiao");
        this._numSlider.addEventListener( this.sliderCall,this );

        this._numTIme = this._ui.getChildByName("Panel_2").getChildByName("suoming_0");
        this._numNum = this._ui.getChildByName("Panel_2").getChildByName("shurushuliang");
        this._numAdd = this._ui.getChildByName("Panel_2").getChildByName("jia");
        this._numAdd.addTouchEventListener( this.addCall, this );
        this._numSub = this._ui.getChildByName("Panel_2").getChildByName("jian");
        this._numSub.addTouchEventListener( this.subCall, this );
        this._scroll = this._ui.getChildByName("Panel_2").getChildByName("ScrollView_1");
        this._scroll.addEventListener( this.scrollCall, this );
        this._ui.getChildByName("Panel_2").getChildByName("item").setVisible( false );

        var size = cc.director.getVisibleSize();
        this._ui.setContentSize( size );
        ccui.helper.doLayout( this._ui );

        this.scheduleUpdate();
    },

    destroy:function()
    {

    },

    show:function( data )
    {
        if( data == null )
        {
            ModuleMgr.inst().closeModule("AccelerateModule");
            return;
        }

        var castData = ModuleMgr.inst().getData("CastleModule");
        if( castData == null )
        {
            ModuleMgr.inst().closeModule("AccelerateModule");
            cc.error( "CastleModule -------Data不存在" );
            return;
        }
        var info = null;

        if( data.type == AccelerateModuleType.build )
        {
            info = castData.getNetBlock( null, data.blockId );
        }
        else if( data.type == AccelerateModuleType.college )
        {
            info = castData.getNetTech( null, data.collegeId );
        }

        if( info == null )
        {
            cc.log( "数据出错" )
            ModuleMgr.inst().closeModule("AccelerateModule");
            return;
        }

        this._totalTime = info._state_remain;
        this._timeRecord = (new Date()).getTime() + this._totalTime;

        this._id = data.id;
        this._blockId = data.blockId;
        this._collegeId = data.collegeId
        this._type = data.type;

        //this._totalTime = 360000;
        //this._timeRecord = (new Date()).getTime() + this._totalTime;
        //this._type = 3;

        this.showUI();
    },

    close:function()
    {

    },

    update:function( dt )
    {
        this.updateTimeUI();
    },

    showUI:function( )
    {
        var title = this._ui.getChildByName("Panel_2").getChildByName("biaoti");

        var strN = 0;
        if( this._type == AccelerateModuleType.build )
        {
            strN = 1;
        }
        else if( this._type == AccelerateModuleType.college )
        {
            strN = 2;
        }
        title.ignoreContentAdaptWithSize(true);
        title.setString( ResMgr.inst().getString("accelerate_1_" + strN) );

        this.updateItemUI();
        this.updateTimeUI();
    },
    
    updateDataToUI: function ()
    {
        this.updateItem();
        this.updateSliderUI();
    },
    
    updateItemUI: function ()
    {
        var list = this.getList();
        this._configList = list;
        var itemUI = this._ui.getChildByName("Panel_2").getChildByName("item");
        itemUI.setVisible( false );
        var scroll = this._ui.getChildByName("Panel_2").getChildByName("ScrollView_1");
        scroll.removeAllChildren();
        for( var i=0; i<list.length; i++ )
        {
            var item = list[i];
            var ui = itemUI.clone();
            ui.id = item.item_id;
            var event = ui;
            event.addTouchEventListener( this.itemEventCall, this );
            var ico = ui.getChildByName("ico");
            ico.loadTexture( ResMgr.inst()._icoPath + ui.id + "0.png" );
            var num = ui.getChildByName("shuliang");
            var msg = ui.getChildByName("msg");
            msg.setString( ResMgr.inst().getString( ui.id + "1" ) );
            var select = ui.getChildByName("xuanze");
            select.setVisible( false );
            scroll.addChild( ui );
            ui.setVisible( true );
            ui.setPosition( 50 + i * 80, 68 );
            this._items.push( ui );
        }

        var len  = list.length;
        var itemW = 80;
        var w = 50 + len * itemW;
        var size = scroll.getContentSize();
        size.width = w > size.width ? w : size.width;
        scroll.setInnerContainerSize( size );
        scroll.jumpToLeft();

        if( list.length > 0 )
        {
            var it = list[0];
            this.setSelectId( it.item_id );
        }

        this.updateItem();

    },

    updateItem:function()
    {
        for( var i=0; i < this._items.length; i++ )
        {
            var item = this._items[i];
            var num = item.getChildByName("shuliang");
            num.ignoreContentAdaptWithSize( true );
            var n = this._itemNum[item.id];
            num.setString( n );
        }
    },

    updateTimeUI:function()
    {
        var timeLoading = this._ui.getChildByName("Panel_2").getChildByName("jidu");
        var timeTest = this._ui.getChildByName("Panel_2").getChildByName("shijian");

        var t = (new Date()).getTime();
        var tolTime = this._timeRecord - t;
        timeLoading.setPercent( tolTime/this._totalTime * 100 );

        var str = this.getTimeString( tolTime );
        timeTest.ignoreContentAdaptWithSize( true );
        timeTest.setString( str );
    },

    setSelectId:function( id )
    {
        if( this._selectId == id ) return;
        this._selectId = id;
        this.updateSliderUI();
    },

    updateSliderUI:function()
    {
        this._maxNum = this.getMaxNum();
        this._minNum = this._maxNum;
        this.updateSlider();
        this.updateItem();
    },


    updateSlider:function()
    {
        if( this._maxNum <= 0 )
        {
            //发消息提示没物品

            //显示
            this._numSlider.setPercent( 0 );
            this._numNum.setString( 0 );
            this._numTIme.setString( ResMgr.inst().getString("accelerate_3") + ":0");
            return;
        }

        var f = this._minNum/this._maxNum * 100;
        this._numSlider.setPercent( f );
        this.updateItemNum();
    },

    updateItemNum:function()
    {
        this._numNum.setString( this._minNum );
        var config = this.getConfig();
        var item = config[ this._selectId ];
        var fn = item.Numerical;

        var t = this._minNum * fn * 60 * 1000;
        var str = this.getTimeString( t );
        this._numTIme.setString( ResMgr.inst().getString("accelerate_3") + ":" + str );
    },

    //正式的更新
    updateUIByNet:function( )

    {
        var castData = ModuleMgr.inst().getData("CastleModule");
        if (castData == null) {
            ModuleMgr.inst().closeModule("AccelerateModule");
            cc.error("CastleModule -------Data不存在");
            return;
        }

        var info = null;
        if (this._type == AccelerateModuleType.build )
        {
            info = castData.getNetBlock( null, data.blockId );
            if( info == null )
            {
                ModuleMgr.inst().closeModule("AccelerateModule");
                cc.error(data.blockId + "地块数据出错");
                return;
            }
            this._totalTime = info._state_remain;
        }
        else if( this._type == AccelerateModuleType.college )
        {
            info = castData.getNetTech( null, data.blockId );
            if( info == null )
            {
                ModuleMgr.inst().closeModule("AccelerateModule");
                cc.error(data.blockId + "地块数据出错");
                return;
            }
            this._totalTime = info._state_remain;
        }

        //升级完成。关闭界面
        if( this._totalTime <= 0 )
        {
            ModuleMgr.inst().closeModule("AccelerateModule");
            return;
        }

        this._timeRecord = (new Date()).getTime() + this._totalTime;

        this.updateDataToUI();
    },

    //模拟更新
    simulationUpdateUI:function( )
    {
        if( this._minNum <= 0 )
        {
            return;
        }

        var config = this.getConfig();
        var item = config[ this._selectId ];
        var fn = item.Numerical;
        var t = this._minNum * fn * 60 * 1000;
        this._totalTime = this._totalTime - t;
        if( this._totalTime <= 0 )
        {
            //发消息给服务端加速
            ModuleMgr.inst().closeModule("AccelerateModule");
            this.sendNetMsg();
            return;
        }

        this._timeRecord = (new Date()).getTime() + this._totalTime;
        this._itemNum[this._selectId] = this._itemNum[this._selectId] - this._minNum;
        if( this._configList.length > 0 )
        {
            var it = this._configList[0];
            this.setSelectId( it.item_id );
        }

        this.updateDataToUI();
    },

    getMaxNum:function()
    {
        var config = this.getConfig();
        var item = config[ this._selectId ];
        var fn = item.Numerical;
        var t = (new Date()).getTime();
        var tolTime = this._timeRecord - t;
        var f = Math.ceil( tolTime/1000/60 );
        var max = Math.ceil( f / fn );
        var maxnum = this._itemNum[ this._selectId ];
        max = Math.min( maxnum, max );
        return max;
    },

    getList: function ()
    {
        var config = this.getConfig();

        var list = [];

        for( var key in config )
        {
            var item = config[key];
            if( item.type1 == 1 && item.type2 == this._type )
            {
                list.push( item );
            }
        }
        return list;
    },
    
    getConfig: function ()
    {
        var obj = {};
        obj["2001001"] = { item_id:2001001,type1:1,type2:1,Numerical:5,Sell:0 };
        obj["2001002"] = { item_id:2001002,type1:1,type2:1,Numerical:60,Sell:0 };
        obj["2001003"] = { item_id:2001003,type1:1,type2:1,Numerical:480,Sell:0 };

        obj["2002001"] = { item_id:2002001,type1:1,type2:2,Numerical:5,Sell:0 };
        obj["2002002"] = { item_id:2002002,type1:1,type2:2,Numerical:60,Sell:0 };
        obj["2002003"] = { item_id:2002003,type1:1,type2:2,Numerical:480,Sell:0 };

        obj["2003001"] = { item_id:2003001,type1:1,type2:3,Numerical:5,Sell:0 };
        obj["2003002"] = { item_id:2003002,type1:1,type2:3,Numerical:60,Sell:0 };
        obj["2003003"] = { item_id:2003003,type1:1,type2:3,Numerical:480,Sell:0 };

        obj["2004001"] = { item_id:2004001,type1:1,type2:4,Numerical:5,Sell:0 };
        obj["2004002"] = { item_id:2004002,type1:1,type2:4,Numerical:60,Sell:0 };
        obj["2004003"] = { item_id:2004003,type1:1,type2:4,Numerical:480,Sell:0 };

        return obj;
    },

    getTimeString:function( ms )
    {
        ms = Math.round( ms/1000 );

        if( ms <= 0 ) return "00:00:00";

        var d = 24*60*60;
        var h = 60*60;
        var f = 60;

        var dn = 0;
        var hn = 0;
        var fn = 0;

        if( ms > d )
        {
            dn = Math.floor(ms/d);
            ms = ms%d;
        }
        if( ms > h )
        {
            hn = Math.floor( ms/h );
            ms =  ms%h;
        }
        if( ms > f )
        {
            fn = Math.floor( ms/f );
            ms =  ms%f;
        }
        var str = "";

        if( dn > 0 )
        {
            str = dn + "d ";
        }
        str += this.zeroPadding( hn ) + ":";
        str += this.zeroPadding( fn ) + ":";
        str += this.zeroPadding( ms );
        return str;
    },

    zeroPadding:function( n )
    {
        var s = "" + n;
        if( n < 10 )
        {
            s = "0" + n;
        }

        return s;
    },

    butCall:function(node,type)
    {
        if( type != ccui.Widget.TOUCH_ENDED )return;
        if( this._minNum <= 0 )
        {
            //提示
            return;
        }

        if( this.canClose() && this._totalTime <= 0 )
        {
            //关闭
            ModuleMgr.inst().closeModule("AccelerateModule");
        }

        if( this._totalTime <= 0  ) return;
        
        this.simulationUpdateUI();

    },

    sendNetMsg:function()
    {

        if( AccelerateModuleType.drill == this._type ) //训练
        {

        }
        else if( AccelerateModuleType.build == this._type ) //建筑
        {
            EventMgr.inst().dispatchEvent( CastleEvent.SPEED_SUCCESS, this._blockId );
        }
        else if( AccelerateModuleType.college == this._type ) //建筑
        {
            EventMgr.inst().dispatchEvent( CastleEvent.TECH_SPEED_SUCCESS, this._collegeId );
        }
    },

    canClose:function()
    {
        var config = this.getConfig();
        var item = config[ this._selectId ];
        var fn = item.Numerical;
        var ms = this._minNum * fn * 60 * 1000;

        var t = (new Date()).getTime();
        var tolTime = this._timeRecord - t;

        var b = false;
        if( ms >= tolTime )
        {
            b = true;
        }
        return true;
    },


    closeCall:function(node,type)
    {
        if( type != ccui.Widget.TOUCH_ENDED )return;
        ModuleMgr.inst().closeModule("AccelerateModule");
    },

    scrollCall:function(node,type)
    {

    },

    sliderCall:function( node, type )
    {
        if( type == ccui.Slider.EVENT_PERCENT_CHANGED )
        {
            var num = node.getPercent();
            var n = Math.ceil(num / 100 * this._maxNum);
            this._minNum = n;
            this.updateItemNum();
        }
    },

    addCall:function( node,type )
    {
        if( type != ccui.Widget.TOUCH_ENDED ) return;

        if( this._maxNum <= 0 ) return;
        this._minNum ++;
        this._minNum = Math.min( this._minNum, this._maxNum );
        this.updateSlider();

    },

    subCall:function( node,type )
    {
        if( type != ccui.Widget.TOUCH_ENDED ) return;

        if( this._maxNum <= 0 ) return;
        this._minNum --;
        this._minNum = Math.max( this._minNum, 0 );
        this.updateSlider();
    },

    itemEventCall:function( node, type )
    {
        if( type != ccui.Widget.TOUCH_ENDED ) return;

        var id = node.id;
        cc.log( id );
        this.setSelectId( id );
    }

});
/**
 * Created by Administrator on 2015/11/4.
 */


var CitadelResourceModule = ModuleBase.extend({

    _ui: null,


    _selectMenuType: -1,     //选择类型
    _tabsIds: null,          //菜单列表
    _menuButton: null,       //菜单按钮
    _menuBack: null,         //下拉菜单背景
    _menu: null,             //下拉菜单
    _menuBasis: null,        //基础资源按钮
    _menuStrategic: null,    //战略资源按钮
    _menuBasisText: null,
    _menuStrategicText: null,

    _tabs: null,             //TAB列表
    _selectTab: null,        //当前现在的Tab

    _scroll:null,
    _sliderBack:null,
    _slider:null,

    _landTable:null,

    ctor: function () {
        this._super();
    },

    initUI: function ()
    {

        //读表
        //this.createTable();

        this._ui = ccs.load("res/images/ui/citadelResource/Layer.json", "res/images/ui/").node;
        this.addChild(this._ui);

        var harvest = this._ui.getChildByName("Panel_2").getChildByName("Panel_3").getChildByName("Button_3");
        harvest.setTitleText( ResMgr.inst().getString("citadelResource_2") );
        harvest.addTouchEventListener( this.harvestCall, this );

        //菜单
        this._tabsIds = [["1101001", "1101002", "1101003"], ["1102001", "1102002", "1102003", "1102004"]];
        this._menuButton = this._ui.getChildByName("Panel_2").getChildByName("Panel_3").getChildByName("Button_2");
        this._menuButton.setTitleText(ResMgr.inst().getString("citadelResource_1"));
        this._menuButton.addTouchEventListener(this.menuButtonCall, this);
        this._menuBack = this._ui.getChildByName("Panel_4");
        this._menuBack.addTouchEventListener(this.menuBackCall, this);
        this._menu = this._ui.getChildByName("Image_6");
        this._menuBasis = this._ui.getChildByName("Image_6").getChildByName("back0");
        this._menuBasisText = this._ui.getChildByName("Image_6").getChildByName("Text0");
        this._menuBasisText.setString(ResMgr.inst().getString("citadelResource_13"));
        this._menuBasis.addTouchEventListener(this.menuBasisCall, this);
        this._menuStrategic = this._ui.getChildByName("Image_6").getChildByName("back1");
        this._menuStrategicText = this._ui.getChildByName("Image_6").getChildByName("Text1");
        this._menuStrategicText.setString(ResMgr.inst().getString("citadelResource_14"));
        this._menuStrategic.addTouchEventListener(this.menuStrategicCall, this);

        //tab
        this._tabs = [];
        var panel = this._ui.getChildByName("Panel_2").getChildByName("Panel_3");
        for( var i=0; i<4; i++ )
        {
            var ui = panel.getChildByName( "Image_"+i );
            ui.setVisible( false );
            ui.setTouchEnabled(true);
            ui.ignoreContentAdaptWithSize( true );
            ui.addTouchEventListener( this.tabItemCall,this );
            ui.index = i;
            this._tabs.push(ui);
        }
        var xt = this._ui.getChildByName("Panel_2").getChildByName("Panel_3").getChildByName("xiaotiao");
        xt.setLocalZOrder(20);


        //适配
        var down = GameMgr.inst().frameSize.height - GameMgr.inst().scaleViewSize.height;
        down = down * (1/GameMgr.inst().scaleX);

        var di = this._ui.getChildByName("Panel_2").getChildByName("Panel_5");
        var size = di.getContentSize();
        size.height += down;
        di.setContentSize( size );
        var posY = di.getPositionY();
        posY -= down;

        di.setPositionY( posY );

        var img1 = di.getChildByName("Image_11");
        var img2 = di.getChildByName("Image_11_0");
        size = img1.getContentSize();
        size.height += (down >> 1);

        img1.setContentSize( size );
        img2.setContentSize( size );

        var scroll = di.getChildByName("ScrollView_1");
        var size = scroll.getContentSize();
        size.height += down;
        scroll.setContentSize( size );
        this._scroll = scroll;
        scroll.addTouchEventListener( this.scrollTouchCall, this );
        scroll.addEventListener(this.scrollOneCall, this );
        var sliderBack = di.getChildByName("Panel_7");
        var backSize = sliderBack.getContentSize();
        backSize.height += down;
        sliderBack.setContentSize( backSize );
        this._sliderBack = sliderBack;
        this._sliderBack.setOpacity(0);
        var slider = sliderBack.getChildByName("Slider_2");
        slider.setAnchorPoint( 0.5,0.5 );
        slider.setTouchEnabled(false);
        var size = slider.getContentSize();
        size.width += down;
        slider.setContentSize( size );
        var posX = backSize.width >> 1 ;
        slider.setPositionX( posX );
        var posY = backSize.height >> 1 ;
        slider.setPositionY( posY );
        this._slider = slider;

        ccui.helper.doLayout( di );
        var size = cc.director.getVisibleSize();
        this._ui.setContentSize(size);
        ccui.helper.doLayout(this._ui);
        //默认选择基础资源
        this.setSelectMenuType( 0 );
        this.loadRes();

        NetMgr.inst().addEventListener( 0, this.cmdCall, this )
    },

    destroy: function ()
    {
        NetMgr.inst().removeEventListener( 0, this.cmdCall, this )
    },

    show: function (data)
    {

    },

    close: function () {

    },

    createTable:function()
    {
        var config = ModuleMgr.inst().getData("ConfigTableUpdator").getConfigTableValueAll("Territory_product");
        this._landTable = {};

        for( var key in config )
        {
            var item = config[key];
            var id = item.territory_id + "" + item.production;
            this._landTable[id] = item;
        }

    },

    loadRes:function()
    {
        var data = ModuleMgr.inst().getData("CastleModule");
        var castleId = data._currentCastleId;
        //ProfileData.getInstance().castle.id;
        //cc.log( ProfileData.getInstance().castle.id );
        //cc.log( castleId );
        var msg = new SocketBytes();
        msg.writeUint(413);
        msg.writeString(castleId);
        NetMgr.inst().send( msg );
    },

    //设置菜单类型,-1没选中,0基础资源,1战略资源
    setSelectMenuType: function (i)
    {
        if (this._selectMenuType == i) return;
        this._selectMenuType = i;

        this.updateMenuSelect();

        this._selectTab = null;
        this.setSelectTab( 0 );
    },

    //设置Tab
    setSelectTab:function( index )
    {
        if( this._selectTab && this._selectTab.index == index ) return;

        if( this._selectTab != null )
        {
            this._selectTab.ignoreContentAdaptWithSize( true );
            this._selectTab.loadTexture("gy_yeqian_xuanze.png", ccui.Widget.PLIST_TEXTURE);
            ccui.helper.doLayout( this._selectTab );
            this._selectTab = null;
        }

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

    //更新选择
    updateMenuSelect: function ()
    {

        //处理tab
        this.updateTab();
        //处理菜单
        this.updateMenu();

    },

    //跟新Tab标签
    updateTab:function()
    {
        var obj = this._tabsIds[this._selectMenuType];
        for( var i in this._tabs )
        {
            var ui = this._tabs[i];
            ui.setVisible( false );
        }
        if( obj == null )return;

        var len = obj.length;
        for( var i=0; i<len; i++ )
        {
            var id = obj[i];
            var ui = this._tabs[i];
            if( ui == null ) continue;

            ui.setVisible( true );
            var txt = ui.getChildByName("Text");
            txt.ignoreContentAdaptWithSize( true );
            txt.setString( ResMgr.inst().getString( id + "0") );
        }
    },

    //跟新菜单标签
    updateMenu: function ()
    {
        //处理菜单
        var b1 = true;
        var b2 = true;
        if (this._selectMenuType != -1)
        {
            b1 = this._selectMenuType == 0 ? true : false;
            b2 = this._selectMenuType == 1 ? true : false;
        }

        this._menuBasisText.setTextColor( b1 ? cc.color(255,255,255) : cc.color(134,134,134) );
        this._menuStrategicText.setTextColor( b2 ? cc.color(255,255,255) : cc.color(134,134,134) );

        this._menuBasis.setOpacity( b1 ? 255 : 0 );
        this._menuStrategic.setOpacity( b2 ? 255 : 0 );

    },

    updateUI:function()
    {
        this._scroll.removeAllChildren();
        var title = this._ui.getChildByName("Panel_2").getChildByName("Image_tou");
        title.setVisible( false );
        var manor = title.getChildByName("liangshi");
        var manorNum = title.getChildByName("liangshi_shu");
        manorNum.setString("0");
        var total = title.getChildByName("zong_chan");
        var totalIco = title.getChildByName("ico_0");
        var totalNum = title.getChildByName("zong_shu");
        totalNum.ignoreContentAdaptWithSize(true);
        totalNum.setString("0");

        var consume = title.getChildByName("zong_hao");
        var consumeIco = title.getChildByName("ico_1");
        var consumeNum = title.getChildByName("zong_hao_shu");
        consumeNum.setString("0");


        var item = this._ui.getChildByName("Panel_2").getChildByName("Panel_5").getChildByName("item");

        if( this._selectTab == null ) return;

        var obj = this._tabsIds[this._selectMenuType];
        var id = obj[ this._selectTab.index ];
        title.setVisible( true );
        manor.ignoreContentAdaptWithSize( true );
        manor.setString( ResMgr.inst().getString(id + "0") + ResMgr.inst().getString("citadelResource_3") + ":");

        total.ignoreContentAdaptWithSize( true );
        total.setString( ResMgr.inst().getString("citadelResource_4") );
        totalIco.ignoreContentAdaptWithSize( true );
        totalIco.loadTexture( ResMgr.inst().getIcoPath( id ) );

        consume.ignoreContentAdaptWithSize( true );
        consume.setString( ResMgr.inst().getString("citadelResource_5") );
        consumeIco.ignoreContentAdaptWithSize( true );
        consumeIco.loadTexture( ResMgr.inst().getIcoPath( id ) );

        //var objData = {};
        var list = this.getInfoList( id );
        //for( var i=0; i<10; i++ )
        //{
        //    var itemInfo = objData[]
        //    list.push( objData[i] );
        //}

        var len = list.length;
        var item0 = item;
        item0.setVisible(false);
        var scroll = this._scroll;
        var itemH = item0.getContentSize().height;
        itemH += 2;
        var h = len * itemH;
        var size = scroll.getContentSize();
        size.height = h > size.height ? h : size.height;

        manorNum.ignoreContentAdaptWithSize(true);
        manorNum.setString( len );
        var tal = 0;
        for( var i=0; i<len; i++  )
        {
            var it = item0.clone();
            it.setTouchEnabled(false);
            scroll.addChild( it );
            it.setVisible(true);
            it.setPosition( 0, (size.height - itemH) - i*itemH );

            var data = list[i];
            var str = JSON.stringify(data);

            var double = it.getChildByName("sb");
            double.setVisible( data.useAccelerationCard );
            var pos = it.getChildByName("zb");
            pos.ignoreContentAdaptWithSize( true );
            pos.setString( ResMgr.inst().getString("citadelResource_7") );
            var posNum = it.getChildByName("zb_t");
            posNum.ignoreContentAdaptWithSize(true);
            posNum.setString( "x: " + Math.floor(data.coordX) + " Y: " + Math.floor(data.coordY) );
            var production = it.getChildByName("dgcc");
            production.ignoreContentAdaptWithSize( true );
            production.setString( ResMgr.inst().getString("citadelResource_8") );
            var productionNum = it.getChildByName("dgcc_t");
            var productionIco = it.getChildByName("ico0");
            productionIco.ignoreContentAdaptWithSize( true );
            productionIco.loadTexture( ResMgr.inst().getIcoPath( id ));
            var typeID = ServerMapConfig.getInstance().getBlock(data.coordX,data.coordY).type;
            var pn = this.getSingleOutput( typeID, id, data.earthCard );
            tal += pn;
            productionNum.ignoreContentAdaptWithSize(true);
            productionNum.setString( pn + "/" + ResMgr.inst().getString("citadelResource_6") );

            var current = it.getChildByName("dqjr");
            current.ignoreContentAdaptWithSize( true );
            current.setString( ResMgr.inst().getString("citadelResource_9") );
            var dqjrNum = it.getChildByName("dqjr_t");
            var dqjrIco = it.getChildByName("ico1");
            dqjrIco.ignoreContentAdaptWithSize( true );
            dqjrIco.loadTexture(ResMgr.inst().getIcoPath( id ));
            dqjrNum.ignoreContentAdaptWithSize(true);
            dqjrNum.setString( StringUtils.getUnitNumber(data.resourceAmount) );

            var max = it.getChildByName("dqjrsx");
            max.ignoreContentAdaptWithSize( true );
            max.setString( ResMgr.inst().getString("citadelResource_10") );
            var maxNum = it.getChildByName("dqjrsx_t");
            var maxIco = it.getChildByName("ico2");
            maxIco.ignoreContentAdaptWithSize( true );
            maxIco.loadTexture(ResMgr.inst().getIcoPath( id ));
            var maxN = this.getSingleCeiling( typeID, id, data.earthCard );
            maxNum.ignoreContentAdaptWithSize(true);
            maxNum.setString( StringUtils.getUnitNumber(maxN) )
            var button = it.getChildByName("Button");
            button.setTitleText( ResMgr.inst().getString( data.isDouble ? "citadelResource_12" : "citadelResource_11"));
            button.setEnabled( !data.useAccelerationCard );
            button.setBright( !data.useAccelerationCard );

        }
        totalNum.setString( tal + "/" + ResMgr.inst().getString("citadelResource_6"));
        scroll.setInnerContainerSize( size );
        scroll.jumpToTop();
        //this.updateScroll(0);

    },

    getInfoList:function( id )
    {
        var data = ModuleMgr.inst().getData("CastleModule");
        var castleId = data._currentCastleId;
        var list = BigMapActionData.getInstance().getCastleEarth(castleId,id);
        return list;
    },

    updateSlider:function()
    {
        if( this._scroll == null || this._slider == null ) return;

        var panelH = this._scroll.getContentSize().height;
        var textH = this._scroll.getInnerContainerSize().height ;
        var pos = this._scroll.getInnerContainer().getPosition();

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
        var posY = Math.abs( pos.y );
        var p = 0;
        p = posY / ( textH - panelH );
        p = Math.round(p * 100);
        if (p < 0) p = 0;
        if (p > 100) p = 100;
        p = (100 - p);
        if( isNaN(p) ) p = 0;

        this._slider.setPercent( p );
    },


    /**
     * 获取单个产出
     * @param landId  地块
     * @param resId     资源
     * @param tiredId   倦
     */
    getSingleOutput:function( landId, resId, tiredId )
    {
        var config = ModuleMgr.inst().getData("ConfigTableUpdator").getConfigTableValueByKey("Territory_product", landId);
        if( config == null ) return 0;
        var v = Number(config.output_perminute);
        var percent = 1;
        if( config.production != resId )
        {
            percent = 0.5;
        }
        v = v * percent;
        var tiredConfig = ModuleMgr.inst().getData("ConfigTableUpdator").getConfigTableValueByKey("Territory_levelup", tiredId );
        var m = Number(tiredConfig.output_multiple);
        var n = v * m;
        return n;
    },

    /**
     * 获取产出上限
     * @param landId  地块
     * @param resId     资源
     * @param tiredId   倦
     */
    getSingleCeiling:function( landId, resId, tiredId )
    {
        var config = ModuleMgr.inst().getData("ConfigTableUpdator").getConfigTableValueByKey("Territory_product", landId);
        if( config == null ) return 0;
        var v = Number(config.resource_max);
        var percent = 1;
        if( config.production != resId )
        {
            percent = 0.5;
        }
        v = v * percent;
        var tiredConfig = ModuleMgr.inst().getData("ConfigTableUpdator").getConfigTableValueByKey("Territory_levelup", tiredId );
        var m = Number(tiredConfig.resource_multiple);
        var n = v * m;
        return n;
    },

    /**
     * 控件回调
     */

    //一键收获
    harvestCall:function( node, type )
    {
        if (type == ccui.Widget.TOUCH_ENDED)
        {
            var msg = new SocketBytes();
            msg.writeUint(412);
            msg.writeString(ProfileData.getInstance().castle.id);
            NetMgr.inst().send(msg);
        }
    },

    menuButtonCall:function( node, type )
    {
        if (type == ccui.Widget.TOUCH_ENDED)
        {
            var b = this._menuBack.isVisible();
            this._menuBack.setVisible( !b );
            this._menu.setVisible( !b );
        }
    },

    menuBackCall:function( node, type )
    {
        if (type == ccui.Widget.TOUCH_ENDED)
        {
            this._menuBack.setVisible( false );
            this._menu.setVisible( false );
        }
    },

    menuBasisCall:function( node ,type )
    {
        if (type == ccui.Widget.TOUCH_ENDED)
        {
            this._menuBack.setVisible( false );
            this._menu.setVisible( false );
            this.setSelectMenuType( 0 );
        }
    },

    menuStrategicCall:function( node ,type )
    {
        if (type == ccui.Widget.TOUCH_ENDED)
        {
            this._menuBack.setVisible( false );
            this._menu.setVisible( false );
            this.setSelectMenuType( 1 );
        }
    },

    tabItemCall:function( node, type )
    {
        if( type == ccui.Widget.TOUCH_ENDED )
        {
            this.setSelectTab( node.index );
        }
    },

    scrollOneCall:function( node, type )
    {
        if( type ==  ccui.ScrollView.EVENT_SCROLLING || type == ccui.ScrollView.EVENT_BOUNCE_TOP || type == ccui.ScrollView.EVENT_BOUNCE_BOTTOM )
        {
            this.updateSlider();
        }
    },

    scrollTouchCall:function( node, type )
    {
        if( type == ccui.Widget.TOUCH_BEGAN )
        {
            this._sliderBack.stopAllActions();
            var sc = cc.fadeTo(0.2,255);
            this._sliderBack.runAction( sc );
        }
        else if( type == ccui.Widget.TOUCH_ENDED || type == ccui.Widget.TOUCH_CANCELED)
        {
            this._sliderBack.stopAllActions();
            var sc = cc.fadeTo(0.2,0);
            this._sliderBack.runAction( sc );
        }
    },

    /**
     * 消息回调
     */
    cmdCall:function( cmd, msg )
    {
        msg.resetCMDData();
        var id = msg.readUint();
        if( id == 413 )
        {
            this.updateUI();
        }
    },
});
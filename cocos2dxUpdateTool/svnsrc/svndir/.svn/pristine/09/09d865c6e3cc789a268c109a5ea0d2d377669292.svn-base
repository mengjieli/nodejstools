/**
 * Created by cgMu on 2015/10/27.
 */

var CollegeUpgradeUI = cc.Node.extend({
    _ui:null,
    _id:0,
    _index:0,
    _level:0,

    _building:null,//当前是否正在升级
    _need:null,//升级限制
    _needResources:null,//升级资源

    _resIDArray:null,

    _itemArray:null,
    _scrollview:null,
    _itemRoot:null,

    //id:当前建筑ID；index：地块索引
    ctor:function( id,index ) {
        this._super();
        this._id = id;
        this._index = index;
        this._itemArray = [];

        //根据当前等级获取升级数据
        var blockData = ModuleMgr.inst().getData("CastleModule").getNetBlock()[this._index];
        this._level = blockData._building_level;

        this.initUI();

        EventMgr.inst().addEventListener( CastleEvent.UPGRADE_COMPLETE, this.upgradeCall, this );
    },

    initUI:function() {
        this._ui = ccs.load("res/images/ui/TheWall/Wall_Upgrade_Layer.json","res/images/ui/").node;
        this.addChild( this._ui );

        //适配
        var size = cc.director.getVisibleSize();
        this._ui.setContentSize(size);
        ccui.helper.doLayout(this._ui);

        var down = GameMgr.inst().frameSize.height - GameMgr.inst().scaleViewSize.height;
        down = down * (1/GameMgr.inst().scaleX);

        //var resData = ModuleMgr.inst().getData("CastleModule").getNetResource();

        var gy_xiangqing_shanglan_01_2 = this._ui.getChildByName("gy_xiangqing_shanglan_01_2");
        var posY = gy_xiangqing_shanglan_01_2.getPositionY();
        posY += down;
        gy_xiangqing_shanglan_01_2.setPositionY( posY );

        var gy_xiangqing_shanglan_01_2_0 = this._ui.getChildByName("gy_xiangqing_shanglan_01_2_0");
        var posY = gy_xiangqing_shanglan_01_2_0.getPositionY();
        posY += down;
        gy_xiangqing_shanglan_01_2_0.setPositionY( posY );

        var gy_xiangqing_xialan_01_4 = this._ui.getChildByName("gy_xiangqing_xialan_01_4");
        var posY = gy_xiangqing_xialan_01_4.getPositionY();
        posY += down;
        gy_xiangqing_xialan_01_4.setPositionY( posY );

        var Image_5 = this._ui.getChildByName("Image_5");
        var posY = Image_5.getPositionY();
        posY += down;
        Image_5.setPositionY( posY );

        var text1 = this._ui.getChildByName("Text_1");
        var posY = text1.getPositionY();
        posY += down;
        text1.setPositionY( posY );
        text1.ignoreContentAdaptWithSize(true);
        text1.setString(ResMgr.inst().getString("shengji_1"));

        var text2 = this._ui.getChildByName("Text_1_0");
        var posY = text2.getPositionY();
        posY += down;
        text2.setPositionY( posY );
        text2.ignoreContentAdaptWithSize(true);
        text2.setString(ResMgr.inst().getString("shengji_2")+" "+(this._level+1));

        var scrollview = this._ui.getChildByName("ScrollView_1");
        var posY = scrollview.getPositionY();
        posY += down;
        scrollview.setPositionY( posY );
        scrollview.addEventListener(this.scrollCall, this );
        this._scrollview = scrollview;

        var item0 = scrollview.getChildByName("Panel_1");
        item0.setVisible(false);
        this._itemRoot = item0;

        this.refreshContent();

        var image1 = ccui.helper.seekWidgetByName(this._ui,"Image_6");
        image1.setVisible(false);
        var la = ccui.helper.seekWidgetByName(this._ui,"Text_4_0");
        la.setVisible(false);
        var des = ccui.helper.seekWidgetByName(this._ui,"Text_4");
        des.ignoreContentAdaptWithSize(true);
        des.setString(ResMgr.inst().getString("college_1"))
    },

    refreshContent: function () {
        this._building=[];
        this._need=[];
        this._needResources=[];
        this._resIDArray = [];

        for (var i in this._itemArray) {
            if (this._itemArray[i]) {
                this._itemArray[i].removeFromParent(true);
            }
        }
        this._itemArray = [];

        var resData = ModuleMgr.inst().getData("CastleModule").getNetResource(); //获取资源数据

        //获取数据
        var nextLevel = this._level+1;
        var levelUpData = ModuleMgr.inst().getData("ConfigTableUpdator").getConfigTableValueByKey("City_College",nextLevel);
        cc.log("当前建筑",this._id,"等级",this._level,levelUpData.demolition,levelUpData.levelup_time);
        var building = ModuleMgr.inst().getData("CastleModule").getNetBlockByState(CastleData.STATE_UPGRADE);
        cc.log("正在升级的建筑个数 ",building.length);
        if (building.length>0) {
            this._building.push(building[0]);
        }
        this._need.push(eval("(" + levelUpData.need + ")"));
        var temp3 = eval("(" + levelUpData.need_resource + ")");
        for(var i in temp3) {
            var temp = {};
            temp.key = i;
            temp.value = temp3[i];
            this._needResources.push(temp);
        }

        //ui加载
        var size = this._scrollview.getContentSize();
        var counts = this._building.length + this._need.length + this._needResources.length;
        var itemH = this._itemRoot.getContentSize().height;
        var h = counts * itemH;
        h = h > size.height ? h : size.height;

        var scrollview = this._scrollview;
        var item0 = this._itemRoot;

        var index = 0;
        for (var i = 0 ; i < this._building.length; i++) {
            index += 1;
            var it = item0.clone();
            scrollview.addChild( it );
            this._itemArray.push(it);
            it.setVisible(true);
            it.setPosition( 0,h - index*itemH );
            if ( index % 2 == 0 ) {
                var b = it.getChildByName("Image_1");
                b.loadTexture("gy_xiangqing_xialan_di_01.png", ccui.Widget.PLIST_TEXTURE);
            }
            var itemUI = it.getChildByName("Image_2");
            itemUI.ignoreContentAdaptWithSize(true);
            itemUI.loadTexture("gy_shalou.png",ccui.Widget.PLIST_TEXTURE);
            var itemCounts = it.getChildByName('Text_3');
            itemCounts.ignoreContentAdaptWithSize(true);
            itemCounts.setString(ResMgr.inst().getString(this._building[i]._building_id+"0")+ResMgr.inst().getString("xiangqing_18"));
            itemCounts.setTextColor(cc.color(255,0,0,255));

            this._resIDArray.push(this._building[i]._building_id);
            this._resBlockIndex = this._building[i]._index;

            var itemCheck = it.getChildByName("Image_2_0");
            itemCheck.ignoreContentAdaptWithSize(true);
            itemCheck.loadTexture("gy_cuo_01.png",ccui.Widget.PLIST_TEXTURE);
            var btn = ccui.helper.seekWidgetByName(it,"Button_1");
            btn.addTouchEventListener(this.btnCallback,this);
            btn.setTag(index);
            btn.infoTag = 1;
            var btnTitle = ccui.helper.seekWidgetByName(it,"Text_2");
            btnTitle.ignoreContentAdaptWithSize(true);
            btnTitle.setString(ResMgr.inst().getString("xiangqing_16"));
        }
        for (var i = 0 ; i < this._need.length; i++) {
            index += 1;
            var it = item0.clone();
            scrollview.addChild( it );
            this._itemArray.push(it);
            it.setVisible(true);
            it.setPosition( 0,h - index*itemH );
            if ( index % 2 == 0 ) {
                var b = it.getChildByName("Image_1");
                b.loadTexture("gy_xiangqing_xialan_di_01.png", ccui.Widget.PLIST_TEXTURE);
            }
            for (var key in this._need[i]) {

                cc.log("need", key,this._need[i][key]);
                var blockData = ModuleMgr.inst().getData("CastleModule").getNetBlockByBuildingId(key);
                //cc.log("need",key,"当前等级",blockData._building_id,blockData._building_level);
                var nowLevel = blockData[0]._building_level;
                //for (var x in blockData) {
                //    nowLevel = blockData[x]._building_level;
                //    if
                //}

                var itemUI = it.getChildByName("Image_2");
                itemUI.ignoreContentAdaptWithSize(true);
                itemUI.loadTexture(ResMgr.inst()._icoPath+"11040010.png");//(ResMgr.inst()._icoPath+key+"0.png");
                //itemUI.setScale(0.1);
                var itemCounts = it.getChildByName('Text_3');
                itemCounts.ignoreContentAdaptWithSize(true);
                itemCounts.setString(ResMgr.inst().getString(key+"0")+ResMgr.inst().getString("xiangqing_1")+this._need[i][key]);

                this._resIDArray.push(key);
                this._resIndexId = blockData[0]._index;

                //判断是否满足
                if (this._need[i][key]>nowLevel) {
                    itemCounts.setTextColor(cc.color(255,0,0,255));
                    var itemCheck = it.getChildByName("Image_2_0");
                    itemCheck.ignoreContentAdaptWithSize(true);
                    itemCheck.loadTexture("gy_cuo_01.png",ccui.Widget.PLIST_TEXTURE);
                    var btn = ccui.helper.seekWidgetByName(it,"Button_1");
                    btn.infoTag = 2;
                    btn.addTouchEventListener(this.btnCallback,this);
                    btn.setTag(index);
                    var btnTitle = ccui.helper.seekWidgetByName(it,"Text_2");
                    btnTitle.ignoreContentAdaptWithSize(true);
                    btnTitle.setString(ResMgr.inst().getString("xiangqing_17"));
                }
                else {
                    var btn = ccui.helper.seekWidgetByName(it,"Button_1");
                    btn.setVisible(false);
                }
            }
        }
        for (var i = 0 ; i < this._needResources.length; i++) {
            index += 1;
            var it = item0.clone();
            scrollview.addChild( it );
            this._itemArray.push(it);
            it.setVisible(true);
            it.setPosition( 0,h - index*itemH );
            if ( index % 2 == 0 ) {
                var b = it.getChildByName("Image_1");
                b.loadTexture("gy_xiangqing_xialan_di_01.png", ccui.Widget.PLIST_TEXTURE);
            }
            var key = this._needResources[i]["key"];

            this._resIDArray.push(key);

            var itemUI = it.getChildByName("Image_2");
            itemUI.ignoreContentAdaptWithSize(true);
            itemUI.loadTexture(ResMgr.inst()._icoPath+key+"0.png");
            var itemCounts = it.getChildByName('Text_3');
            itemCounts.ignoreContentAdaptWithSize(true);
            itemCounts.setString(this._needResources[i]["value"]);
            //判断是否满足
            //获取资源数量
            //cc.log("资源 ",key, "值 ",resData[key]);
            if (parseInt(this._needResources[i]["value"]) > parseInt(resData[key])) {
                itemCounts.setTextColor(cc.color(255,0,0,255));
                var itemCheck = it.getChildByName("Image_2_0");
                itemCheck.ignoreContentAdaptWithSize(true);
                itemCheck.loadTexture("gy_cuo_01.png",ccui.Widget.PLIST_TEXTURE);
                var btn = ccui.helper.seekWidgetByName(it,"Button_1");
                btn.addTouchEventListener(this.btnCallback,this);
                btn.setTag(index);
                btn.infoTag = 3;
                var btnTitle = ccui.helper.seekWidgetByName(it,"Text_2");
                btnTitle.ignoreContentAdaptWithSize(true);
                btnTitle.setString(ResMgr.inst().getString("xiangqing_15"));
            }
            else {
                var btn = ccui.helper.seekWidgetByName(it,"Button_1");
                btn.setVisible(false);
            }
        }

        size.height = h > size.height ? h : size.height;
        scrollview.setInnerContainerSize( size );
        scrollview.jumpToTop();
        this.updateScroll();
    },

    btnCallback: function (sender, type) {
        if (type == ccui.Widget.TOUCH_ENDED) {
            var tag = sender.getTag();
            //sender.infoTag;
            cc.log("touch callback tag ",tag, "id ",this._resIDArray[tag-1]);
            switch (sender.infoTag) {
                case 1:
                    cc.log("加速");
                    //ModuleMgr.inst().openModule("AccelerateModule", { id:this._resIDArray[tag-1], type:3 } );
                    ModuleMgr.inst().openModule("AccelerateModule", { id:this._resIDArray[tag-1], blockId:this._resBlockIndex, collegeId:null,type:3 } );
                    break;
                case 2://跳转
                    cc.log("跳转");
                    //ModuleMgr.inst().openModule("UpgradeModule",{"id":this._resIDArray[tag-1],"blockId":this._resIndexId});
                    ModuleMgr.inst().closeModule( "UpgradeModule" );
                    EventMgr.inst().dispatchEvent( CastleEvent.MOVETO_BUILDING, this._resIDArray[tag-1] );
                    break;
                default :
                    cc.log("获取更多");
                    break;
            }
        }
    },

    scrollCall:function( node, type )
    {
        if( type ==  ccui.ScrollView.EVENT_SCROLLING )
        {
            this.updateScroll();
        }
    },

    updateScroll:function() {
        var scrollview = this._ui.getChildByName("ScrollView_1");
        var down = this._ui.getChildByName("gy_xiala_01_5_0");
        var up = this._ui.getChildByName("gy_xiala_01_5");

        var scrollSize = scrollview.getContentSize();
        var size = scrollview.getInnerContainerSize();
        var inner = scrollview.getInnerContainer();
        var pos = inner.getPosition();

        up.setVisible(false);
        down.setVisible( false );

        if (size.height <= scrollSize.height) {
            return;
        }

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
    },

    onExit:function()
    {
        this._super();
        EventMgr.inst().removeEventListener( CastleEvent.UPGRADE_COMPLETE, this.upgradeCall, this );
    },

    upgradeCall: function (event,data) {
        this.refreshContent();
    }
});
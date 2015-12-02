

//auto:标识取消自动登录,默认null（false），用于注销游戏gameover模块 111
var Game = function(auto)
{
    var _me = this;
    var _timer;

    var _vector = [];

    function init()
	{

	    //2015-10-14 by shenwei 该辅助模块用来测试登陆的完整性
        //始终按最小比例缩放(保证画质)
        //var size = cc.view.getFrameSize();
        //var scaleX = size.width / AutoResizeUtils.DESIGN_WIDTH;
        //var scaleY = size.height / AutoResizeUtils.DESIGN_HEIGHT;
        //if(Math.min(scaleX,scaleY) == scaleX)
        //{
        //   cc.view.setDesignResolutionSize(AutoResizeUtils.DESIGN_WIDTH, AutoResizeUtils.DESIGN_HEIGHT, cc.ResolutionPolicy.FIXED_WIDTH);
        //}
        //else
        //{
        //   cc.view.setDesignResolutionSize(AutoResizeUtils.DESIGN_WIDTH, AutoResizeUtils.DESIGN_HEIGHT, cc.ResolutionPolicy.FIXED_HEIGHT);
        //}

	    CD.getInstance().init();
	    AutoResizeUtils.init();
        EnterFrame.init();

        ModuleMgr.inst().init();
        registerAllModule();
        //原始本地
        loadResources();

        //EventMgr.inst().addEventListener(ConfigTableUpdateLocalEvent.PROGRESS_END, loadResources);
        //ModuleMgr.inst().getData("ConfigTableUpdator").loadConfig(GameConfig.tableAddress);
	}


    /*
     * 加载公共资源
     */
	function loadResources()
	{
		var resList = ResMgr.inst().getModuleResources("public");
        if( resList && resList.length > 0 )
        {
			ResMgr.inst().loadList( "公共资源", resList,
			function( event, loadName )
			{
                if( event == LoadEvent.LOAD_COMPLETE )
                {
                    cc.log("公共资源加载完成");
                    runGame();
                }

			}, this );
        }
        else
        {
            runGame();
        }
	}

    /*
     * 启动游戏
     */
    function runGame()
    {
        cc.log("开始游戏");

        //2015-10-15 by shenwei 原始模块调整到加载-登陆模块后等通知

        //ModuleMgr.inst().openModule("MainResourcesModule");
        //ModuleMgr.inst().openModule("UseScrollModule",1601001);

        //ModuleMgr.inst().openModule("AccelerateModule");
        //ModuleMgr.inst().openModule("ParticularsModule");
        //ModuleMgr.inst().openModule("StoreModule");//TheWallLayer CollegeModule ChengShiZengYiModule
        //ModuleMgr.inst().openModule("UpgradeModule");
        //ModuleMgr.inst().openModule("ChatModule");

        ModuleMgr.inst().openModule("Loading", {"data":null, "openSound":true, "auto":auto});

        //jsb.fileUtils.writeToFile({"ss":"ss"},"C:/xx.txt");

        //初始化Data
        ModuleMgr.inst().getData("CollectModule");
        //createYuyan();
    }


    update = function()
    {
        if(NetMgr.inst().isConnection() == true)
        {
            var msg = new SocketBytes ();
            msg.writeUint(0);
            msg.writeUint(0);
            msg.writeInt(0);
            msg.writeString ("心跳");
            NetMgr.inst().send(msg);
        }
    }



    /*
     * 注册所有的模块
     * 注册模块分3块，（模块，数据，资源），注册的时候必须有一个不能为NULL
     */
	function registerAllModule()
	{
		cc.log("注册游戏模块...");

        //公共资源
        var list = getPublicResourcesList();
        registerModuleAndData( "public", null, null, list );

        registerLoadingAndLoginingModule();

        //测试模块，新手必看
        //registerModuleAndData( "TestModule",
        //    { className:"TestModule", layer:ModuleLayer.LAYER_TYPE_UI },
        //    { className:"TestData",isInit:true },
        //    ["res/images/ui/test/testModule.json"],["res/images/ui/test/testplist.plist"]);

        //表格更新模块
        registerModuleAndData( "ConfigTableUpdator",
            { className:"configTableUpdatingModule", layer:ModuleLayer.LAYER_TYPE_UI},
            { className:"configTableUpdatingData",isInit:true },
            null);

        // 地图切换模块
        registerModuleAndData( "MapChangeModule",
            { className:"MapChangeModule", layer:ModuleLayer.LAYER_TYPE_TOP},
            { className:null,isInit:true },
            null);

        // 二级地图模块
       registerModuleAndData( "BigMapModule",
            { className:"BigMapModule", layer:ModuleLayer.LAYER_TYPE_MAP },
            { className:"BigMapData",isInit:true },
            null);

        //对象模块
        registerModuleAndData( "PlayerData",
            null,
            { className:"PlayerData", isInit:true },
            null);

        //二级地图UI弹框
        registerModuleAndData( "TileMenuModule",
            { className:"TileMenuModule", layer:ModuleLayer.LAYER_TYPE_UI },
            { className:"TileMenuData",isInit:false },
            ["res/images/ui/TileMenuModule/ex_menuitemlayer.json",
                "res/images/ui/TileMenuModule/MenuLayer.json"]);

        //一级地图UI弹框
        registerModuleAndData( "BuildingUIModule",
            { className:"BuildingUIModule", layer:ModuleLayer.LAYER_TYPE_UI },
            { className:"BuildingUIData",isInit:false },
            ["res/images/ui/TileMenuModule/ex_menuitemlayer.json",
                "res/images/ui/TileMenuModule/MenuLayer.json"]);

        //空地建造建筑UI弹框
        registerModuleAndData( "CreateBuildingUIModule",
            { className:"CreateBuildingUIModule", layer:ModuleLayer.LAYER_TYPE_UI },
            { className:"CreateBuildingUIData",isInit:false },
            ["res/images/ui/TileMenuModule/ex_menuitemlayer.json",
                "res/images/ui/TileMenuModule/MenuLayer.json"]);

        //主界面资源
        registerModuleAndData( "MainResourcesModule",
            { className:"MainResourcesModule", layer:ModuleLayer.LAYER_TYPE_TOPUI },
            null,
            ["res/images/ui/mainResourcesModule/Layer.json","res/images/ui/mainResourcesModule/main_menu_plist.plist"]);

        //主界面菜单
        registerModuleAndData( "MainMenuModule",
            { className:"MainMenuModule", layer:ModuleLayer.LAYER_TYPE_UI },
            null,
            ["res/images/ui/mainMenuModule/Layer.json","res/images/ui/mainResourcesModule/main_menu_plist.plist"]);

        //公告
        registerModuleAndData( "announcement",
            null,
            { className:"AnnouncementData", isInit:true },
            null);

        //详情
        registerModuleAndData( "ParticularsModule",
            { className:"ParticularsModule", layer:ModuleLayer.LAYER_TYPE_UI },
            null,
            ["res/images/ui/warehouseParticulars/Layer.json",
                "res/images/ui/publicBackdrop/Layer.json",
            "res/images/ui/TheWall/Wall_Particulars_Layer.json"]);

        //升级
        registerModuleAndData( "UpgradeModule",
            { className:"UpgradeModule", layer:ModuleLayer.LAYER_TYPE_UI },
            null,
            ["res/images/ui/warehouseUpgrade/Layer.json",
                "res/images/ui/publicBackdrop/Layer.json",
            "res/images/ui/TheWall/Wall_Upgrade_Layer.json"]);

        //城墙
        registerModuleAndData( "TheWallModule",
            { className:"TheWallLayer", layer:ModuleLayer.LAYER_TYPE_UI },
            null,
            ["res/images/ui/TheWall/thewall.plist",
            "res/images/ui/TheWall/TheWallLayer.json"]);

        //学院
        registerModuleAndData( "CollegeModule",
            { className:"CollegeModule", layer:ModuleLayer.LAYER_TYPE_UI },
            { className:"CollegeData",isInit:false },
            ["res/images/ui/College/college_plist.plist",
                "res/images/ui/College/CollegeLayer.json",
                "res/images/ui/College/College_Skill_LevelUp.json",
                "res/images/ui/College/College_Skill_CancelLayer.json"]);

        //主城堡
        registerModuleAndData( "CastleModule",
            { className:"CastleModule", layer:ModuleLayer.LAYER_TYPE_MAP},
            { className:"CastleData",isInit:true },
            [
                list.push("res/images/animation/ui/castle/castle_upgrade_hammer.plist"),
                list.push("res/images/animation/ui/castle/castle_upgrade_down.plist"),
                list.push("res/images/animation/ui/castle/castle_upgrade_up.plist"),
                list.push("res/images/animation/ui/castle/castle_upgrade_complete.plist"),
                list.push("res/images/animation/ui/castle/castle_tech_upgrade.plist"),
                list.push("res/images/animation/ui/castle/castle_tech_upgrade_complete.plist")
            ]);


        //加速
        registerModuleAndData( "AccelerateModule",
            { className:"AccelerateModule", layer:ModuleLayer.LAYER_TYPE_TOPUI },
            null,
            ["res/images/ui/accelerate/Layer.json","res/images/ui/accelerate/accelerate_plist.plist"]);

        //城堡资源
        registerModuleAndData( "CitadelResourceModule",
            { className:"CitadelResourceModule", layer:ModuleLayer.LAYER_TYPE_UI },
            null,
            ["res/images/ui/citadelResource/Layer.json","res/images/ui/citadelResource/citadelResource_plist.plist"]);

        //城市增益
        registerModuleAndData( "CityGainModule",
            { className:"CityGainModule", layer:ModuleLayer.LAYER_TYPE_UI },
            null,
            ["res/images/ui/HeadModule/CHBLayer.json"]);

        //头像
        registerModuleAndData( "HeadModule",
            { className:"HeadModule", layer:ModuleLayer.LAYER_TYPE_UI },
            null,
            ["res/images/ui/HeadModule/HeadLayer.json",
            "res/images/ui/HeadModule/head_plist.plist"]);

        //充值
        registerModuleAndData( "PayModule",
            { className:"PayModule", layer:ModuleLayer.LAYER_TYPE_UI },
            { className:"PayData",isInit:false },
            ["res/images/ui/PayModule/PayLayer.json",
                "res/images/ui/PayModule/ScrolItem.json",
                "res/images/ui/PayModule/pay_plist.plist"]);

        //邮箱
        registerModuleAndData( "MailModule",
            { className:"MailModule", layer:ModuleLayer.LAYER_TYPE_UI },
            { className:"MailData",isInit:true },
            ["res/images/ui/HeadModule/HeadLayer.json",
                "res/images/ui/HeadModule/head_plist.plist"]);

        //gameover 注销游戏模块
        registerModuleAndData( "GameOverModule",
            { className:"GameOverModule", layer:ModuleLayer.LAYER_TYPE_UI },
            null,
            null);

        //朋友
        registerModuleAndData( "FriendModule",
            { className:"FriendModule", layer:ModuleLayer.LAYER_TYPE_UI },
            { className:"FriendData"},
            ["res/images/ui/friend/Layer.json", "res/images/ui/friend/Layer1.json","res/images/ui/friend/friend_plist.plist"]);

        //每日签到
        registerModuleAndData( "SignModule",
            { className:"SignModule", layer:ModuleLayer.LAYER_TYPE_UI },
            null,
            ["res/images/ui/SignModule/sign_plist.plist",
                "res/images/ui/SignModule/SignLayer.json"]);

        //商城
        registerModuleAndData( "StoreModule",
            { className:"StoreModule", layer:ModuleLayer.LAYER_TYPE_UI },
            null,
            ["res/images/ui/StoreModule/store_plist.plist",
                "res/images/ui/StoreModule/buyconfirmlayer.json",
                "res/images/ui/StoreModule/storelayer.json"]);

        //物品道具
        registerModuleAndData( "ItemModule",
            { className:"ItemModule", layer:ModuleLayer.LAYER_TYPE_UI },
            { className:"ItemData",isInit:true },
            null);

        //背包
        registerModuleAndData( "BagModule",
            { className:"BagModule", layer:ModuleLayer.LAYER_TYPE_UI },
            null,
            ["res/images/ui/BagModule/Layer.json"]);

        //军团集结
        registerModuleAndData( "CorpsAssembledModule",
            { className:"CorpsAssembledModule", layer:ModuleLayer.LAYER_TYPE_UI },
            null,
            ["res/images/ui/CorpsAssembled/Layer.json",
                "res/images/ui/CorpsAssembled/addLayer.json",
                "res/images/ui/CorpsAssembled/dissolveLayer.json",
                "res/images/ui/CorpsAssembled/assembled_plist.plist",
                "res/images/ui/CorpsAssembled/supplementLayer.json"]);

        //收藏夹
        registerModuleAndData( "CollectModule",
            { className:"CollectModule", layer:ModuleLayer.LAYER_TYPE_UI },
            { className:"CollectData"},
            ["res/images/ui/collect/Layer.json"]);

        //添加收藏夹
        registerModuleAndData( "AddCollectModule",
            { className:"AddCollectModule", layer:ModuleLayer.LAYER_TYPE_TOPUI },
            null,
            ["res/images/ui/collect/Layer1.json"]);


        //聊天
        registerModuleAndData( "ChatModule",
            { className:"ChatModule", layer:ModuleLayer.LAYER_TYPE_UI },
            { className:"ChatData",isInit:true },
            ["res/images/ui/chatModule/chat_plist.plist",
                "res/images/ui/chatModule/Layer.json"]);

        //玩家信息
        registerModuleAndData( "PlayerInfoModule",
            { className:"PlayerInfoModule", layer:ModuleLayer.LAYER_TYPE_UI },
            { className:null,isInit:true },
            ["res/images/ui/playerInfo/Layer.json"]);


        //我的主城
        registerModuleAndData( "MainCitysModule",
            { className:"MainCitysModule", layer:ModuleLayer.LAYER_TYPE_UI },
            null,
            ["res/images/ui/mainCitys/Layer.json","res/images/ui/mainCitys/Citys_Plist.plist"]);

        //土地使用倦
        registerModuleAndData( "UseScrollModule",
            { className:"UseScrollModule", layer:ModuleLayer.LAYER_TYPE_UI },
            null,
            ["res/images/ui/useScroll/Layer.json","res/images/ui/useScroll/rouleau_plist.plist"]);

        //聊天
        registerModuleAndData( "ChatModule",
            { className:"ChatModule", layer:ModuleLayer.LAYER_TYPE_UI },
            { className:"ChatData",isInit:true },
            ["res/images/ui/chatModule/chat_plist.plist",
                "res/images/ui/chatModule/Layer.json"]);

        //玩家信息
        registerModuleAndData( "PlayerInfoModule",
            { className:"PlayerInfoModule", layer:ModuleLayer.LAYER_TYPE_UI },
            { className:null,isInit:true },
            ["res/images/ui/playerInfo/Layer.json"]);

        //私聊
        registerModuleAndData( "PrivateChatModule",
            { className:"PrivateChatModule", layer:ModuleLayer.LAYER_TYPE_UI },
            { className:"PrivateChatData",isInit:true },
            ["res/images/ui/chatModule/chat_plist.plist",
                "res/images/ui/chatModule/Pirvate.json"]);

        //地块详情和升级
        registerModuleAndData( "BlockInfoModule",
            { className:"BlockInfoModule", layer:ModuleLayer.LAYER_TYPE_TOPUI },
            null,
            ["res/images/ui/Block/BlockInfoLayer.json"]);
        registerModuleAndData( "BlockLevelupModule",
            { className:"BlockLevelupModule", layer:ModuleLayer.LAYER_TYPE_TOPUI },
            null,
            ["res/images/ui/Block/BlockLevelupLayer.json"]);

        //战斗UI
        registerModuleAndData( "BattleUIModule",
            { className:"BattleUIModule", layer:ModuleLayer.LAYER_TYPE_UI },
            { className:"BattleUIData",isInit:true },
            ["res/images/ui/BattleUIModule/Layer.json",
                "res/images/ui/BattleUIModule/battleUI_plist.plist",
                "res/images/ui/BattleUIModule/item.json"]);
	}

    /*
     * 注册模块
     * moduleName ：模块名称　
     * moduleConfig =
     * {
     *  moduleName:模块名称，如果没有就默认上面模块名
     *  className:模块类，工厂类会根据该名字创建类对像
     *  isCache:是否缓存
     * }
     * dataConfig =
     * {
     *  dataName:模块名称，如果没有就默认上面模块名
     *  className:模块类，工厂类会根据该名字创建类对像
     *  isInit:是否游戏开始就初始化
     *  cmdList:[] //初始化CMD表，目前没用。以后在增加，这个list会初始化到NetMgr里
     * }
     * resources:资源列表，模块初始化的时候会加载该资源，模块卸载的时候会移除该资源
     *
     */
	function registerModuleAndData( moduleName, moduleConfig, dataConfig, resources )
	{
        var name = moduleName;
        if( moduleConfig )
        {
            moduleConfig.moduleName != undefined ?  moduleName = moduleConfig.moduleName : moduleName = name ;
            ModuleMgr.inst ().registerModuleClass ( moduleName , moduleConfig.className , moduleConfig.layer , moduleConfig.isCache == undefined ? false : moduleConfig.isCache );
        }
        if( dataConfig )
        {
            dataConfig.dataName != undefined ? moduleName = dataConfig.dataName : moduleName = name ;
            ModuleMgr.inst ().registerDataClass ( moduleName , dataConfig.className , dataConfig.isInit == undefined ? false : dataConfig.isInit  );
        }

        if( resources )
        {
            ResMgr.inst().registerModuleResources( moduleName , resources );
        }
	}

    function getPublicResourcesList()
    {
        var list = [];

        //list.push("res/images/ui/test_public.plist");
        list.push("res/configs/csvs/CN.csv");
        list.push("res/configs/csvs/EN.csv");
        list.push("res/configs/csvs/KR.csv");
        list.push("res/configs/csvs/ZH.csv");
        list.push("res/images/ui/public_plist.plist");
        list.push("res/configs/maps/0_0.json");
        list.push("res/images/map/map_static_bj.plist");
        list.push("res/images/map/map_static_0.plist");
        list.push("res/images/map/map_static_1.plist");
        list.push("res/images/map/map_static_2.plist");
        list.push("res/configs/csvs/ui_Listi.csv");
        list.push("res/configs/csvs/ui_city.csv");
        //list.push("res/configs/csvs/Territory_product.csv");
        //list.push("res/configs/csvs/Territory_levelup.csv");
        //list.push("res/configs/csvs/City_Wall.csv");

        list.push("res/images/map/castle/castle.plist");
        list.push("res/images/map/castle/castlebg.plist");
        list.push("res/images/map/castle/castlebuilding.plist");
        list.push("res/configs/csvs/animationConfig.csv");

        //list.push("res/configs/csvs/castle_block.csv");
        //list.push("res/configs/csvs/castle_buildingxy.csv");

        //头像配置
        list.push("res/configs/csvs/head.csv");

        //表
        //list.push("res/configs/jsons/castle_block.json");
        //list.push("res/configs/jsons/castle_buildingxy.json");
        //list.push("res/configs/jsons/City_Camp.json");
        //list.push("res/configs/jsons/City_Castel.json");
        //list.push("res/configs/jsons/City_College.json");
        //list.push("res/configs/jsons/City_College_tech.json");
        //list.push("res/configs/jsons/City_House.json");
        //list.push("res/configs/jsons/City_Storage.json");
        //list.push("res/configs/jsons/City_Tower.json");
        //list.push("res/configs/jsons/City_Wall.json");

        //2015-10-15 by shenwei 以下txt用来测试, 不要修改, 后续改为派克的资源配置表里的文件
        //var txts = ["res/configs/txts/account_levels.txt","res/configs/txts/deals.txt","res/configs/txts/diamond_shop.txt","res/configs/txts/items.txt","res/configs/txts/rank_lists.txt","res/configs/txts/rewards.txt",
        //    "res/configs/txts/room_interactions.txt","res/configs/txts/room_levels.txt","res/configs/txts/sng_levels.txt","res/configs/txts/tasks.txt","res/configs/txts/vip.txt", "res/configs/txts/rmb2diamond.txt" ];
        //list = list.concat(txts);

        return list;
    }


    /*
     * 注册所有的模块
     * 注册模块分3块，（模块，数据，资源），注册的时候必须有一个不能为NULL
     */
    function registerLoadingAndLoginingModule()
    {
        //预加载公共
        registerModuleAndData( "AlertPanel" , { className:"AlertPanelModule", layer:ModuleLayer.LAYER_TYPE_TOP } , null, [] );
        registerModuleAndData( "AlertString" , { className:"AlertStringModule", layer:ModuleLayer.LAYER_TYPE_TOP } , null, [] );
        registerModuleAndData( "NetworkWaitModule" , { className:"NetworkWaitModule", layer:ModuleLayer.LAYER_TYPE_TOP } , null, [] );

        cc.log("注册游戏加载-登陆模块...");
        //加载-登陆-注册-找回(取代Login模块)
        registerModuleAndData( "Loading", {className:"LoadingModule", layer:ModuleLayer.LAYER_TYPE_UI}, {className:"LoadingData", isInit:false}, ["res/loadingAndLogining/loadingUI.json"] );
        registerModuleAndData( "Logining", {className:"LoginingModule", layer:ModuleLayer.LAYER_TYPE_UI}, null, ["res/loadingAndLogining/loginingUI.json"] );
        registerModuleAndData( "Registering", {className:"RegisteringModule", layer:ModuleLayer.LAYER_TYPE_UI}, null, ["res/loadingAndLogining/registeringUI.json"] );
        registerModuleAndData( "UserAnnouncing", {className:"UserAnnouncingModule", layer:ModuleLayer.LAYER_TYPE_UI}, null, ["res/loadingAndLogining/AnnouncingUI.json"] );
        registerModuleAndData( "Presetting", {className:"PresettingModule", layer:ModuleLayer.LAYER_TYPE_UI}, null, ["res/loadingAndLogining/presettingUI.json"] );
        registerModuleAndData( "Retrieving", {className:"RetrievingModule", layer:ModuleLayer.LAYER_TYPE_UI}, null, ["res/loadingAndLogining/pwRetrievingUI.json"] );
        registerModuleAndData( "MSGActivating", {className:"MSGActivatingModule", layer:ModuleLayer.LAYER_TYPE_UI}, null, ["res/loadingAndLogining/pwActivatingUI.json"] );
        registerModuleAndData( "ImgNavigating", {className:"ImgNavigatingModule", layer:ModuleLayer.LAYER_TYPE_UI}, null, ["res/loadingAndLogining/imgNavigatingUI.json"] );


        ModuleMgr.inst().initData();
        _timer = new Timer(15000,-1,update,null,this);
        _timer.start();

        cc.eventManager.addCustomListener(cc.game.EVENT_HIDE, function(event){
            if(NetMgr.inst().isConnection() == true)
            {
                NetMgr.inst().closeWebScoket();
            }
            _timer.stop();
        });

        cc.eventManager.addCustomListener(cc.game.EVENT_SHOW, function(event){
            if(NetMgr.inst().isConnection() == false)
            {
                _timer.start();
            }
        });
    }

    function setTxtColor(tag) {
        for (var i in _vector) {
            if (tag == i) {
                _vector[i].setTextColor(cc.color(0,255,0));
            }
            else {
                _vector[i].setTextColor(cc.color(255,255,255));
            }
        }
    }

    function createYuyan()
    {
        //四个语言版本
        var txt = ccui.Text();
        txt.setFontSize(25);
        txt.setAnchorPoint(0,0);
        txt.setString("韩文");
        txt.setPosition(10,130);
        txt.setTouchEnabled(true);
        txt.setTag(0);
        txt.addTouchEventListener( function (node, type ){
            if( type != ccui.Widget.TOUCH_ENDED ) return;
            cc.log("韩文");
            ResMgr.inst().setLanguage("KR");
            setTxtColor(node.getTag());
        }, this );
        ModuleMgr.inst().addNodeTOLayer(txt, ModuleLayer.LAYER_TYPE_TOP );
        _vector.push(txt);

        txt = ccui.Text();
        txt.setFontSize(25);
        txt.setAnchorPoint(0,0);
        txt.setString("英文");
        txt.setPosition(10,90);
        txt.setTouchEnabled(true);
        txt.setTag(1);
        txt.addTouchEventListener( function (node, type ){

            if( type != ccui.Widget.TOUCH_ENDED ) return;
            cc.log("英文");
            ResMgr.inst().setLanguage("EN");
            setTxtColor(node.getTag());
        }, this );
        ModuleMgr.inst().addNodeTOLayer(txt, ModuleLayer.LAYER_TYPE_TOP );
        _vector.push(txt);

        txt = ccui.Text();
        txt.setFontSize(25);
        txt.setAnchorPoint(0,0);
        txt.setString("中文");
        txt.setPosition(10,50);
        txt.setTouchEnabled(true);
        txt.setTag(2);
        txt.addTouchEventListener( function (node, type ){

            if( type != ccui.Widget.TOUCH_ENDED ) return;
            cc.log("中文");
            ResMgr.inst().setLanguage("CN");
            setTxtColor(node.getTag());
        }, this );
        ModuleMgr.inst().addNodeTOLayer(txt, ModuleLayer.LAYER_TYPE_TOP );
        _vector.push(txt);

        txt = ccui.Text();
        txt.setFontSize(25);
        txt.setAnchorPoint(0,0);
        txt.setString("繁体");
        txt.setPosition(10,10);
        txt.setTouchEnabled(true);
        txt.setTag(3);
        txt.addTouchEventListener( function (node, type ){

            if( type != ccui.Widget.TOUCH_ENDED ) return;
            cc.log("繁体");
            ResMgr.inst().setLanguage("ZH");
            setTxtColor(node.getTag());
        }, this );
        ModuleMgr.inst().addNodeTOLayer(txt, ModuleLayer.LAYER_TYPE_TOP );
        _vector.push(txt);
        setTxtColor(2);
    }



	init();
}

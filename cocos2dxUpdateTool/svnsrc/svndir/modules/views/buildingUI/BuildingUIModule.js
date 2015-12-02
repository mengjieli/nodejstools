/**
 * Created by cgMu on 2015/10/24.
 */

var BuildingUIModule = ModuleBase.extend({

    ctor:function() {
        this._super();
    },

    initUI:function() {
        //EventMgr.inst().addEventListener(CastleEvent.MOVE_SCREEN, this.onChangePos, this);
        EventMgr.inst().addEventListener(CastleEvent.UPGRADE_COMPLETE, this.onUpdateUI, this);

        //this.scheduleUpdate()
    },

    show:function( data ) {
        var buildingData = ModuleMgr.inst().getData("BuildingUIModule");

        if (data.objectid == null) {
            if (buildingData.moduleInit) {
                this.unscheduleUpdate();
                var movePos = cc.p((303-63)*0.5,(303-73)*0.5);
                for (var i = buildingData.buildingItemArray.length; i > 0; i--) {
                    var delayTime = 0.05;
                    var time = 0.1;
                    var move = new cc.MoveTo(time, movePos);
                    //var action = new cc.EaseElasticOut(move);
                    var action = new cc.EaseExponentialOut(move);
                    //var action = new cc.Sequence();
                    buildingData.buildingItemArray[i-1].runAction(cc.sequence(cc.DelayTime(i*delayTime), action,cc.Hide()
                        ,cc.CallFunc(function(){
                            buildingData.buildingMenuBg.runAction(cc.Sequence(cc.scaleTo(0.1,0),cc.CallFunc(function(){
                                ModuleMgr.inst().closeModule("BuildingUIModule");
                                buildingData.destroy();
                            })));
                        })
                    ));
                }
            }
            return;
        }

        buildingData.initBuildingData(data.objectid,data.objectpos,null,data.objectindex);

        if (buildingData.menuUI.length == 0) {
            cc.log("没有弹出UI，直接跳转界面",buildingData.buildingObjectId);
            this.openModule(buildingData.buildingObjectId);
            ModuleMgr.inst().openModule("CreateBuildingUIModule",{objectid:null});
            ModuleMgr.inst().openModule("BuildingUIModule",{objectid:null});
            return;
        }

        if (!buildingData.moduleInit) {
            var json = ccs.load("res/images/ui/TileMenuModule/MenuLayer.json","res/images/ui/");
            var root = json.node;
            this.addChild(root);
            //this.root=root;

            buildingData.buildingUI=root;

            this.bgPanel = ccui.helper.seekWidgetByName(root, "menuPanel");
            var size = this.bgPanel.getContentSize();

            var scaleBg = new cc.Sprite("#gy_yuankuang_di.png");
            scaleBg.setPosition(cc.p(buildingData._menuWidth*0.5,buildingData._menuHeight*0.5));
            this.bgPanel.addChild(scaleBg);
            //var buildingData = ModuleMgr.inst().getData("BuildingUIModule");
            buildingData.buildingMenuBg=scaleBg;

            var posLabel = ccui.helper.seekWidgetByName(root,"posLabel");
            posLabel.setVisible(false);

            //名称
            var labelbg = new cc.Sprite("#gy_jianzhuwumingcheng_di.png");
            //labelbg.setScale(0.5);
            labelbg.setPosition(cc.p(buildingData._menuWidth*0.5,buildingData._menuHeight*0.5));
            scaleBg.addChild(labelbg);
            var name = new ccui.Text();
            name.setString(ResMgr.inst().getString(buildingData.buildingObjectId+"0"));
            name.setFontSize(20);
            name.setTextColor(cc.color(233,204,87));
            name.setPosition(cc.p(buildingData._menuWidth*0.5,buildingData._menuHeight*0.5));
            scaleBg.addChild(name);
            buildingData.buildingNameLabel = name;

            this.scheduleUpdate();
        }

        cc.log("BuildingUIModule id ",buildingData.buildingObjectId, "地块索引 ",buildingData.buildingBlockId);

        //var playerdata =  ModuleMgr.inst().getData("PlayerData");
        //var tiledata = playerdata.getObject(data);
        var pos = buildingData.buildingPosition;
        buildingData.moduleInit = true;
        //cc.log("&*&*&*",pos.x,pos.y);

        buildingData.buildingNameLabel.setString(ResMgr.inst().getString(buildingData.buildingObjectId+"0"));

        this.refreshMenuPosition(pos);

        //this.root.setPosition(cc.p(pos.x-151.5,pos.y-151.5));
        this.refreshMenuItem();
    },

    close:function() {
        //cc.log("BuildingUIModule", "close");
        //EventMgr.inst().removeEventListener(CastleEvent.MOVE_SCREEN, this.onChangePos, this);
        //EventMgr.inst().removeEventListener(CastleEvent.UPGRADE_COMPLETE, this.onUpdateUI, this);
    },

    destroy:function() {
        //cc.log("BuildingUIModule", "destroy");
        //EventMgr.inst().removeEventListener(CastleEvent.MOVE_SCREEN, this.onChangePos, this);
        EventMgr.inst().removeEventListener(CastleEvent.UPGRADE_COMPLETE, this.onUpdateUI, this);
        //this.unscheduleUpdate();
    },

    onUpdateUI: function (type,index) {
        var buildingData = ModuleMgr.inst().getData("BuildingUIModule");
        ModuleMgr.inst().openModule("BuildingUIModule",{objectid:buildingData.buildingObjectId,
            objectpos:buildingData.buildingPosition,objectstate:null,
            objectindex:buildingData.buildingBlockId});
    },

    refreshMenuItem: function () {
        var buildingData =  ModuleMgr.inst().getData("BuildingUIModule");
        var length = buildingData.buildingItemArray.length;
        cc.log("refreshMenuItem", length);

        for (var i = 0; i < length; i++) {
            if (buildingData.buildingItemArray[i]) {
                buildingData.buildingItemArray[i].removeFromParent(true);
                buildingData.buildingItemArray[i] = null;
            }
        }
        buildingData.buildingItemArray=[];

        var counts = buildingData.menuUI.length;
        //cc.log("buildingData.menuUI.length",buildingData.menuUI.length);
        var posArray = buildingData.buildingPositionArray[counts-1];

        for (var i = 0;i < counts;i++) {
            var titleName = ResMgr.inst().getString(buildingData.menuUI[i]+"0");
            //cc.log("ResMgr.inst().getCSV",titleName);
            var cell = new CustomMenuItem(buildingData.menuUI[i]+"3",
                buildingData.menuUI+"1",
                titleName,this.touchEvent);
            cell.setPosition(cc.p((buildingData._menuWidth-buildingData._itemWidth)*0.5,(buildingData._menuHeight-buildingData._itemHeight)*0.5));
            cell.setVisible(false);
            this.bgPanel.addChild(cell);

            var delayTime = 0.1;
            var time = 0.5;
            var move = new cc.MoveTo(time, posArray[i]);
            //var action = new cc.EaseElasticOut(move,0.4);
            var action = new cc.EaseExponentialOut(move);
            cell.runAction(cc.sequence(cc.DelayTime(i*delayTime), cc.Spawn(cc.Show(),action)));
            buildingData.buildingItemArray.push(cell);
        }
    },

    touchEvent:function (sender) {
        var tag = sender.getTag(); //tag = buildingData.menuUI[i]
        //tag = parseInt(tag/10);
        var buildingData =  ModuleMgr.inst().getData("BuildingUIModule");
        //var scene = cc.Director.getInstance().getRunningScene();

        cc.log("sender.getTag" ,tag,"objectId:",buildingData.buildingObjectId);
        switch (tag) {
            case 1501001://升级
                cc.log("升级");
                ModuleMgr.inst().openModule("UpgradeModule",{"id":buildingData.buildingObjectId,"blockId":buildingData.buildingBlockId});//buildingData.buildingObjectId);
                break;
            case 1501002://详情
                cc.log("详情");
                ModuleMgr.inst().openModule("ParticularsModule",{"id":buildingData.buildingObjectId,"blockId":buildingData.buildingBlockId});
                break;
            case 1501003://进攻
                cc.log("进攻");
                break;
            case 1501004://购买
                cc.log("购买");
                break;
            case 1501005://出售
                cc.log("出售");
                break;
            case 1501006://撤单
                cc.log("撤单");
                break;
            case 1501007://放弃领地
                cc.log("放弃领地");
                break;
            case 1503001://城市收益
                cc.log("城市收益");
                ModuleMgr.inst().openModule("CityGainModule");
                break;
            case 1503002://城堡资源
                cc.log("城堡资源");
                ModuleMgr.inst().openModule("CitadelResourceModule");
                break;
            case 1504001://城墙维修
                cc.log("城墙维修");
                //ModuleMgr.inst().openModule("TheWallModule");
                break;
            case 1505001://学院研究
                cc.log("学院研究");
                ModuleMgr.inst().openModule("CollegeModule",{"id":buildingData.buildingObjectId,"blockId":buildingData.buildingBlockId});
                break;
            case 1501012://加速
                //EventMgr.inst().dispatchEvent( CastleEvent.SPEED_SUCCESS,buildingData.buildingBlockId);
                ModuleMgr.inst().openModule("AccelerateModule", { id:buildingData.buildingObjectId, blockId:buildingData.buildingBlockId, collegeId:null,type:3 } );
                break;
            case 1501013://金币加速
                EventMgr.inst().dispatchEvent( CastleEvent.SPEED_SUCCESS,buildingData.buildingBlockId);
                break;
            case 1501011://取消
                EventMgr.inst().dispatchEvent( CastleEvent.CANCEL_SUCCESS,buildingData.buildingBlockId);
                break;
            default :
                break;
        }

        ModuleMgr.inst().openModule("BuildingUIModule",{objectid:null});//关闭UI弹框
    },

    refreshMenuPosition: function (pos) {
        if(pos==null) return;
        var buildingData =  ModuleMgr.inst().getData("BuildingUIModule");
        if (buildingData.buildingUI) {
            var pos = cc.p(pos.x-buildingData._menuWidth*0.5,pos.y-buildingData._menuHeight*0.5)
            //cc.log("pospos ",pos.x,pos.y);
            buildingData.buildingUI.setPosition(pos);
        }
    },

    onChangePos:function(type,pos){
        this.refreshMenuPosition(pos);
    },

    update: function (dt) {
        var pos = ModuleMgr.inst().getData("CastleModule")._movePos;
        this.refreshMenuPosition(pos);
    },
    
    openModule: function (moduleid) {
        switch (moduleid) {
            case 1909001://军团集结
                cc.log("军团集结");
                ModuleMgr.inst().openModule("CorpsAssembledModule");
                break;
            default :
                cc.error("error",moduleid);
                break
        }
    }
});
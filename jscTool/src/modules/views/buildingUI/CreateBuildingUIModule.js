/**
 * Created by cgMu on 2015/10/31.
 */

var CreateBuildingUIModule = ModuleBase.extend({
    ctor:function() {
        this._super();
    },

    initUI:function() {
        //EventMgr.inst().addEventListener(CastleEvent.MOVE_SCREEN, this.onChangePos, this);//移动地图时更新弹框坐标
        //this.scheduleUpdate()

        EventMgr.inst().addEventListener(CastleEvent.NET_COMPLETE,this.updateMessage,this);
    },

    show:function( value ) {
        var data = ModuleMgr.inst().getData("CreateBuildingUIModule");//获取模块数据

        //传入的对象id（地块索引）为null时，关闭模块 + 动画
        if (value.objectid == null) {
            if (data.moduleInit) {
                this.unscheduleUpdate();
                var movePos = cc.p((data._menuWidth-data._itemWidth)*0.5,(data._menuHeight-data._itemHeight)*0.5);
                var delayTime = 0.05;
                var time = 0.1;
                var move = new cc.MoveTo(time, movePos);
                //var action = new cc.EaseElasticOut(move);
                var action = new cc.EaseExponentialOut(move);

                var index = data.buildingItemArray.length;
                for(var i = 0; i < data.buildingItemArray.length; i++) {
                    index--;
                    data.buildingItemArray[index].runAction(cc.Sequence(cc.DelayTime(i*delayTime), action,cc.Hide()));
                }

                data.buildingMenuBg.runAction(cc.Sequence(cc.DelayTime(data.buildingItemArray.length*delayTime),cc.ScaleTo(0.1,0),cc.CallFunc(function(){
                    ModuleMgr.inst().closeModule("CreateBuildingUIModule");
                    data.destroy();
                })));
            }
            return;
        }

        data.initData(value.objectid,value.objectpos);//初始化模块数据--地块索引和坐标

        if (data.menuUI == 0) {
            cc.log("当前空地没有建筑可以建造");
            ModuleMgr.inst().openModule("CreateBuildingUIModule",{objectid:null});
            ModuleMgr.inst().openModule("BuildingUIModule",{objectid:null});
            return;
        }

        if (!data.moduleInit) {
            var json = ccs.load("res/images/ui/TileMenuModule/MenuLayer.json","res/images/ui/");
            var root = json.node;
            this.addChild(root);
            data.buildingUI=root;

            this.bgPanel = ccui.helper.seekWidgetByName(root, "menuPanel");
            var size = this.bgPanel.getContentSize();

            var scaleBg = new cc.Sprite("#gy_yuankuang_di.png");
            scaleBg.setPosition(cc.p(data._menuWidth*0.5,data._menuHeight*0.5));
            scaleBg.setScale(0);
            this.bgPanel.addChild(scaleBg);
            data.buildingMenuBg=scaleBg;

            var posLabel = ccui.helper.seekWidgetByName(root,"posLabel");
            posLabel.setVisible(false);

            this.scheduleUpdate()
        }

        //data.initData(value.objectid,value.objectpos);
        cc.log("CreateBuildingUIModule", data.buildingObjectId);

        var pos = data.buildingPosition;
        data.moduleInit = true;
        data.buildingMenuBg.setScale(0);

        this.refreshMenuPosition(pos);
        this.refreshMenuItem();
    },

    close:function() {

    },

    destroy:function() {
        //EventMgr.inst().removeEventListener(CastleEvent.MOVE_SCREEN, this.onChangePos, this);
        //this.unscheduleUpdate();
        EventMgr.inst().removeEventListener(CastleEvent.NET_COMPLETE,this.updateMessage,this);
    },

    refreshMenuItem: function () {
        var data = ModuleMgr.inst().getData("CreateBuildingUIModule");
        var length = data.buildingItemArray.length;
        cc.log("refreshMenuItem", length);

        for (var i = 0; i < length; i++) {
            if (data.buildingItemArray[i]) {
                data.buildingItemArray[i].removeFromParent(true);
                data.buildingItemArray[i] = null;
            }
        }
        data.buildingItemArray=[];

        var counts = data.menuUI.length;
        //cc.log("buildingData.menuUI.length",buildingData.menuUI.length);
        var posArray = data.buildingPositionArray[counts-1];

        for (var i = 0;i < counts;i++) {
            var titleName = ResMgr.inst().getString(data.menuUI[i]+"0");

            //var cell = new CustomMenuItem(data.menuUI[i]+"2",
            //    data.menuUI+"1",
            //    titleName,this.touchEvent);
            var cell = new BuildingMenuItem(data.menuUI[i],data.menuUI[i]+"3",
                data.menuUI+"1",
                titleName,this.touchEvent);
            cell.setPosition(cc.p((data._menuWidth-data._itemWidth)*0.5,(data._menuHeight-data._itemHeight)*0.5));
            cell.setVisible(false);
            this.bgPanel.addChild(cell);

            var delayTime = 0;
            var time = 0.8;
            var move = new cc.MoveTo(time, posArray[i]);
            var action = new cc.EaseElasticOut(move);
            //var action = new cc.EaseExponentialOut(move);
            cell.runAction(cc.sequence(cc.DelayTime(i*delayTime), cc.Spawn(cc.Show(),action)));
            data.buildingItemArray.push(cell);
        }

        data.buildingMenuBg.runAction(cc.EaseElasticOut(cc.scaleTo(1,1)));
    },

    touchEvent:function (sender) {
        var tag = sender.getTag();
        //tag = parseInt(tag/10);
        var data = ModuleMgr.inst().getData("CreateBuildingUIModule");

        cc.log("sender.getTag" ,tag,"index :",data.buildingObjectId);
        EventMgr.inst().dispatchEvent( CastleEvent.BUILD_SUCCESS,data.buildingObjectId,tag);

    },

    refreshMenuPosition: function (pos) {
        var data = ModuleMgr.inst().getData("CreateBuildingUIModule");
        if (data.buildingUI) {
            data.buildingUI.setPosition(cc.p(pos.x-data._menuWidth*0.5,pos.y-data._menuHeight*0.5));
        }
    },

    onChangePos:function(type,pos){
        this.refreshMenuPosition(pos);
    },

    update: function (dt) {
        var pos = ModuleMgr.inst().getData("CastleModule")._movePos;
        this.refreshMenuPosition(pos);
    },

    updateMessage: function (event,data) {
        if (data == CastleNetEvent.SEND_BUILD) {
            var data = ModuleMgr.inst().getData("CreateBuildingUIModule");
            EventMgr.inst().dispatchEvent( CastleEvent.UPGRADE_COMPLETE,data.buildingObjectId);
            ModuleMgr.inst().openModule("CreateBuildingUIModule",{objectid:null});
        }
    }
});
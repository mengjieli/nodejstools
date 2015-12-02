/**
 * Created by cgMu on 2015/10/24.
 */

var BuildingUIData = DataBase.extend({
    buildingObjectId:null,//建筑ID
    buildingBlockId:null,//建筑地块索引
    buildingItemArray:[],
    buildingPositionArray:[],
    menuUI:[],
    buildingPosition:cc.p(0,0),
    moduleInit:false,
    buildingMenuBg:null,
    buildingUI:null,
    buildingState:null,
    buildingNameLabel:null,

    _menuWidth:303,
    _menuHeight:303,
    _itemWidth:63,
    _itemHeight:73,

    ctor:function() {
        this._menuWidth = 303;
        this._menuHeight = 303;
        this._itemWidth = 63;
        this._itemHeight = 73;

        var menuWidth = 303;
        var menuHeight = 303;
        var itemWidth = 63;
        var itemHeight = 73;

        this.buildingPositionArray[0] = [cc.p((menuWidth-itemWidth)*0.5,0)];
        this.buildingPositionArray[1] = [cc.p(0,(menuHeight-itemHeight)*0.5),
            cc.p((menuWidth-itemWidth),(menuHeight-itemHeight)*0.5)];
        this.buildingPositionArray[2] = [cc.p((menuWidth-itemWidth)*0.5,menuHeight-itemHeight),
            cc.p(222,55),
            cc.p(18,55)];
        this.buildingPositionArray[3] = [cc.p((menuWidth-itemWidth)*0.5,menuHeight-itemHeight),
            cc.p((menuWidth-itemWidth),(menuHeight-itemHeight)*0.5),
            cc.p((menuWidth-itemWidth)*0.5,0),
            cc.p(0,(menuHeight-itemHeight)*0.5)];
        this.buildingPositionArray[4] = [cc.p((menuWidth-itemWidth)*0.5,menuHeight-itemHeight),
            cc.p(228,158),
            cc.p(205,30),
            cc.p(38,30),
            cc.p(12,158)];
        this.buildingPositionArray[5] = [cc.p((menuWidth-itemWidth)*0.5,menuHeight-itemHeight),
            cc.p(221,172),
            cc.p(221,56),
            cc.p((menuWidth-itemWidth)*0.5,0),
            cc.p(18,56),
            cc.p(18,172)];
    },

    init:function()
    {
        return true;
    },

    destroy:function() {
        this.buildingObjectId=null;
        this.buildingItemArray = [];
        this.menuUI=[];
        this.buildingPosition=cc.p(0,0);
        this.moduleInit=false;
        this.buildingMenuBg=null;
        this.buildingUI = null;
        this.buildingState=null;
        this.buildingBlockId = null;
        this.buildingNameLabel = null;
    },

    initBuildingData:function(objectid,buildingpos,buildingstate,buildingblockindex) {
        cc.log("object id ", objectid);
        var tileConfig = ResMgr.inst().getCSV("ui_city",objectid);
        cc.log("弹出UI",tileConfig.normal_status);//1501002;1501003;1501005
        //tileConfig.ui_id = "1501002;1501001;1501009";//temp
        var normal = false;
        var data = ModuleMgr.inst().getData("CastleModule").getNetBlockByState(CastleData.STATE_NORMAL);
        for (var index in data) {
            if(data[index]._index==buildingblockindex) {
                normal = true;
                break;
            }
        }


        var itemArray = [];

        if (normal) {
            if (tileConfig.normal_status!=0) {
                itemArray = tileConfig.normal_status.split(";");
            }
        }
        else {
            if (tileConfig.status!=0) {
                itemArray = tileConfig.status.split(";");
            }
        }

        this.menuUI = itemArray;
        this.buildingObjectId = objectid;
        this.buildingPosition = buildingpos;
        this.buildingState = buildingstate;
        this.buildingBlockId = buildingblockindex;
    }
});
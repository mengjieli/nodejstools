/**
 * Created by cgMu on 2015/10/31.
 */

var CreateBuildingUIData = DataBase.extend({
    buildingObjectId:null, //空地索引ID
    buildingItemArray:[],
    buildingPositionArray:[], //存储item坐标
    menuUI:null, //数据 当前空地能建造的建筑ID 数组
    buildingPosition:cc.p(0,0),
    moduleInit:false,
    buildingMenuBg:null,
    buildingUI:null,

    //弹框尺寸和内部单个item尺寸
    _menuWidth:303,
    _menuHeight:303,
    _itemWidth:63,
    _itemHeight:73,

    ctor:function() {
        var menuWidth = this._menuWidth;
        var menuHeight = this._menuHeight;
        var itemWidth = this._itemWidth;
        var itemHeight = this._itemHeight;

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
        this.menuUI=null;
        this.buildingPosition=cc.p(0,0);
        this.moduleInit=false;
        this.buildingMenuBg=null;
        this.buildingUI = null;
    },

    //index:空地块索引；pos:坐标位置
    initData:function(index,pos) {
        //var data = ModuleMgr.inst().getData("CastleModule")._arrBlockBean[index]._building_id;
        var data = ModuleMgr.inst().getData("CastleModule").getCanBuilding(index);
        cc.log("弹出UI data",data);
        var arr =[];
        for (var i in data) {
            cc.log("弹出UI",data[i]);
            if(data[i]!=1910001 && data[i]!=1912001) {
                arr.push(data[i]);
            }
        }

        var itemArray = arr;

        this.menuUI = itemArray;
        this.buildingObjectId = index;
        this.buildingPosition = pos;
    }
});
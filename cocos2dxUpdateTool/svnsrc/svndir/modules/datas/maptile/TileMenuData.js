/**
 * Created by cgMu on 2015/10/16.
 */

var TileMenuData = DataBase.extend({
    tileUI:null,
    tilePositionArray:[],
    tilePosition:cc.p(0,0),

    tileMenuBg:null,
    tileItemArray:[],
    moduleInit:false,

    callback:null,
    //弹框背景尺寸
    _menuWidth:303,
    _menuHeight:303,
    //菜单按钮尺寸
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

        //按钮菜单的坐标，索引表示拥有的按钮个数，从0开始，表示1个，最大值6
        this.tilePositionArray[0] = [cc.p((menuWidth-itemWidth)*0.5,0)];
        this.tilePositionArray[1] = [cc.p(0,(menuHeight-itemHeight)*0.5),
            cc.p((menuWidth-itemWidth),(menuHeight-itemHeight)*0.5)];
        this.tilePositionArray[2] = [cc.p((menuWidth-itemWidth)*0.5,menuHeight-itemHeight),
            cc.p(222,55),
            cc.p(18,55)];
        this.tilePositionArray[3] = [cc.p((menuWidth-itemWidth)*0.5,menuHeight-itemHeight),
            cc.p((menuWidth-itemWidth),(menuHeight-itemHeight)*0.5),
            cc.p((menuWidth-itemWidth)*0.5,0),
            cc.p(0,(menuHeight-itemHeight)*0.5)];
        this.tilePositionArray[4] = [cc.p((menuWidth-itemWidth)*0.5,menuHeight-itemHeight),
            cc.p(228,158),
            cc.p(205,30),
            cc.p(38,30),
            cc.p(12,158)];
        this.tilePositionArray[5] = [cc.p((menuWidth-itemWidth)*0.5,menuHeight-itemHeight),
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

    destroy:function()
    {
        this.tileUI = null;
        this.tilePosition = cc.p(0,0);
        this.tileItemArray = [];
        this.moduleInit = false;
    },

    //data:{x:100,y:100,list[]}
    //list:[{id:123,back:this.clickBack,thisObj:this}]
    setNewTileData: function (data) {
        var itemArray = [];

        this.callback = {};
        for(var i in data.list) {
            var id = data.list[i].id;
            itemArray.push(id);
            this.callback[id]=data.list[i];
        }

        this.tileUI = itemArray;
        this.tilePosition = cc.p(data.x,data.y);
    }
});
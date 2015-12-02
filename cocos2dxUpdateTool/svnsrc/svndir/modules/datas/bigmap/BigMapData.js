var BigMapData = DataBase.extend({
    name: "no data",
    //活动对象管理器
    action: null,
    ctor: function () {
        this._super();
        //初始化活动对象管理器
        this.action = BigMapActionData.getInstance();
        //this.action.setBlocks(paths);
        trace("初始化BigMapData");
        //this.getBackgroundList(-100,-100,960,640);
    },
    init: function () {
    },
    destroy: function () {
    },
    getName: function () {
        return this.name;
    },
    getAStar: function () {
        return ServerMapConfig.getInstance().astar;
    },
    getActionManager: function () {
        return this.action;
    },
    getServerMapWidth: function () {
        return ServerMapConfig.getInstance().getMapCountCol() * MapUtils.mapWidth;
    },
    getServerMapHeight: function () {
        return ServerMapConfig.getInstance().getMapCountRow() * MapUtils.mapHeight;
    },
});
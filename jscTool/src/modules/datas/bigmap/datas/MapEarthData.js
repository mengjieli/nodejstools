var MapEarthData = MapObject.extend({
    ctor: function (config) {
        this._super();
        this.config = config;
    },
    receiveInfo: function (user, castle, coordX, coordY, useAccelerationCard, earthCard, productionResourceId, resourceAmount) {
        this.user = user;
        this.castle = castle; //城堡id
        this.coordX = coordX; //格子坐标
        this.coordY = coordY; //格子坐标
        var pos = MapUtils.transPointToPosition(coordX, coordY);
        this.x = pos.x;
        this.y = pos.y;
        this.useAccelerationCard = useAccelerationCard; //是否使用效率卡
        this.earthCard = earthCard; //使用的土地卡
        this.productionResourceId = productionResourceId; //产出的资源类型id
        this.resourceAmount = resourceAmount; //产出的资源数量
        this.call(MapEarthData.UPDATE);
    }
});

MapEarthData.UPDATE = "update";

ListenerBase.registerClass(MapEarthData);
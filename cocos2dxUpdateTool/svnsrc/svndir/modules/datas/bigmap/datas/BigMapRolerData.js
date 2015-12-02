var BigMapRolerData = MapObject.extend({
    ctor: function (info) {
        this.id = info.id;
        this.coordX = info.x;
        this.coordY = info.y;
        var pos = MapUtils.transPointToPosition(info.x, info.y);
        this.x = pos.x;
        this.y = pos.y;
    },
    moveTo: function (coordX, coordY, x, y) {
        this.coordX = coordX;
        this.coordY = coordY;
        this.x = x;
        this.y = y;
        this.call(MapCamera.MOVE, this.x, this.y);
    }
});

ListenerBase.registerClass(BigMapRolerData);
var MapRolerData = MapObject.extend({
    ctor: function (type) {
        this._super();
        this.type = type; //类型 比如 1207001
    },
    receiveInfo: function (id, user, castle, name, coordX, coordY) {
        console.log("收到角色消息");
        var updateFlag = true;
        if(!this.id) {
            updateFlag = false;
        }
        this.id = id; //部队的唯一 id
        this.user = user; // 拥有者玩家 id
        this.castle = castle; //城堡 id
        this.name = name; //城堡的名称，这里是部队，所以无意义
        var moveFlag = false;
        if(this.serverCoordX != coordX || this.serverCoordY != coordY) {
            trace("角色位置变化",this.serverCoordX,this.serverCoordY,coordX,coordY);
            moveFlag = true;
        }
        this.coordX = coordX; //坐标 x
        this.coordY = coordY; //坐标 y
        this.serverCoordX = coordX;
        this.serverCoordY = coordY;
        var pos = MapUtils.transPointToPosition(coordX, coordY);
        this.x = pos.x;
        this.y = pos.y;
        if(updateFlag) {
            if(moveFlag) {
                this.call(MapRolerData.MOVE);
            }
        }
    },
    moveTo: function (coordX, coordY, x, y) {
        this.coordX = coordX;
        this.coordY = coordY;
        this.x = x;
        this.y = y;
    }
});

MapRolerData.MOVE = "move";

ListenerBase.registerClass(MapRolerData);
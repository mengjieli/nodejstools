var MapCastleData = MapObject.extend({
    ctor: function (type) {
        this.type = type;
        this._super();
    },
    receiveCastleInfo: function (id, user, castle, name, coordX, coordY) {
        this.id = id;
        this.user = user;
        this.castle = castle;
        this.name = name;
        this.coordX = coordX;
        this.coordY = coordY;
        var pos = MapUtils.transPointToPosition(coordX, coordY);
        this.x = pos.x;
        this.y = pos.y;
    },
    receiveFromCastle: function (castle) {

    }
});
/**
 * 地图上的显示对象类型
 * @type {{BackGround: string, Tree: string, Build: string, Player: string, Effect: string}}
 */
var MapDisplayType = {
    "BackGround": "backgroud", //地图背景
    "Tree": "tree", //地图固定景色
    "Build": "build", //建筑
    "Player": "player", //角色
    "Effect": "effect", //特效
    "Earth":"earth" //地块信息
}


/**
 * 地图上的显示对象
 */
var MapDisplayBase = cc.Sprite.extend({
    mapId: null,
    type: null,
    url: null,
    px: null,
    py: null,
    coordX: null,
    coordY: null,
    order: null,
    ctor: function (type) {
        this._super();
        this.mapId = MapDisplayBase.mapId++;
        this.type = type;
        //trace("新建地图对象：", url);
    },
    /**
     * 设置视觉排序位置
     * @param val
     */
    setOrder: function (val) {
        this.order = val;
    },
    setCoord: function (x, y) {
        this.coordX = x;
        this.coordY = y;
        var pos = MapUtils.transPointToPosition(x, y);
        this.setPos(pos.x, pos.y);
    },
    setSelected: function (flag) {

    },
    isTouch: function (x, y) {
        if (x == this.coordX && y == this.coordY) {
            return true;
        }
        return false;
    },
    /**
     * 设置位置
     * @param x
     * @param y
     */
    setPos: function (x, y) {
        if (x == this.px && y == this.py) {
            return;
        }
        this.px = x;
        this.py = y;
        if (this.order == null) {
            this.order = y;
        }
        //trace("位置：",this.url,x,y);
        this.setPosition(x, y);
    },
    dispose: function () {
        if (this.getParent()) {
            this.getParent().removeChild(this);
        }
    }
});

MapDisplayBase.mapId = 0;
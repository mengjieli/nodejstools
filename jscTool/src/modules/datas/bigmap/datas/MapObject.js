var MapObject  = cc.Class.extend({
    ctor:function(){
        //占用格子
        this.grids = [
            [0, 0]
        ]
        //周边格子
        this.sideGrids = null;
        //位置
        this.x = 0;
        this.y = 0;
        //格子位置
        this.coordX = 0;
        this.coordY = 0;
        //id
        this.id = null;
        //所属城池id
        this.castle = null;
        //名称
        this.name = "";
        //所属玩家id
        this.user = null;
        //障碍
        this.blocks = null;
    },
    moveTo:function (x, y) {
        this.x = x;
        this.y = y;
        var pos = MapUtils.transPositionToPoint(x, y);
        this.coordX = pos.x;
        this.coordY = pos.y;
    },
    setBlocks:function(blocks,startX,startY) {
        this.blocks = blocks;
        if(this.blocs) {

        }
    }
});

ListenerBase.registerClass(MapObject);
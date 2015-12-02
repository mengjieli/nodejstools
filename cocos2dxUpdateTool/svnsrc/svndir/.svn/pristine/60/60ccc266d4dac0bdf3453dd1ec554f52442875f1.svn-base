var GridLayer = cc.Sprite.extend({
    data: null,
    config:null,
    grids: null,
    start: null, //寻路起点
    pathGrids: null,
    ctor: function () {
        this._super();
        this.grids = {};
        this.data = ModuleMgr.inst().getData("BigMapModule");
        this.pathGrids = [];
        this.config = ServerMapConfig.getInstance();
    },
    updateShow: function (camera) {
        this.setPosition(-camera.x, -camera.y);
        var minPos = MapUtils.transPositionToPoint(camera.x - 100, camera.y - 100);
        var maxPos = MapUtils.transPositionToPoint(camera.x + camera.width + 100, camera.y + camera.height + 100);
        //trace("更新格子", minPos.x, minPos.y, maxPos.x, maxPos.y);
        for (var y = minPos.y; y < maxPos.y; y++) {
            for (var x = minPos.x; x < maxPos.x; x++) {
                if (!this.grids[y]) {
                    this.grids[y] = {};
                }
                if (!this.grids[y][x]) {
                    var pos = MapUtils.transPointToPosition(x, y);
                    var grid = new MapBlock();
                    grid.setInfo({
                        x: x,
                        y: y,
                        type: this.config.getBlock(x, y).type
                    });
                    this.addChild(grid);
                    grid.setPosition(pos.x, pos.y);
                    this.grids[y][x] = grid;
                }
            }
        }
    },
    onTouch: function (x, y) {
        var pos = MapUtils.transPositionToPoint(x, y);
        var grid = this.grids[pos.y][pos.x];
        grid.showLight(255,0,0,255);
        if (this.start == null) {
            while (this.pathGrids.length) {
                this.pathGrids.pop().showLight(255, 255, 255, 0);
            }
            grid.showLight(0, 255, 0, 80);
            this.start = grid;
        } else {
            this.pathGrids.push(this.start);
            this.pathGrids.push(grid);
            trace("格子距离:" + MapUtils.getDistance(this.start.getPosX(), this.start.getPosY(), pos.x, pos.y));
            grid.showLight(0, 0, 255, 80);
            var path = this.data.getAStar().findPath(this.start.getPosX(), this.start.getPosY(), pos.x, pos.y);
            if (path) {
                for (var i = 1; i < path.length - 1; i++) {
                    if(this.grids[path[i].y] && this.grids[path[i].y][path[i].x]) {
                        grid = this.grids[path[i].y][path[i].x];
                        grid.showLight(100, 100, 0, 150);
                        this.pathGrids.push(grid);
                    }
                }
            }
            this.start = null;
        }
    }
});
function ServerMapConfig() {
    ServerMapConfig.instance = this;
    //地图配置
    this.config = null;
    //获取地图配置等待返回列表 item:{back:Function,thisObj:any}
    this.loadList = [];

    //地图列表
    this.maps = null;

    this.path = "res/fight/maps/server0.json";

    //源地图配置
    this.mapsources = null;
    //一个服务器地图的宽
    this.serverMapWidth = null;
    //一个服务器地图的高
    this.serverMapHeight = null;
    //所有背景列表，二维数组，以 MapUtils.singleWidth 和 MapUtils.singleHeight 划分
    this.background = null;
    //所有地块信息
    this.blocks = null;
    //寻路
    this.astar = null;
    var _this = this;
    //注意这里的cc.loader 实际上是立刻返回的。
    cc.loader.loadJson(this.path, function (error, data) {
        if (error) {
            console.log("加载配置失败:" + _this.path);
        } else {
            console.log("服务器地图加载完毕");
            _this.config = data;
            _this.loadConfigBack();
            _this.initMapInfo();
        }
    });
}

ServerMapConfig.prototype.initMapInfo = function () {
    this.serverMapWidth = this.getMapCountCol() * MapUtils.mapWidth;
    this.serverMapHeight = this.getMapCountRow() * MapUtils.mapHeight;
    this.mapsources = {
        "map_0_0": new MapSourceConfig("map_0_0"),
        "map_0_1": new MapSourceConfig("map_0_1"),
        "map_1_2": new MapSourceConfig("map_1_2"),
        "map_1_3": new MapSourceConfig("map_1_3"),
        "map_2_2": new MapSourceConfig("map_2_2"),
        "map_2_3": new MapSourceConfig("map_2_3"),
        "map_3_1": new MapSourceConfig("map_3_1"),
        "map_3_4": new MapSourceConfig("map_3_4"),
        "map_3_5": new MapSourceConfig("map_3_5"),
        "map_4_4": new MapSourceConfig("map_4_4"),
        "map_4_5": new MapSourceConfig("map_4_5"),
        "map_5_7": new MapSourceConfig("map_5_7"),
        "map_6_3": new MapSourceConfig("map_6_3"),
        "map_6_7": new MapSourceConfig("map_6_7"),
        "map_7_3": new MapSourceConfig("map_7_3"),
        "map_7_4": new MapSourceConfig("map_7_4"),
        "map_7_5": new MapSourceConfig("map_7_5"),
        "map_7_7": new MapSourceConfig("map_7_7"),
        "map_7_9": new MapSourceConfig("map_7_9"),
        "map_8_1": new MapSourceConfig("map_8_1"),
        "map_8_9": new MapSourceConfig("map_8_9"),
        "map_9_2": new MapSourceConfig("map_9_2"),
        "map_9_3": new MapSourceConfig("map_9_3"),
        "map_9_9": new MapSourceConfig("map_9_9")
    };
    this.background = [];
    this.blocks = [];
    var sources = [
        {
            width: MapUtils.singleWidth,
            height: MapUtils.singleHeight,
            moreX: 1,
            moreY: 1,
            col: 3,
            row: 3,
            source: null,
            list: []
        },
        {
            width: MapUtils.singleWidth / 2,
            height: MapUtils.singleHeight / 2,
            moreX: 1,
            moreY: 1,
            col: 6,
            row: 6,
            source: null,
            list: []
        }
    ];
    var maps = this.maps;
    var iy;
    for (var s = 0; s < sources.length; s++) {
        for (var y = 0; y < maps.length + sources[s].moreY; y++) {
            iy = (y + maps.length) % maps.length;
            for (var x = 0; x < maps[iy].length + sources[s].moreX; x++) {
                var ix = (x + maps[iy].length) % maps[iy].length;
                var map = this.mapsources[maps[iy][ix]];
                if (s == 0 && y < maps.length && x < maps[iy].length) {
                    var blocks = map.blocks;
                    for (var by = 0; by < blocks.length; by++) {
                        for (var bx = 0; bx < blocks[by].length; bx++) {
                            if (!this.blocks[by + y * MapUtils.blockHeight]) {
                                this.blocks[by + y * MapUtils.blockHeight] = [];
                            }
                            this.blocks[by + y * MapUtils.blockHeight][bx + x * MapUtils.blockWidth] = blocks[by][bx];
                        }
                    }
                }
                sources[0].source = map.background;
                sources[1].source = map.items;
                var bg;
                if (!this.background[s]) {
                    this.background[s] = sources[s];
                }
                bg = this.background[s].list;
                for (var i = 0; i < sources[s].source.length; i++) {
                    var item = sources[s].source[i];
                    var bgx, bgy;
                    bgx = item.coordX;
                    bgy = item.coordY;
                    bgx += x * sources[s].col;
                    bgy += y * sources[s].row;
                    if (!bg[bgy]) {
                        bg[bgy] = [];
                    }
                    bg[bgy][bgx] = {
                        offX: x * MapUtils.mapWidth,
                        offY: y * MapUtils.mapHeight,
                        item: item
                    };
                }
            }
        }
    }
    //trace("{\"path\":[");
    //寻路路点信息
    var str;
    var paths = [];
    for (y = 0; y < this.blocks.length; y++) {
        paths[y] = [];
        str = "["
        for (x = 0; x < this.blocks[y].length; x++) {
            this.blocks[y][x].type = this.blocks[y][x].type;
            paths[y][x] = this.blocks[y][x].type == 1608001 ? 0 : 1;
            if(!this.blocks[y][x].type) {
                trace("地图配置有问题!!!",this.blocks[y][x].type,y,x);
            }
            str += this.blocks[y][x].type + (x < this.blocks[y].length - 1 ? "," : "");
        }
        str += "]" + (y < this.blocks.length - 1 ? "," : "");
        //trace(str);
    }
    //trace("]}");
    this.astar = new AStarSix(paths);
}

ServerMapConfig.prototype.loadConfigBack = function () {
    console.log("服务器配置：" + this.config);
    this.maps = this.config.maps;
}

ServerMapConfig.prototype.getMapCountCol = function () {
    return this.maps[0].length;
}

ServerMapConfig.prototype.getMapCountRow = function () {
    return this.maps.length;
}


/**
 * 获得一个区域范围内的背景列表
 * @param x
 * @param y
 * @param width
 * @param height
 */
ServerMapConfig.prototype.getBackgroundList = function (index, x, y, width, height) {
    //trace("获取区域内背景" + index + "：", x, y, width, height);
    var info = this.background[index];
    var background = info.list;
    var blockWidth = info.width;
    var blockHeight = info.height;
    var addX = x;
    var addY = y;
    if (x < 0) {
        while (x < 0) {
            x += this.serverMapWidth;
        }
    } else {
        x = x % this.serverMapWidth;
    }
    if (y < 0) {
        while (y < 0) {
            y += this.serverMapHeight;
        }
    } else {
        y = y % this.serverMapHeight;
    }
    addX = addX - x;
    addY = addY - y;
    var ex = x + width;
    var ey = y + height;
    //trace("获取区域内背景" + index + "：", x, y, ex, ey);
    x = Math.floor(x / blockWidth);
    y = Math.floor(y / blockHeight);
    ex = Math.floor(ex / blockWidth);
    ey = Math.floor(ey / blockHeight);
    var list = [];
    //trace("遍历" + index + "：", x, y, ex, ey, addX, addY);
    for (var j = y; j <= ey; j++) {
        for (var i = x; i <= ex; i++) {
            //trace("获取背景", i, j,background[j][i]);
            list = list.concat(background[j][i]);
            //trace("背景：", background[j][i].item.url, background[j][i].offX + background[j][i].item.x,
            //    background[j][i].offY + background[j][i].item.y, j, i, background[j][i].offX, background[j][i].offY);
        }
    }
    //trace("获取完毕");
    return {
        addX: addX,
        addY: addY,
        list: list
    };
}

/**
 * 获取地块地形信息
 * @param x 坐标 x，不要传位置坐标，传格子坐标
 * @param y
 * @returns {*}
 */
ServerMapConfig.prototype.getBlock = function (x, y) {
    var maxX = MapUtils.blockWidth * this.getMapCountCol();
    var maxY = MapUtils.blockHeight * this.getMapCountRow();
    if (x < 0) {
        while (x < 0) {
            x += maxX;
        }
    } else {
        x = x % maxX;
    }
    if (y < 0) {
        while (y < 0) {
            y += maxY;
        }
    } else {
        y = y % maxY;
    }
    return this.blocks[y][x];
}

ServerMapConfig.instance = null;

ServerMapConfig.getInstance = function () {
    return ServerMapConfig.instance;
}
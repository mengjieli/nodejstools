function MapSourceConfig(name) {
    //源地图名称
    this.name = name;
    //源地图路径
    this.path = "res/fight/mapsource/" + name + ".json";
    //配置文件
    this.config = null;
    //背景层 [{url:string,x:number,y:number}]
    this.background = null;
    //物品层 [{url:string,x:number,y:number,rotation:number,scaleX:number,scaleY:number,alpha:number}]
    this.items = null;
    //六边形格子信息
    this.blocks = null;
    //获取地图配置等待返回列表 item:{back:Function,thisObj:any}
    this.loadList = [];

    var _this = this;
    //注意这里的cc.loader 实际上是立刻返回的。
    cc.loader.loadJson(this.path, function (error, data) {
        if (error) {
            console.log("加载配置失败:" + _this.path);
        } else {
            _this.config = data;
            _this.loadConfigBack();
        }
    });
}

/**
 * 地图配置文件加载完毕，进行解析
 */
MapSourceConfig.prototype.loadConfigBack = function () {
    //解析配置文件
    //1 解析背景层
    var list = this.config.bottom;
    this.background = [];
    for (var i = 0; i < list.length; i++) {
        this.background.push({
            url: "res/fight/mapsource/item/" + list[i][0] + ".png",//"map_static_" + list[i][0] + ".png",
            x: list[i][1],
            y: list[i][2],
            coordX: list[i][3],
            coordY: list[i][4]
        });
    }
    //2 解析物品层
    list = this.config.first;
    this.items = [];
    for (i = 0; i < list.length; i++) {
        this.items.push({
            url: "res/fight/mapsource/item/" + this.name + "_" + list[i][0] + ".png",
            x: list[i][1],
            y: list[i][2],
            coordX: list[i][3],
            coordY: list[i][4]
        });
    }
    //3 解析六边形格子信息
    list = this.config.six;
    list.reverse();
    this.blocks = [];
    for (i = 0; i < list.length; i++) {
        if (i % MapUtils.blockWidth == 0) {
            if (this.blocks.length) {
                this.blocks[this.blocks.length - 1].reverse();
            }
            this.blocks.push([]);
        }
        this.blocks[this.blocks.length - 1].push({
            type: parseInt(list[i][1]),
            x: MapUtils.blockWidth - this.blocks[this.blocks.length - 1].length - 1,
            y: this.blocks.length - 1,
            rx:list[i][2],
            ry:list[i][3]
        });
    }
}
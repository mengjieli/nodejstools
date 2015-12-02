var BackgroundLayer = cc.Sprite.extend({
    data: null, //BigMapData
    config: null,//ServerMapConfig
    list: null,
    cache: null,
    index: null,
    viewOffX: null,
    viewOffY: null,
    viewOffWidth: null,
    viewOffHeight: null,
    ctor: function (index, viewOffX, viewOffY, viewOffWidth, viewOffHeight) {
        this._super();
        this.index = index;
        this.viewOffX = viewOffX;
        this.viewOffY = viewOffY;
        this.viewOffWidth = viewOffWidth;
        this.viewOffHeight = viewOffHeight;
        this.list = [];
        this.cache = [];
        this.data = ModuleMgr.inst().getData("BigMapModule");
        this.config = ServerMapConfig.getInstance();
    },
    /**
     * 显示区域背景
     * @param rect
     */
    updateShow: function (camera) {
        this.setPosition(-camera.x, -camera.y);
        trace("镜头位置", camera.x, camera.y, camera.x + camera.width - 1, camera.y + camera.height - 1);
        var bgs = [];
        var res = this.config.getBackgroundList(this.index, camera.x + this.viewOffX, camera.y + this.viewOffY, camera.width + this.viewOffWidth, camera.height + this.viewOffHeight);
        var background = res.list;
        var len = this.list.length;
        var len2 = background.length;
        var use = [];
        var find = [];
        for (var i = 0; i < len; i++) {
            use[i] = false;
        }
        for (i = 0; i < len2; i++) {
            find[i] = null;
            for (var j = 0; j < len; j++) {
                if (!use[j] && this.list[j].type == MapDisplayType.BackGround && this.list[j].url == background[i].item.url) {
                    use[j] = true;
                    find[i] = this.list[j];
                    //console.log("发现一样的对象");
                    break;
                }
            }
            /*if (find[i] == null) {
             for (var f = 0; f < this.cache.length; f++) {
             if (this.cache[f].type == MapDisplayType.BackGround && this.cache[f].url == background[i].item.url) {
             find[i] = this.cache.splice(f, 1)[0];
             trace("缓冲中找到对象", this.cache.length);
             break;
             }
             }
             }*/
        }
        for (i = 0; i < len; i++) {
            if (!use[i]) {
                //this.cache.push(this.list[i]);
                //trace("放入缓存中", this.cache.length);
                this.list[i].dispose();
            }
        }
        this.list.length = 0;
        for (i = 0; i < background.length; i++) {
            var bg;
            if (find[i]) {
                bg = find[i];
            } else {
                bg = new MapSprite(background[i].item.url);
                //bg.retain();
                this.addChild(bg);
            }
            bg.setPos(background[i].offX + background[i].item.x + res.addX, background[i].offY + background[i].item.y + res.addY);
            this.list.push(bg);
        }
        this.sortObjects();
        //trace("display count:",this.list.length);
    },
    onTouch: function (x, y) {
        //this.maps[0].onTouch(x, y);
    },
    /*
     * 列表排序
     */
    sortObjects: function () {
        var arr = this.list;
        //从大到小排序
        arr.sort(function (a, b) {
            return (a.py == b.py) ? (a.px == b.px ? 0 : (a.px < b.px ? 1 : -1)) : (a.py < b.py ? 1 : -1);
        });
        var len = arr.length;
        for (var i = 0; i < len; i++) {
            var item = arr[i];
            item.setLocalZOrder(i);
        }
    }
});
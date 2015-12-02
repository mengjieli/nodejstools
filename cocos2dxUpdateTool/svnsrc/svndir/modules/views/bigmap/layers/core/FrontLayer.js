var FrontLayer = cc.Sprite.extend({
    moduleData: null,
    data: null,
    list: null,
    ctor: function () {
        this._super();
        this.list = [];
        this.moduleData = ModuleMgr.inst().getData("BigMapModule");
        this.data = this.moduleData.getActionManager();
        this.data.addListener(BigMapActionData.ADD_EARTH, this.addEarth, this);
        console.log("front layer data " + this.data);
    },
    updateShow: function (camera) {
        console.log("front layer data update show " + this.data);
        this.setPosition(-camera.x, -camera.y);
        var earths = this.data.earths;
        var find;
        for (var i = 0; i < earths.length; i++) {
            if (earths[i].x > camera.x - 100 && earths[i].x < camera.x + camera.width + 100 &&
                earths[i].y > camera.y - 100 && earths[i].y < camera.y + camera.height + 100) {
                find = false;
                for (var f = 0; f < this.list.length; f++) {
                    //trace("比较",this.list.length,f,this.list[f].data.name,builds[i].name);
                    if (this.list[f].data == earths[i]) {
                        find = true;
                        break;
                    }
                }
                if (!find) {
                    trace("添加建筑");
                    var earth = new MapEarth(earths[i]);
                    this.addChild(earth);
                    this.list.push(earth);
                }
            }
        }
    },
    addEarth: function (earth) {
        var camera = MapCamera.getInstance();
        if (earth.x > camera.x - 100 && earth.x < camera.x + camera.width + 100 &&
            earth.y > camera.y - 100 && earth.y < camera.y + camera.height + 100) {
            this.updateShow(camera);
        }
    },
    getEarth: function (x, y) {
        for (var i = 0; i < this.list.length; i++) {
            if (this.list[i].type == MapDisplayType.Earth && this.list[i].isTouch(x, y)) {
                return this.list[i];
            }
        }
        return null;
    }
});
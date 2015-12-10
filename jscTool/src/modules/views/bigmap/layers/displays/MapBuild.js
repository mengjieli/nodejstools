var MapBuild = MapDisplayBase.extend({
    shaderLayer: null,
    data: null,
    shader: null,
    ctor: function (shaderLayer, data) {
        this._super(MapDisplayType.Build);
        this.shaderLayer = shaderLayer;
        this.data = data;
        this.show = new cc.Sprite("res/fight/build/0.png");
        this.addChild(this.show);
        this.show.setPosition(MapUtils.width / 2 - 50, 23);
        this.setCoord(this.data.coordX, this.data.coordY);


        //var sp = new cc.Sprite("res/fight/a.png");
        //this.addChild(sp);

        var txt = ccui.Text();
        txt.setString("玩家: " + OtherProfileData.getInstance().getPlayerById(data.user).name);
        this.addChild(txt);
        txt.setPosition(MapUtils.width / 2,0);

        //this.shader = new cc.Sprite("res/fight/build/0g.png");
        //this.shader.setPosition(this.px + MapUtils.width / 2, this.py);
        //this.shaderLayer.addChild(this.shader);
        //this.show.setOpacity(100);
        //trace("建筑", this.data.name, this.data.x, this.data.y, this.data.coordX, this.data.coordY);
        trace("初始化建筑", this.mapId, this.coordX, this.coordY);
    },
    //点击了建筑物
    click: function () {
        trace(this.data.user, SelfData.getInstance().accountId);
        if (this.data.user == SelfData.getInstance().accountId) {
            ProfileData.getInstance().selectCastle(this.data.id);
        }
    },
    isTouch: function (x, y) {
        if (x == this.coordX && y == this.coordY ||
            x == this.coordX - 1 && y == this.coordY ||
            x == this.coordX + 1 && y == this.coordY ||
            x == this.coordX + 2 && y == this.coordY ||
            (this.coordY % 2 == 0 && (
            x == this.coordX - 1 && y == this.coordY - 1 ||
            x == this.coordX && y == this.coordY - 1 ||
            x == this.coordX + 1 && y == this.coordY - 1 ||
            x == this.coordX - 1 && y == this.coordY + 1 ||
            x == this.coordX && y == this.coordY + 1 ||
            x == this.coordX + 1 && y == this.coordY + 1)) ||
            (this.coordY % 2 == 1 && (
            x == this.coordX && y == this.coordY - 1 ||
            x == this.coordX + 1 && y == this.coordY - 1 ||
            x == this.coordX + 2 && y == this.coordY - 1 ||
            x == this.coordX && y == this.coordY + 1 ||
            x == this.coordX + 1 && y == this.coordY + 1 ||
            x == this.coordX + 2 && y == this.coordY + 1))) {
            return true;
        }
        return false;
    },
    /**
     * 是否在势力范围内
     * @param x
     * @param y
     * @returns {boolean}
     */
    isMyCastlePowerRange: function (x, y) {
        if (this.data.user != SelfData.getInstance().accountId) {
            return false;
        }
        var dis = MapUtils.getDistance(this.coordX, this.coordY, x, y);
        var lv = 1; //TODO 获取城堡等级
        var testTable = ModuleMgr.inst().getData("ConfigTableUpdator").getConfigTableValueByKey("City_Castel", lv + "");
        if (dis <= testTable.range) {
            return true;
        }
        return false;
    },
    isMyCastle: function () {
        return this.data.id == SelfData.getInstance().accountId ? true : false;
    },
    getCastleId:function(){
        return this.data.id;
    }
});
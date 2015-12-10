var MapEarth = MapDisplayBase.extend({
    data: null,
    showbg:null,
    show: null,
    txt: null,
    level: null,
    ctor: function (data) {
        this._super(MapDisplayType.Earth);
        this.data = data;

        this.showbg = new cc.Sprite("res/fight/ui/plantbg.png");
        this.addChild(this.showbg);
        //this.showbg.setPosition(0,20);

        this.show = new cc.Sprite("res/images/ico/" + data.productionResourceId + "0.png");
        this.addChild(this.show);
        //this.show.setPosition(0,20);
        //this.show.setPosition(MapUtils.width / 2, 0);
        this.setCoord(this.data.coordX, this.data.coordY);

        var testTable = ModuleMgr.inst().getData("ConfigTableUpdator").getConfigTableValueByKey("item", this.data.earthCard + "");
        this.level = parseInt(testTable.type);
        this.txt = new ccui.Text();
        //this.txt.setString("Lv" + this.level + " : " + this.data.useAccelerationCard);
        this.txt.setTextColor({r: 0, g: 0, b: 0, a: 255});
        this.txt.setFontSize(16);
        this.addChild(this.txt);

        this.data.addListener(MapEarthData.UPDATE, this.updateData, this);
    },
    updateData: function () {
        var testTable = ModuleMgr.inst().getData("ConfigTableUpdator").getConfigTableValueByKey("item", this.data.earthCard + "");
        this.level = parseInt(testTable.type);
        //this.txt.setString("Lv" + this.level + " : " + this.data.useAccelerationCard);
    },
    isMine: function () {
        return this.data.user == SelfData.getInstance().accountId?true:false;
    },
    getUseAccelerationCard: function () {
        return this.data.useAccelerationCard;
    },
    getEarthCard:function(){
        return this.data.earthCard;
    }
});
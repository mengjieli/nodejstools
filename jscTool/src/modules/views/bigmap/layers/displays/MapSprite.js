var MapSprite = MapDisplayBase.extend({
    show:null,
    ctor:function(url){
        this._super(MapDisplayType.BackGround);
        this.show = cc.Sprite(url);
        this.show.setAnchorPoint(0,0);
        this.addChild(this.show);
    },
});
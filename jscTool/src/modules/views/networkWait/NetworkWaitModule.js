/**
 * 网络等待界面，俗称菊花
 * Created by ZhouYuLong on 2015/7/15.
 */
var NetworkWaitModule = ModuleBase.extend({

    _container:null,
    _layout:null,

    ctor:function()
    {
        this._super();
    },

    initUI:function()
    {
        this._super();

        var scaleX = cc.view.getScaleX();
        var scaleY = cc.view.getScaleY();
        var _scaleX = scaleX < 1 ? (1 / scaleX) : 1;
        var _scaleY = scaleY < 1 ? (1 / scaleY) : 1;

        this._layout = new ccui.Layout();
        this._layout.setTouchEnabled(true);
        this._layout.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
        this._layout.setBackGroundColor(cc.color(255,255,255));
        this._layout.setBackGroundColorOpacity(10);
        this._layout.width = AutoResizeUtils.frameSize.width * _scaleX;
        this._layout.height = AutoResizeUtils.frameSize.height * _scaleY;
        this.addChild(this._layout);

        this._container = new cc.Sprite();
        this.addChild(this._container);
    },

    destroy:function()
    {
        this._super();

        this._container.removeAllChildren();
        this._container.removeFromParent();
        this.removeAllChildren();
        this._container = null;
        this._layout = null;
    },

    show:function( data)
    {
        this._super(data,false);

        var duration = 0.1;

        TextureAnimation.playAnimationForMap(this._container,{scale:0.5},"res/effects/JuHua.plist","res/effects/JuHua.plist",
            "juhua_", 1, 12, duration, -1,null);

        var lp = this._layout.parent.convertToNodeSpace(cc.p(0,0));
        this._layout.x = lp.x;
        this._layout.y = lp.y;

        AutoResizeUtils.setCenter(this._container);
    },

    close:function(isPlay)
    {
        this._super(false);
    },
})

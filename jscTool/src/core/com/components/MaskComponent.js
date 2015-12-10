/**
 * Created by ZhouYuLong on 2015/7/17.
 * 遮罩组件
 */
var MaskComponent = Component.extend({

    _clip:null,
    _floor:null,

    ctor:function(parent,stencil,size,p)
    {
        this._clip  = new cc.ClippingNode();
        this._clip.setStencil(stencil);
        this._clip.setAlphaThreshold(0);
        parent.addChild(this._clip);

        this._floor = new cc.LayerColor(cc.color(0,0,0),size.width,size.height);
        if(p != null && p != undefined)
        {
            this._floor.x = p.x;
            this._floor.y = p.y;
        }
        this._clip.addChild(this._floor);
    },

    destroy:function()
    {
        this._super();

        this._clip.removeFromParent();
        this._floor.removeFromParent();
        this._clip = null;
        this._floor = null;
    },

})

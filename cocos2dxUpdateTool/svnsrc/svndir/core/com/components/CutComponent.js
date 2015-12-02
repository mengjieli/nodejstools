/**
 * Created by ZhouYuLong on 2015/7/17.
 * 裁剪组件
 */
var CutComponent = Component.extend({

    stencil:null,
    _clip:null,
    _content:null,

    /**
     * @parent      父级
     * @fileName1     遮罩图片地址
     * @p1              遮罩图片坐标
     * @fileName2      被遮罩图片地址
     * @p2              被遮罩图片坐标
     */
    ctor:function(parent,fileName1,p1,fileName2,p2)
    {
        this.stencil = new cc.Sprite(fileName1);
        this.stencil.setAnchorPoint(0,0);
        this.stencil.setPosition(p1);

        this._clip  = new cc.ClippingNode();
        this._clip.setStencil(this.stencil);
        this._clip.setAlphaThreshold(0);
        parent.addChild(this._clip);

        this._content = new cc.Sprite(fileName2);//被裁剪的内容
        this._content.setAnchorPoint(0,0);
        this._content.setPosition(p2);
        this._clip.addChild(this._content);
    },

    destroy:function()
    {
        this._super();

        this._content.removeFromParent();
        this.stencil.removeFromParent();
        this._clip.removeFromParent();
        this._clip = null;
        this.stencil = null;
        this._content = null;
    },

})

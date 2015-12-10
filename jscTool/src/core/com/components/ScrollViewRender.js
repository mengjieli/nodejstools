/**
 * Created by ZhouYuLong on 2015/8/10.
 * 滚动组件渲染器
 */
var ScrollViewRender = cc.Class.extend({

    skin:null,
    data:null,
    index:null,
    width:null,
    height:null,
    occupySize:null,//占用大小
    scrollHandler:null,//滚动回调
    owner:null,

    ctor:function(skin,index)
    {
        skin.visible = true;
        this.skin = skin;
        this.index = index;
        this.width = skin.width;
        this.height = skin.height;

        skin.setTouchEnabled(true);
        skin.addTouchEventListener(this.touchEventHandler,this);
    },

    //必须覆盖 而且调用this._super();
    setData:function(data)
    {
        this.data = data;
    },

    //必须覆盖 而且调用this._super();
    touchEventHandler:function(node,type)
    {
        if(this.scrollHandler != null)
        {
            this.scrollHandler.apply(this.owner,[node,type]);
        }
    },

    destroy:function()
    {
        if(this.skin != null)
        {
            this.skin.removeAllChildren();
            this.skin.removeFromParent();
        }
        this.skin = null;
        this.data = null;
        this.index = null;
        this.width = null;
        this.height = null;
        this.occupySize = null;
        this.scrollHandler = null;
        this.owner = null;
    },

})
/**
 * Created by ZhouYuLong on 2015/8/10.
 * 滚动组件
 */
var ScrollViewComponent = Component.extend({

    direction:null,
    startX:null,
    startY:null,
    space:null,
    page:null,//当前第几页
    totalPage:null,//总共页数
    isRebound:false,//是否回弹
    reboundDistance:50,//回弹距离
    _parent:null,
    _list:null,
    _renderSkin:null,
    _renderCla:null,
    _moveDirection:null,//移动方向 1上 2下 3左 4右
    _lastMoveP:null,//上次移动位置
    _movePixel:null,//移动像素

    ctor:function(direction,parent,renderSkin,renderCla,space)
    {
        this._super();
        this._list = [];
        this.direction = direction;
        this._parent = parent;
        this._renderSkin = renderSkin;
        this._renderCla = renderCla;
        this.startX = 0;
        this.startY = 0;
        this.space = space;
        if(this.space == null || this.space == undefined)
        {
            this.space = 0;
        }

        this._parent.setTouchEnabled(true);
        this._parent.addTouchEventListener(this.touchEventHandler,this);
    },

    //====================对外====================
    /**
     * 添加节点
     * @data        数据
     */
    addNode:function(data)
    {
        this.setData(data);
    },

    //添加动画
    addAnimation:function()
    {

    },

    /**
     * 移除节点
     * @index        下标
     */
    removeNode:function(index)
    {
        var render = this._list[index];
        if(render != null)
        {
            render.destroy();
            render = null;
            this._list.splice(index,1);
        }
    },

    //移除动画
    removeAnimation:function()
    {

    },

    /**
     * 更新数据(如有需要请重写该方法)
     * @list        列表
     */
    updateData:function(list)
    {
        var render;
        if(this._list.length > list.length)//减少了,默认从后面删除
        {
            for(var a = 0; a < this._list.length - list.length; a++)
            {
                this.removeNode(this._list.length - a - 1);
            }
            for(var b = 0; b < this._list.length; b++)
            {
                render = this._list[b];
                render.setData(list[b]);
            }
        }
        else if(this._list.length < list.length)//增加了,默认从后面添加
        {
            for(var c = 0; c < list.length - this._list.length; c++)
            {
                this.addNode(list[c]);
            }
            for(var d = 0; d < this._list.length; d++)
            {
                render = this._list[d];
                render.setData(list[d]);
            }
        }
    },

    /**
     * 获取节点
     * @index        下标
     */
    getNode:function(index)
    {
        return this._list[index];
    },

    /**
     * 获取个数
     * @return   个数
     */
    getCount:function()
    {
        return this._list.length;
    },

    /**
     * 清除
     */
    clear:function()
    {
        for(var a = 0; a < this._list.length; a++)
        {
            var render = this._list[a];
            render.destroy();
            render = null;
        }
        this._list.length = 0;
    },

    /**
     * 设置数据
     * @data    数据
     */
    setData:function(data)
    {

    },

    /**
     * 设置可见
     * @value    可见值
     */
    setVisible:function(value)
    {
        this._parent.visible = value;
    },

    destroy:function()
    {
        for(var a = 0; a < this._list.length; a++)
        {
            var render = this._list[a];
            render.destroy();
            render = null;
        }
        this._list.length = 0;
        if(this._parent != null)
        {
            this._parent.removeAllChildren();
            this._parent.removeFromParent();
        }
        this._parent = null;
        this._list = null;
        this._super();
    },

    //====================对内====================
    //回弹
    reboundHandler:function()
    {

    },

    touchEventHandler:function(node,type)
    {

    },
})
ScrollViewComponent.SCROLL = "scroll";
ScrollViewComponent.STOP_SCROLL = "stop_scroll";
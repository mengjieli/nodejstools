/**
 * Created by ZhouYuLong on 2015/8/11.
 * 横向滚动组件
 */
var HScrollViewComponent = ScrollViewComponent.extend({

    /**
     * @parent          父容器
     * @renderSkin     渲染器皮肤
     * @renderCla      渲染器类(必须继承ScrollViewRender)
     * @space           渲染器间隔
     */
    ctor:function(parent,renderSkin,renderCla,space)
    {
        this._super(Component.HORIZONTAL,parent,renderSkin,renderCla,space);
    },

    //====================对外====================
    setData:function(data)
    {
        var render = new this._renderCla(this._renderSkin.clone(),this._list.length);
        render.scrollHandler = this.touchEventHandler;
        render.owner = this;
        render.setData(data);
        this._parent.addChild(render.skin);
        render.skin.x = this.startX + (render.width + this.space) * this._list.length;
        render.skin.y = this.startY;
        render.occupySize = this.startX + (render.width + this.space);
        this._list.push(render);
        var average = Math.ceil(this._parent.width / render.occupySize);
        this.totalPage = Math.ceil(this._list.length / average);
    },

    /**
     * 移除节点
     * @index        下标
     */
    removeNode:function(index)
    {
        var render = this._list[index];
        var width = render.width;
        if(render != null)
        {
            this._super(index);
            //for(var a = this._list.length - index; a < )
        }
    },

    //====================对内====================
    left:function()
    {
        var lastRender = this._list[this._list.length - 1];
        if(lastRender == null || lastRender == undefined)
        {
            return;
        }
        var moveValue = 0;
        if(lastRender.skin.x + lastRender.skin.width - this._movePixel >= this._parent.width)
        {
            moveValue = this._movePixel;
        }
        else if(this.isRebound == true)
        {
            if(lastRender.skin.x  + lastRender.skin.width - this._movePixel >= this._parent.width - this.reboundDistance)
            {
                moveValue = this._movePixel;
            }
            else if(lastRender.skin.x + lastRender.skin.width >= this._parent.width - this.reboundDistance)
            {
                moveValue = lastRender.skin.x - lastRender.skin.width - this._parent.width - this.reboundDistance;
            }
            else
            {
                moveValue = 0;
            }
        }
        else
        {
            moveValue = this._parent.width - lastRender.skin.x - lastRender.skin.width;
        }
        if(moveValue > 0)
        {
            for(var a = 0; a < this._list.length; a++)
            {
                var render = this._list[a];
                render.skin.x -= moveValue;
            }
        }
    },

    right:function()
    {
        cc.error(" right:function():");
        if(this._list[0] == null || this._list[0] == undefined)
        {
            return;
        }
        var firstRender = this._list[0];
        var moveValue = 0;
        if(firstRender.skin.x + this._movePixel < 0)
        {
            moveValue = this._movePixel;
        }
        else if(this.isRebound == true)
        {
            if(firstRender.skin.x  + this._movePixel < this.reboundDistance)
            {
                moveValue = this._movePixel;
            }
            else if(firstRender.skin.x + this._movePixel < this.reboundDistance)
            {
                moveValue = this._movePixel;
            }
            else
            {
                moveValue = 0;
            }
        }
        else
        {
            moveValue = Math.abs(firstRender.skin.x);
        }
        if(moveValue > 0)
        {
            for(var a = 0; a < this._list.length; a++)
            {
                var render = this._list[a];
                render.skin.x += moveValue;
            }
        }
    },

    //回弹
    reboundHandler:function(value)
    {
        cc.error("reboundHandler:function(value):" + value);
        var duration = 0.2;
        var render;
        switch(this._moveDirection)
        {
            case Component.LEFT:
                for(var a = 0; a < this._list.length; a++)
                {
                    render = this._list[a];
                    render.skin.runAction(cc.moveTo(duration,cc.p(render.skin.x + value,render.skin.y)));
                }
                break;
            case Component.RIGHT:
                for(var b = 0; b < this._list.length; b++)
                {
                    render = this._list[b];
                    render.skin.runAction(cc.moveTo(duration,cc.p(render.skin.x - value,render.skin.y)));
                }
                break;
        }
    },

    touchEventHandler:function(node,type)
    {
        if(type == ccui.Widget.TOUCH_BEGAN)
        {
            this._lastMoveP = node.getTouchBeganPosition();
        }
        else if(type == ccui.Widget.TOUCH_MOVED)
        {
            this.dispatchEvent(ScrollViewComponent.SCROLL,ScrollViewComponent.SCROLL);
            if(this._lastMoveP.x > node.getTouchMovePosition().x)//向左
            {
                this._moveDirection = Component.LEFT;
                this._movePixel = this._lastMoveP.x - node.getTouchMovePosition().x;
                this.left();
            }
            else//向右
            {
                this._moveDirection = Component.RIGHT;
                this._movePixel = node.getTouchMovePosition().x - this._lastMoveP.x;
                this.right();
            }
            this._lastMoveP = node.getTouchMovePosition();
        }
        else if(type == ccui.Widget.TOUCH_ENDED || type == ccui.Widget.TOUCH_CANCELED)
        {
            this.dispatchEvent(ScrollViewComponent.STOP_SCROLL,ScrollViewComponent.STOP_SCROLL);
            if(this.isRebound == true)
            {
                var render;
                switch(this._moveDirection)
                {
                    case Component.LEFT:
                        render = this._list[this._list.length - 1];
                        if(render == null || render == undefined)
                        {
                            return;
                        }
                        if(render.skin.x + render.skin.width < this._parent.width)
                        {
                            this.reboundHandler(this._parent.width - render.skin.x - render.skin.width);
                        }
                        break;
                    case Component.RIGHT:
                        render = this._list[0];
                        if(render == null || render == undefined)
                        {
                            return;
                        }
                        if(render.skin.x > 0)
                        {
                            this.reboundHandler(render.skin.x);
                        }
                        break;
                }
            }
        }
    },

})

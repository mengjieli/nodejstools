/**
 * Created by ZhouYuLong on 2015/8/11.
 * 纵向滚动组件
 */
var VScrollViewComponent = ScrollViewComponent.extend({

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
    /**
     * @data        数据
     */
    setData:function(data)
    {
        var render = new this._renderCla(this._renderSkin.clone(),this._list.length);
        render.scrollHandler = this.touchEventHandler;
        render.owner = this;
        render.setData(data);
        this._parent.addChild(render.skin);
        render.skin.x = this.startX;
        render.skin.y = this.startY + (render.height + this.space) * this._list.length;
        render.occupySize = this.startY + (render.height + this.space);
        this._list.push(render);
        var average = Math.ceil(this._parent.height / render.occupySize);
        this.totalPage = Math.ceil(this._list.length / average);
    },
    //====================对内====================
    up:function()
    {
        if(this._list[0] == null || this._list[0] == undefined)
        {
            return;
        }
        var firstRender = this._list[0];
        var moveValue = 0;
        if(firstRender.skin.y + this._movePixel < 0)
        {
            moveValue = this._movePixel;
        }
        else if(this.isRebound == true)
        {
            if(firstRender.skin.y + this._movePixel < this.reboundDistance)
            {
                moveValue = this._movePixel;
            }
            else if(firstRender.skin.y <= this.reboundDistance)
            {
                moveValue = this.reboundDistance - firstRender.skin.y;
            }
            else
            {
                moveValue = 0;
            }
        }
        else
        {
            moveValue = Math.abs(firstRender.skin.y);
        }
        if(moveValue > 0)
        {
            for(var a = 0; a < this._list.length; a++)
            {
                var render = this._list[a];
                render.skin.y += moveValue;
            }
        }
    },

    down:function()
    {
        if(this._list[this._list.length - 1] == null || this._list[this._list.length - 1] == undefined)
        {
            return;
        }
        var lastRender = this._list[this._list.length - 1];
        var moveValue = 0;
        if(lastRender.skin.y + lastRender.skin.height - this._movePixel > this._parent.height)
        {
            moveValue = this._movePixel;
        }
        else if(this.isRebound == true)
        {
            if(lastRender.skin.y + lastRender.skin.height - this._movePixel > this._parent.height - this.reboundDistance)
            {
                moveValue = this._movePixel;
            }
            else if(lastRender.skin.y + lastRender.skin.height <= this.reboundDistance)
            {
                moveValue = this.reboundDistance - lastRender.skin.y + lastRender.skin.height;
            }
            else
            {
                moveValue = 0;
            }
        }
        else
        {
            moveValue = Math.abs(lastRender.skin.y - this._parent.height);
        }
        if(moveValue > 0)
        {
            for(var a = 0; a < this._list.length; a++)
            {
                var render = this._list[a];
                render.skin.y -= moveValue;
            }
        }
    },

    //回弹
    reboundHandler:function(value)
    {
        var duration = 0.2;
        var render;
        switch(this._moveDirection)
        {
            case Component.UP:
                for(var a = 0; a < this._list.length; a++)
                {
                    render = this._list[a];
                    render.skin.runAction(cc.moveTo(duration,cc.p(render.skin.x,render.skin.y - value)));
                }
                break;
            case Component.DOWN:
                for(var b = 0; b < this._list.length; b++)
                {
                    render = this._list[b];
                    render.skin.runAction(cc.moveTo(duration,cc.p(render.skin.x,render.skin.y + value)));
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
            if(this._lastMoveP.y < node.getTouchMovePosition().y)//向上
            {
                this._moveDirection = Component.UP;
                this._movePixel = node.getTouchMovePosition().y - this._lastMoveP.y;
                this.up();
            }
            else//向下
            {
                this._moveDirection = Component.DOWN;
                this._movePixel = this._lastMoveP.y - node.getTouchMovePosition().y;
                this.down();
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
                    case Component.UP:
                        render = this._list[0];
                        if(render == null || render == undefined)
                        {
                            return;
                        }
                        if(render.skin.y > 0)
                        {
                            this.reboundHandler(render.skin.y);
                        }
                        break;
                    case Component.DOWN:
                        render = this._list[this._list.length - 1];
                        if(render == null || render == undefined)
                        {
                            return;
                        }
                        if(render.skin.y < this._parent.height)
                        {
                            this.reboundHandler(this._parent.height - render.skin.y - render.skin.height);
                        }
                        break;
                }
            }
        }
    },

})

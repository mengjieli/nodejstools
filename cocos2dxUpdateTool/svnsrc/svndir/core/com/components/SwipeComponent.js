/**
 * Created by ZhouYuLong on 2015/6/30.
 * 滑动组件
 */
var SwipeComponent = Component.extend({

    _slide:null,
    _min:null,
    _max:null,
    _direction:null,
    _moveCallBack:null,
    _moveEnd:null,
    _owner:null,
    _params:null,
    percent:null,//当前滑块所在百分比(小数)
    distance:null,//滑块可以滑动距离
    _timer:null,
    _moveP:false,

    /**
     * @direction    方向  Component.VERTICAL = "vertical";//纵向 Component.HORIZONTAL = "horizontal";//横向
     * @slide         滑块对象
     * @min           滑块在本地显示容器中最小位置坐标
     * @max           滑块在本地显示容器中最大位置坐标
     * @moveCallBack 移动回调
     * @moveEnd      移动完成回调
     * @owner         传this
     * @params        参数
     */
    ctor:function(direction,slide,min,max,moveCallBack,moveEnd,owner,params)
    {
        if(direction == undefined || direction == null)
        {
            this._direction = Component.VERTICAL;
        }
        else
        {
            this._direction = direction;
        }

        this._slide = slide;
        this._min = min;
        this._max = max;
        this._moveCallBack = moveCallBack;
        this._moveEnd = moveEnd;
        this._owner = owner;
        this._params = params;
        this.distance = Math.abs(this._max) - Math.abs(this._min);

        this._slide.setTouchEnabled(true);
        this._slide.addTouchEventListener(this.moveHandler,this);

        this._timer = new Timer(150,-1,this.updateCall,null,this);
    },

    //设置百分比(0-1)
    setPercent:function(value)
    {
        cc.error("setPercent:" + value);
        if(this._direction == Component.HORIZONTAL)//横向
        {
            this._slide.x = this._min + value * this.distance;
        }
        else
        {
            this._slide.y = this._min + value * this.distance;
        }

        this.percent = value;
    },

    //移动
    moveHandler:function(node,type)
    {
        if(ccui.Widget.TOUCH_BEGAN == type)
        {
            if(this._direction == Component.HORIZONTAL)//横向
            {
                this._moveP = this._slide.x;
            }
            else
            {
                this._moveP = this._slide.y;
            }
            this._timer.start();
        }
        else if(ccui.Widget.TOUCH_MOVED == type)
        {
            var lp = node.parent.convertToNodeSpace(node.getTouchMovePosition());
            if(this._direction == Component.HORIZONTAL)//横向
            {
                lp.x = lp.x < this._min ? this._min : lp.x;
                lp.x = lp.x > this._max? this._max : lp.x;
                this._slide.x = lp.x;
                this.percent = (Math.abs(this._slide.x) - Math.abs(this._min)) / this.distance;
            }
            else//纵向
            {
                lp.y = lp.y < this._min ? this._min : lp.y;
                lp.y = lp.y > this._max? this._max : lp.y;
                this._slide.y = lp.y;
                this.percent = (Math.abs(this._slide.y) - Math.abs(this._min)) / this.distance;
            }

            if(this._moveCallBack != null)
            {
                if(Tools.isArray(this._params) == true)
                {
                    this._moveCallBack.apply(this._owner,this._params);
                }
                else
                {
                    this._moveCallBack.apply(this._owner,[this._params]);
                }
            }
        }
        else if(ccui.Widget.TOUCH_ENDED == type || ccui.Widget.TOUCH_CANCELED == type)
        {
            if(this._moveEnd != null)
            {
                if(Tools.isArray(this._params) == true)
                {
                    this._moveEnd.apply(this._owner,this._params);
                }
                else
                {
                    this._moveEnd.apply(this._owner,[this._params]);
                }
            }
            this._timer.stop();
        }
    },

    updateCall:function()
    {
        if(this._direction == Component.VERTICAL)
        {
            if(this._slide.y != this._moveP)
            {
                this._moveP = this._slide.y;
                Sound.playSound(DZSoundConfig.HUA);
            }
        }
        else
        {
            if(this._slide.x != this._moveP)
            {
                this._moveP = this._slide.x;
                Sound.playSound(DZSoundConfig.HUA);
            }
        }
    },

    destroy:function()
    {
        this._super();

        this._timer.destroy();
        this._timer = null;
        this._moveP = null;
        this._slide = null;
        this._min = null;
        this._max = null;
        this._direction = null;
        this._moveCallBack = null;
        this._moveEnd = null;
        this._owner = null;
        this._params = null;
        this.percent = null;
        this.distance = null;
    }

})

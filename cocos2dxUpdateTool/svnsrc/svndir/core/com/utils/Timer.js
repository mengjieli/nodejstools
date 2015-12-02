/**
 * Created by ZhouYuLong on 2015/7/4.
 * 计时器
 */
var Timer = cc.Class.extend({

    KEY:"Timer定时器",
    dealy:null,
    repeatCount:null,
    currentCount:null,
    running:null,
    _updateCall:null,
    _endCall:null,
    _isDestroy:null,
    _params:null,
    _owner:null,
    _lastTime:null,

    /**
     * delay        延时(毫秒为单位)
     * repeatCount  可以执行次数 -1为无限次
     * updateCall   update执行回调
     * endCall      endCall执行完毕回调 -1没有回调
     * owner        传this
     * params       参数
     * isDestroy    执行完毕是否销毁
     */
    ctor:function(delay,repeatCount,updateCall,endCall,owner,params,isDestroy)
    {
        this.dealy = delay;
        this.repeatCount = repeatCount;
        this._updateCall = updateCall;
        this._endCall = endCall;
        this._owner = owner;
        this._params = params;
        this._isDestroy = isDestroy;
        this.currentCount = 0;
        this.running = false;
        this._lastTime = 0;
        Timer.id += 0.1;
        this.KEY = this.KEY + Timer.id;
    },

    /**
     * 启动定时器
     */
    start:function()
    {
        if(this.running == false)
        {
            this.running = true;
            EnterFrame.add(this.KEY,this.enterFrame,this);
        }
    },

    /**
     * 停止定时器
     */
    stop:function()
    {
        if(this.running == true)
        {
            this.running = false;
            EnterFrame.del(this.KEY);
        }
    },

    /**
     * 重置定时器并且停止
     */
    reset:function()
    {
        this.stop();
        this.currentCount = 0;
        this._lastTime = 0;
    },

    /**
     * 对内(外部不要调用)
     */
    enterFrame:function(delay)
    {
        this._lastTime += (delay * 1000);
        if(this._lastTime >= this.dealy)
        {
            this._lastTime = 0;
            this.update();
        }
    },

    /**
     * 对内(外部不要调用)
     */
    update:function()
    {
        this.currentCount++;
        if(this.currentCount >= this.repeatCount && this.repeatCount != -1)
        {
            if(this._endCall != null)
            {
                if(Tools.isArray(this._params) == true)
                {
                    this._endCall.apply(this._owner,this._params);
                }
                else
                {
                    this._endCall.apply(this._owner,[this._params]);
                }
            }

            if(this._isDestroy == true)
            {
                this.destroy();
            }
            else
            {
                this.stop();
            }
        }
        else
        {
            if(this._updateCall != null)
            {
                if(Tools.isArray(this._params) == true)
                {
                    this._updateCall.apply(this._owner,this._params);
                }
                else
                {
                    this._updateCall.apply(this._owner,[this._params]);
                }
            }
        }
    },

    destroy:function()
    {
        this.stop();

        this.KEY = null;
        this.dealy = null;
        this.repeatCount = null;
        this.currentCount = null;
        this.running = null;
        this._updateCall = null;
        this._endCall = null;
        this._isDestroy = null;
        this._params = null;
        this._owner = null;
        this._lastTime = null;
    }
})
Timer.id = 0;

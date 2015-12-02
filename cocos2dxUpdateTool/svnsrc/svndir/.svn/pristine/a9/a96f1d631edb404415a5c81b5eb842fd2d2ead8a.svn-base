/*
**键盘显示，调整布局 2015-9-12 shenwei
*WARNING:子对象obj必须含有属性:attr({"originPoX":obj.x, "originPoY":obj.y});
*/
var KeyboardPanController = cc.Class.extend({

    _panel : null,
    _offset : null, //200
    _duration : null, //0.08

    _isIMEOpened : null,
    _arrUIActions : null,

    ctor : function(panel, offset, duration)
    {
        this._panel = panel;
        this._offset = offset;
        this._duration = duration;

        this._isIMEOpened = false;
        this._arrUIActions = [];
    },

    //剔除对象 : name
    //status : true  --- movingUp
    //         false --- movingDown
    adjustLayoutOnIMEShown : function(status, omit)
    {
        if(!this._panel)
        {
            cc.error("获取对象失败");
            return;
        }

        var moveObjs = this._panel.getChildren();
        var sz = moveObjs.length;
        if(0 < this._arrUIActions.length)
        {
            if(!this._arrUIActions[sz - 1].isDone())
            {
                for(var i = 0; i < sz; ++i)
                {
                    moveObjs[i].stopAllActions();
                }
                status = false;
                this._isIMEOpened = false;
            }
        }

        for(var i = 0; i < sz; ++i)
        {
            if(omit == moveObjs[i].getName()) continue;
            var po = cc.p(0, 0);
            po.x = moveObjs[i].originPoX;
            if(status)
            {
                po.y = moveObjs[i].originPoY + this._offset;
            }
            else
            {
                po.y = moveObjs[i].originPoY;
            }

            var action = moveObjs[i].runAction(cc.Sequence(
                cc.moveTo(this._duration, po.x, po.y),
                cc.callFunc(this.setIMEStatus, this, [status, i])
            ));

            this._arrUIActions[i] = action;
        }
    },

    getIMEStatus : function()
    {
        return this._isIMEOpened;
    },

    setIMEStatus : function(v1, v2)
    {
        this._isIMEOpened = v2[0];
        if(v2[1] == this._arrUIActions.length - 1)
        {
            this._arrUIActions = [];
        }
    },

    destroy : function()
    {
        this._panel = null;
        this._offset = null;
        this._duration = null;

        this._isIMEOpened = null;
        this._arrUIActions = null;
    }
});

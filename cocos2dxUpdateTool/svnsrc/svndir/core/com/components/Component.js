/**
 * Created by zhouyulong on 2015/5/21.
 * 组件基类
 */
var Component = BaseClass.extend({

    _callBack:null,
    _owner:null,

    ctor:function()
    {
        this._super();
    },

    addTouchEventListener:function(callBack,owner)
    {
        this._callBack = callBack;
        this._owner = owner;
    },

    destroy:function()
    {
        this._callBack = null;
        this._owner = null;

        this._super();
    },
})

Component.VERTICAL = "vertical";//纵向
Component.HORIZONTAL = "horizontal";//横向
Component.UP = 1;//上
Component.DOWN = 2;//下
Component.LEFT = 3;//左
Component.RIGHT = 4;//右

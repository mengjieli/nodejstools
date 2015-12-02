/**
 * Created by Administrator on 2015/10/13.
 * 动作基类
 */


var ActionBase = cc.Class.extend({


    _owner:null,
    _callBack:null,
    _callBackOwner:null,

    ctor:function( owner, call, callOwner )
    {
        this._owner = owner;
        this._callBack = call;
        this._callBackOwner = owner;
    },

    /*
     * 开始动作
     */
    runAction:function( data )
    {

    },

    /*
     * 退出动作
     */
    exitAction:function()
    {

    },

    isFinish:function()
    {
        return true;
    }
});
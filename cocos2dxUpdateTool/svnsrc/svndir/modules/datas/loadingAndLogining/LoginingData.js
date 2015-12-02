/*
**登陆显示数据2015-10-16 shenwei
*/

//本地
LoginingLocalEvent = {};

//网络
LoginingNetEvent = {};
//登陆
LoginingNetEvent.PEC_LOGIN = 200;
LoginingNetEvent.PES_LOGIN = 299;
//账号昵称
LoginingNetEvent.PEC_NICKNAME = 202;
//属性
LoginingNetEvent.ACCOUNT_ATTRIBUTES = 298;

var LoginingData = DataBase.extend({

    ctor : function()
    {
        this._super();
    },

    init : function()
    {
        this._super();
    },

    destroy : function()
    {
        this._super();
    }
});


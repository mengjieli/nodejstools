/**
 * Created by Administrator on 2015/10/19.
 */

TestEvent = {};

TestEvent.SEND_TEX_TEVENT = "send_text_event";
TestEvent.SEND_TEX_TEVENT = "send_text_event";

TestCmd = {};
TestCmd.NETMSG = 1;

var TestData = DataBase.extend({


    _str:null,

    ctor:function()
    {
        this._super();
    },

    init:function()
    {
        //NetMgr.inst().addEventListener( TestCmd.NETMSG , this.tsstCallBack, this);


        this._str = "我是数据";
    },

    destroy:function()
    {
        //NetMgr.inst().removeEventListener( TestCmd.NETMSG , this.tsstCallBack, this);
    },


    tsstCallBack:function( cmd, data )
    {

    },

    getStr:function()
    {
        return this._str;
    }

});
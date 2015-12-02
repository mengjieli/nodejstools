/**
 * Created by Administrator on 2015/11/27/0027.
 */
var PrivateChatBeanNet = cc.Class.extend({
    _data:null,//数组 数据

    _isMe:null,//是否是自己
    _role_id:null,//玩家id
    _head_id:null,//头像id
    _name:null,//名字
    _message:null,//文字信息
    _time:null,//时间


    ctor:function(data)
    {
        if(data!=null)    this._data=data;
        if(data[0]!=null) this._isMe=data[0];
        if(data[1]!=null) this._role_id=data[1];
        if(data[2]!=null) this._head_id=data[2];
        if(data[3]!=null) this._name=data[3];
        if(data[4]!=null) this._message=data[4];
        if(data[5]!=null) this._time=data[5];

    }


});
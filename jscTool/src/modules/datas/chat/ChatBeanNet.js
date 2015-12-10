/**
 * Created by Administrator on 2015/11/23/0023.
 */
var ChatBeanNet = cc.Class.extend({
    _data:null,//数组 数据
    _id:null,//id
    _channel:null,//频道
    _type:null,//类型
    _language:null,//语言
    _time:null,//时间
    _role_id:null,//玩家id
    _message:null,//文字信息
    _message_type:null,//文字类型 语音表情等


    ctor:function(data)
    {
        if(data!=null)    this._data=data;
        if(data[0]!=null) this._id=data[0];
        if(data[1]!=null) this._channel=data[1];
        if(data[2]!=null) this._type=data[2];
        if(data[3]!=null) this._language=data[3];
        if(data[4]!=null) this._time=data[4];
        if(data[5]!=null) this._role_id=data[5];
        if(data[6]!=null) this._message=data[6];
        if(data[7]!=null) this._message_type=data[7];

    }


});
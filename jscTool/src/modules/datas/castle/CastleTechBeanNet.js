/**
 * Created by Administrator on 2015/11/05/0005.
 */
var CastleTechBeanNet = cc.Class.extend({
    _data:null,//数组 数据

    _castle_id:null,
    _tech_id:null,//科技id
    _tech_level:null,//科技等级
    _state:null,//状态
    _state_param1:null,//状态参数1//升级总需要时间 倒计时进度条需要
    _state_param2:null,//状态参数2
    _state_begin:null,//开始时间点 本地时间，毫秒
    _state_remain:null,//剩余时间 毫秒

    ctor:function(data)
    {
        if(data!=null)this._data=data;
        if(data[0]!=null) this._castle_id=data[0];
        if(data[1]!=null) this._tech_id=data[1];
        if(data[2]!=null) this._tech_level=data[2];
        if(data[3]!=null) this._state=data[3];
        if(data[4]!=null) this._state_param1=data[4];
        if(data[5]!=null) this._state_param2=data[5];
        if(data[6]!=null) this._state_begin=data[6];
        if(data[7]!=null) this._state_remain=data[7];

    }


});
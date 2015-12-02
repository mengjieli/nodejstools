/**
 * Created by Administrator on 2015/11/03/0003.
 */
var CastleBlockBeanNet = cc.Class.extend({
    _data:null,//数组 数据

    _castle_id:null,
    _index:null,//地块索引
    _building_id:null,//建筑物id
    _building_level:null,
    _state:null,//状态
    _state_param1:null,//升级总需要时间 倒计时进度条需要
    _state_param2:null,//状态参数2
    _state_begin:null,//开始时间点 本地时间，毫秒
    _state_remain:null,//剩余时间 毫秒

    ctor:function(data)
    {
        if(data!=null)    this._data=data;
        if(data[0]!=null) this._castle_id=data[0];
        if(data[1]!=null) this._index=data[1];
        if(data[2]!=null) this._building_id=data[2];
        if(data[3]!=null) this._building_level=data[3];
        if(data[4]!=null) this._state=data[4];
        if(data[5]!=null) this._state_param1=data[5];
        if(data[6]!=null) this._state_param2=data[6];
        if(data[7]!=null) this._state_begin=data[7];
        if(data[8]!=null) this._state_remain=data[8];
    }


});
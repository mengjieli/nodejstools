/**
 * Created by Administrator on 2015/10/29/0029.
 */
var CastleBuildingxyBeanCSV = cc.Class.extend({
    _data:null,

    _id:null,
    _x:null,
    _y:null,
    _num:null,
    _type:null,//拆除类型

    ctor:function(data)
    {
        this._data=data;
        this._id = data.id;
        this._x = data.x;
        this._y = data.y;
        this._num = data.num;
        this._type = data.type;

        //cc.log(this._index+"<<index type  @@@"+this._building_id);
        //cc.log(this._building_id.length);
    },




});
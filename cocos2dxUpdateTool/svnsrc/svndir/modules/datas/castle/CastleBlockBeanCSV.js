/**
 * Created by Administrator on 2015/10/29/0029.
 */
var CastleBlockBeanCSV = cc.Class.extend({
    _data:null,

    _index:null,
    _type:null,
    _building_id:null,
    _x:null,
    _y:null,
    _res:null,

    ctor:function(data)
    {
        this._data=data;
        this._index = data.index;
        this._type = data.type;
        //cc.log(data.building_id+"<<<data.building_id"+typeof(data.building_id));
        //cc.log(data.building_id.substr(1,String(data.building_id).length-2))
        this._building_id = (data.building_id.substr(1,String(data.building_id).length-2)).split(",");
        //cc.log(this._building_id+"building-id"+this._building_id[0]);
        this._x = data.x;
        this._y = data.y;
        this._res = data.res;
        //cc.log(this._y+"#######this._y")
        //cc.log(typeof (this._building_id)+data.building_id.substr(1,data.building_id.length-2) );


        //cc.log(this._index+"<<index type  @@@"+this._building_id);
        //cc.log(this._building_id.length);
    },




});
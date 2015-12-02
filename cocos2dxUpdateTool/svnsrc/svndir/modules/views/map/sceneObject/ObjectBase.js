/**
 * Created by Administrator on 2015/10/8.
 *
 * 显示对象基类，所有显示在场景中的对象都必须继承该类
 */


ObjectType = {};

ObjectType.STATIC = 1;
ObjectType.TROOPS = 2;

/**
 * 对象层次，数字大的盖住数字小的
 */
ObjectLayerType                = {};
ObjectLayerType.BACKGROUND     = 0; //背景
ObjectLayerType.STATICOBJECT   = 1; //静态对象
ObjectLayerType.BOTTOM         = 2;
ObjectLayerType.OBJECT         = 3;
ObjectLayerType.EFFECT         = 4;
ObjectLayerType.End            = 5;


var ObjectBase = cc.Node.extend({

    _id:0,              //实例对象ID
    _configId:0,        //配置ID
    _objectType:0,
    _objectLayer:0,

    ctor:function()
    {
        this._super();
    },

    setID:function( id )
    {
        this._id = id;
    },

    getID:function()
    {
      return this._id;
    },

    setObjectLayer:function( layer )
    {
        this._objectLayer = layer;
    },

    getObjectLayer:function( )
    {
        return this._objectLayer;
    },

    setObjectType:function( objectType )
    {
        this._objectType = objectType;
    },

    getObjectType:function()
    {
        return this._objectType;
    },

});
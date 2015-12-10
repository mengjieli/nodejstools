/**
 *
 * 文件名: DataFactory.js
 * 创建者: zwp - Administrator
 * 创建时间: 2015/3/27- 14:41
 *
 * 功能说明:
 * 数据工厂类
 */
var g_root = g_root || this; //全局对像引用

var DataFactory = function ()
{
    var _me = this;
    var _dataClassDic = null;
    var _initDic = null;
    var _dataDic = null;

    function init ()
    {
        _dataClassDic = {};
        _initDic = {};
        _dataDic = {};
    }

    this.initData = function ()
    {
        for ( var i in _dataClassDic )
        {
            if ( _initDic[ i ] )
            {
                _me.getData ( i );
            }
        }
    }

    /*
     * 注册模块数据类
     * dataName : 模块名称
     * dataName : 模块类名称
     * isInit ： 是否游戏一开始就自动创建初始化
     */
    this.registerDataClass = function ( dataName , dataClassName , isInit )
    {
        _dataClassDic[ dataName ] = dataClassName;
        _initDic[ dataName ] = isInit;
    }

    this.removeDataClass = function ( dataName )
    {
        if ( _dataClassDic[ dataName ] )
        {
            delete _dataClassDic[ dataName ];
        }
    }


    this.getData = function ( dataName )
    {
        var data = _dataDic[ dataName ];
        if ( data == null )
        {
            var dataClassName = _dataClassDic[ dataName ];
            if ( dataClassName == null )
            {
                cc.error ( "模块数据类不存在: " + dataClassName );
                return null;
            }
            var moduleClass = g_root[ dataClassName ];
            if ( moduleClass && moduleClass.constructor == Function )
            {
                data = new moduleClass();
                data.init ();
                _dataDic[ dataName ] = data;
            }
            else
            {
                cc.error ( "创建模块数据失败: " + dataClassName );
                return null;
            }
        }
        return data;
    }

    /*
     * 删除模块数据
     * dataName :　模块数据名称
     */
    this.removeData = function ( dataName )
    {
        var data = _dataDic[ dataName ];
        if ( data )
        {
            data.destroy ();
            delete _dataDic[ dataName ];
        }
    }

    /*
     * 删除所有模块数据
     * proxyName :　模块数据名称
     */
    this.removeAllData = function ()
    {
        for ( var i in _dataDic )
        {
            var data = _dataDic[ i ];
            _me.removeData ( data );
        }
    }

    init();


}
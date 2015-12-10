/**
 * Created by Administrator on 2015/10/24.
 */

var g_root;
g_root = g_root || this; //全局对像引用

ModuleLayer = {};
ModuleLayer.LAYER_TYPE_MAP = 0;
ModuleLayer.LAYER_TYPE_UI = 1;
ModuleLayer.LAYER_TYPE_TOPUI = 2;
ModuleLayer.LAYER_TYPE_TOP = 3;


var ModuleFactory = function (  )
{
    var _me = this;
    var _gameScene = null;
    var _moduleConfigDic = null;	//模块配置列表  		模块名称为KEY
    var _moduleDic = null;          //模块容器
    var _mainLayer = null;	        //游戏显示主层
    var _layerArr = null;	        //层级列表

    function init ()
    {
        _moduleConfigDic = {};
        _moduleDic = {};
        _layerArr = [];
        _gameScene = new cc.Scene ();
        cc.director.runScene ( _gameScene );

        _mainLayer = new cc.Layer ();
        _gameScene.addChild ( _mainLayer );

        for ( var i = 0 ; i <= ModuleLayer.LAYER_TYPE_TOP ; i++ )
        {
            var layer = new cc.Layer ();
            _mainLayer.addChild ( layer );
            _layerArr[ i ] = layer;
        }
    }

    /*
     * 注册模块
     * moduleName　		：　模块的名称
     * moduleClassName　	： 	模块类名
     * layer			： 	模块显示的层次
     * isCache			：	是存缓存
     */
    this.registerModuleClass = function ( moduleName , moduleClassName , layer , isCache )
    {
        /*
         * 对像说明
         * moduleClassName 	类名
         * layer 			显示所在的层次
         * isCache 			是否保存
         * count 			引用记数
         */
        var cache = isCache == undefined ? false : isCache;
        _moduleConfigDic[ moduleName ] =
        {
            moduleClassName : moduleClassName ,
            layer : layer ,
            isCache : cache
        };
    }

    this.removeModuleClass = function( moduleName )
    {
        if( _moduleConfigDic[moduleName] )
        {
            delete _moduleConfigDic[moduleName];
        }
    }


    this.openModule = function ( moduleName , parameters )
    {
        var module = _moduleDic[ moduleName ];
        if ( module )
        {
            cc.log ( "---------------------------------------打开模块： " + moduleName );
            module.module.show ( parameters );
            if( module.module.isVisible() == false ) module.module.setVisible( true );
            return;
        }
        var config = _moduleConfigDic[ moduleName ];
        if ( config == null ) return;
        var moduleClass = g_root[ config.moduleClassName ];
        if ( moduleClass && moduleClass.constructor == Function )
        {

            cc.log ( "---------------------------------------创建打开模块： " + moduleName );
            var module = {};
            module.module = new moduleClass ();
            _me.addNodeTOLayer ( module.module , config.layer );
            _moduleDic[ moduleName ] = module;
            module.isCache = config.isCache;
            module.module.initUI ();
            module.module.show ( parameters );
        }
        else
        {
            cc.error ( moduleName + "：模块不存在" );
        }
    }

    /*
     * 关闭模块
     * moduleName : 模块名称
     */
    this.closeModule = function ( moduleName )
    {
        var module = _moduleDic[ moduleName ];
        if ( module )
        {
            module.module.close ();
            cc.log ( "---------------------------------------关闭模块： " + moduleName );
            destroyModule ( moduleName );
            return;
        }
    }

    /*
     * 添加显示对像到层中
     * node	 :　需要显示的对像
     * layer ：	显示的层次
     */
    this.addNodeTOLayer = function ( node , layer )
    {
        var l = _layerArr[ layer ];
        l.addChild ( node );
    }

    /*
     * 从层中删除显示对像
     * node	 :　需要删除的对像
     * layer ：	显示的层次
     */
    this.removeNodeToLayer = function( node, layer )
    {

    }

    /*
     * 设置模块缓存状态
     * moduleName 	:　	模块名称
     * isCache　		：	是否缓存
     */
    this.setModuleCache = function ( moduleName , isCache )
    {
        var module = _moduleDic[ moduleName ];

        if ( module && module.isCache != isCache )
        {
            module.isCache = isCache;
        }
    }

    /*
     * 模块是否缓存
     */
    this.moduleIsCache = function( moduleName )
    {
        var module = _moduleDic[ moduleName ];
        if ( module )
        {
            return module.isCache;
        }
        return false;
    }

    /*
     * 获取内存中的所有模块
     */
    this.getModuleNameList = function ()
    {
        var arr = [];
        for( var it in _moduleDic )
        {
            arr.push( it );
        }
        return arr;
    }

    function destroyModule ( moduleName )
    {
        var module = _moduleDic[ moduleName ];
        if ( module )
        {
            var parent = module.module.getParent ();
            if ( parent != null )
            {
                if( module.isCache == false )
                {
                    module.module.destroy ();
                    parent.removeChild ( module.module );
                }
                else
                {
                    module.module.setVisible( false );
                }
            }
            if( module.isCache == false )
            {
                delete _moduleDic[ moduleName ];
                cc.log ( "---------------------------------------清除模块： " + moduleName );
            }
        }
    }

    init();
}
/*
 * 模块管理器
 * 模块类工厂，处理所有的模块创建和显示
 * 可以用　ModuleMgr.init()来防问
 * 通过registerModuel来注册模块
 * 所有的模块类都必需续承ModuleBase
 */


var g_root = this; //全局对像引用
ModuleEvent = {};
ModuleEvent.ACCEPT_OPEN_MODULE = "moduleEvent_ACCEPT_openModule";             //打开模块
ModuleEvent.ACCEPT_CLOSE_MODULE = "moduleEvent_ACCEPT_closeModule";           //关闭模块
ModuleEvent.ACCEPT_REMOVE_ALL_MODULE = "moduleEvent_ACCEPT_removeAllModule"; //清除所有模埠

ModuleEvent.SEND_OPEN_MODULE = "moduleEvent_send_open_Module";           //这个其它模块可以接收，当收到该消息。说明模块创建并添加到显示层
ModuleEvent.SEND_CLOSE_MODULE = "moduleEvent_send_close_Module";           //隐藏或关门

var ModuleMgr = function()
{
    var _me = this;

    var _moduleFactory = null;
    var _dataFactory = null;

    this.init = function()
    {
        _moduleFactory = new ModuleFactory();
        _dataFactory = new DataFactory();
        EventMgr.inst().addEventListener( ModuleEvent.ACCEPT_OPEN_MODULE, openModuleCallBack, _me );
        EventMgr.inst().addEventListener( ModuleEvent.ACCEPT_CLOSE_MODULE, closeModuleCallBack, _me );
        EventMgr.inst().addEventListener( ModuleEvent.ACCEPT_REMOVE_ALL_MODULE, removeAllModuleCallBack, _me );
    }

    this.destroy = function()
    {
        ModuleMgr.instance = null;
        //EventMgr.inst().removeEventListener( ModuleEvent.ACCEPT_OPEN_MODULE, openModuleCallBack, this );
        //EventMgr.inst().removeEventListener( ModuleEvent.ACCEPT_CLOSE_MODULE, closeModuleCallBack, this );
        //EventMgr.inst().removeEventListener( ModuleEvent.ACCEPT_REMOVE_ALL_MODULE, removeAllModuleCallBack, this );
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
        _moduleFactory.registerModuleClass( moduleName, moduleClassName, layer, isCache );
    }

    this.removeModuleClass = function( moduleName )
    {
        _moduleFactory.removeModuleClass( moduleName );
    }

    this.openModule = function( moduleName, parameters, isShowLoad )
    {
    	EventMgr.inst().dispatchEvent( ModuleEvent.ACCEPT_OPEN_MODULE, moduleName, parameters, isShowLoad );
    }

    this.closeModule = function( moduleName )
    {
        EventMgr.inst().dispatchEvent( ModuleEvent.ACCEPT_CLOSE_MODULE, moduleName );
    }

    this.removeAllModule = function( )
    {
        EventMgr.inst().dispatchEvent( ModuleEvent.ACCEPT_REMOVE_ALL_MODULE );
    }

    /*
     * 添加显示对像到层中
     * node	 :　需要显示的对像
     * layer ：	显示的层次
     */
    this.addNodeTOLayer = function ( node , layer )
    {
        _moduleFactory.addNodeTOLayer( node, layer );
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
        _moduleFactory.setModuleCache( moduleName, isCache );
    }

    /*
     * 模块是否缓存
     */
    this.moduleIsCache = function( moduleName )
    {
        return _moduleFactory.moduleIsCache( moduleName );
    }


    function openModuleCallBack ( event , moduleName , parameters, isShowLoad )
    {
    	isShowLoad = isShowLoad == undefined ? false : true;
	  	var resList = ResMgr.inst ().getModuleResources ( moduleName );

	  	if ( resList && resList.length > 0 )
	  	{
	  		cc.log ( "加载模块资源: " + moduleName );

	  		if( isShowLoad )
	  		{
	  			cc.log("显示加载进度条");
	  		}
	  			
	  		ResMgr.inst ().loadList ( moduleName , resList ,
	  				function ( event, loadName )
	  				{
	  					if( event == LoadEvent.LOAD_COMPLETE && loadName == moduleName )
	  					{
	  						_moduleFactory.openModule ( moduleName , parameters );
                            EventMgr.inst().dispatchEvent( ModuleEvent.SEND_OPEN_MODULE, moduleName );

                            cc.log("-----------------------------------------------------------------------");
                            var num = cc.textureCache.getCachedTextureInfo();
                            cc.log( num );
                            cc.log("-----------------------------------------------------------------------");
	  					}
	  				} , this );
	  	}
	  	else
	  	{
	  		_moduleFactory.openModule ( moduleName , parameters );
            EventMgr.inst().dispatchEvent( ModuleEvent.SEND_OPEN_MODULE, moduleName );
            cc.log("-----------------------------------------------------------------------");
            var num = cc.textureCache.getCachedTextureInfo();
            cc.log( num );
            cc.log("-----------------------------------------------------------------------");
	  	}
    }

    function closeModuleCallBack ( event , moduleName )
    {
        _moduleFactory.closeModule ( moduleName );
        if( _moduleFactory.moduleIsCache( moduleName ) == false ) removeModuleRes( moduleName );

        EventMgr.inst().dispatchEvent( ModuleEvent.SEND_CLOSE_MODULE, moduleName );
    }

    /*
     * 释放所有的模块
     */
    function removeAllModuleCallBack ( event )
    {
        var moduleList = _moduleFactory.getModuleNameList();
        for( var i in moduleList )
        {
            _moduleFactory.closeModule ( moduleList[i] );
            removeModuleRes( moduleList[i] );
        }
    }
    
    function removeModuleRes( moduleName )
    {
    	//清除资源
    	var resList = ResMgr.inst().getModuleResources(moduleName); 
    	for( var i in resList )
    	{
    		var res = resList[i];
    		ResMgr.inst().releaseRes( res );
    	}
    }


    /*
     * 注册模块数据类
     * dataName : 模块名称
     * dataName : 模块类名称
     * isInit ： 是否游戏一开始就自动创建初始化
     */
    this.registerDataClass = function( dataName , dataClassName , isInit )
    {
        _dataFactory.registerDataClass( dataName, dataClassName, isInit );
    }

    this.removeDataClass = function ( dataName )
    {
        _dataFactory.removeDataClass( dataName );
    }

    this.initData = function()
    {
        _dataFactory.initData();
    }

    this.getData = function( dataName )
    {
        return _dataFactory.getData( dataName );
    }

    this.removeData = function( dataName )
    {
        _dataFactory.removeData( dataName );
    }

    this.removeAllData = function ()
    {
        _dataFactory.removeAllData();
    }
}

ModuleMgr.instance = null;
ModuleMgr.inst = function ()
{
    if ( ModuleMgr.instance == null )
    {
        ModuleMgr.instance = new ModuleMgr ();
    }
    return ModuleMgr.instance;
}


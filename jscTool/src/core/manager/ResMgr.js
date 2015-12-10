/*
 * 资源管理器
 */

LoadEvent = {};
LoadEvent.LOAD_STAR = "loadEvent_star";
LoadEvent.LOAD_PROGRESS = "loadEvent_progress";
LoadEvent.LOAD_ERROR = "loadEvent_error";
LoadEvent.LOAD_COMPLETE = "loadEvent_complete";

var ResMgr = function ()
{
    //private
    var _me = this;										//本类指针
    var _moduleResConfig = null;						//模块需要的资源列表

    /**************************************************************************/

    var _resCache = null;								//资源缓冲记录
    var _loadList = null;								//正在等待加载列表
    var _isLoad = false;								//是否在加载
    var _curLoadItem = null;							//当前正在加载
    var _loadCount = 0;									//当前加载计数
    var _loadLength = 0;								//当前加载的总数

    /**************************************************************************/

    var _csvToObjectDic = null;							//csv转object配置列表
    var _josnToObjectDic = null;                        //如果数据是服务端同步的，就需要把数组转成object

    var _language = "CN";

    /**************************************************************************/

    this._jsonPath = "res/configs/jsons/";
    this._csvPath = "res/configs/csvs/";
    this._mapPath = "res/configs/maps/";
    this._icoPath = "res/images/ico/";

    function init ()
    {
        _moduleResConfig = {};

        _resCache = {};
        _loadList = [];

        _csvToObjectDic = {};
        _josnToObjectDic = {};
        _mapToObjectDic = {};
    }

    this.destroy = function()
    {
        ResMgr.instance = null;
        cc.loader.releaseAll();
        cc.spriteFrameCache.removeSpriteFrames();
        cc.textureCache.removeAllTextures();
    }

    /*
     * 注册模块所需资源列表
     */
    this.registerModuleResources = function ( moduleName , resList )
    {
        _moduleResConfig[ moduleName ] = resList;
    }

    /*
     * 获取模块所需的资源列表
     */

    this.getModuleResources = function ( moduleName )
    {
        return _moduleResConfig[ moduleName ];
    }


    /****************************Loader***************************************/

    /*
     * 获取资源
     * resPath : 资源路径
     */
    this.getRes = function ( resPath )
    {
        if ( _resCache[ resPath ] == null )
        {
            return null;
        }

        if ( resPath.indexOf ( ".png" ) != -1 )
        {
            return cc.textureCache.getTextureForKey ( resPath );
        }
        else
        {
            return cc.loader.getRes ( resPath );
        }
        return null;
    }

    this.releaseRes = function ( resPath )
    {
        cc.log ( "清除资源: " + resPath+"类型："+typeof(resPath) );
        if(typeof(resPath)!="string") return;
        if ( resPath.indexOf ( ".png" ) != -1 )
        {
            cc.textureCache.removeTextureForKey ( resPath );
        }
        else if ( resPath.indexOf ( ".jpg" ) != -1 )
        {
            cc.textureCache.removeTextureForKey ( resPath );
        }
        else if( resPath.indexOf ( ".plist" ) != -1 )
        {
            var index = resPath.indexOf ( ".plist" );
            var resName = resPath.slice ( 0 , index );
            var plist = resName + ".plist";
            var png = resName + ".png";

            cc.textureCache.removeTextureForKey ( png );
            cc.spriteFrameCache.removeSpriteFramesFromFile ( plist );
            cc.loader.release ( plist );
            cc.loader.release ( png );
        }

        delete _resCache[ resPath ];
        cc.loader.release ( resPath );
    }

    /*
     * 返回当前进度
     * return 0 - 100;
     */
    this.getLoadProgress = function ()
    {
        if ( _curLoadItem )
        {
            return ( _curLoadItem.arr.length / _loadLength >> 0 ) * 100;
        }
        return 100;
    }

    /*
     * 添加加载列表到队例 中、
     * loadName 	： 　加载的名称
     * arr			：	加载列表
     * callBack　   ：　 回调函数
     * owner			：	回调对像
     * parameter    :参数
     */
    this.loadList = function ( loadName , arr , callBack, owner, parameter )
    {
        var obj = {};
        obj.loadName = loadName;
        obj.callBack = callBack;
        obj.obj = owner == undefined ? null : owner ;
        obj.parameter = parameter;
        obj.arr = getResList ( arr );

        //有内容就添加到对列中
        if ( obj.arr.length > 0 )
        {
            _loadList.push ( obj );
        }
        //没有直接返回完成
        else
        {
            if( obj.callBack ) obj.callBack.call ( obj.obj, LoadEvent.LOAD_COMPLETE, obj.loadName, obj.parameter );
            return;
        }

        if ( _isLoad == false ) loading ();
    }

    function getResList ( arr )
    {
        var list = [];
        for ( var i in arr )
        {
            var path = arr[ i ];

            //判断文件是否存在
            if( cc.sys.isNative && jsb.fileUtils.isFileExist(path) == false )
            {
                //cc.error( "文件不存在：" + path );
                continue;
            }

            if ( _resCache[ path ] == null )
            {
                list.push ( path );
            }
        }
        return list;
    }

    function loading ()
    {

        //设置当前正在加载中
        _isLoad = true;

        if ( _loadList.length <= 0 )
        {
            //列表为空设置空闲
            _isLoad = false;
            _curLoadItem = null;
            return;
        }

        _curLoadItem = _loadList.shift ();

        //回调开始加载函数
        if ( _curLoadItem && _curLoadItem.callBack )
        {
            _curLoadItem.callBack.call ( _curLoadItem.obj, LoadEvent.LOAD_STAR, _curLoadItem.loadName );
        }

        if( _curLoadItem )
        {
            _loadLength = _curLoadItem.arr.length;
        }

        loadItem ();
    }

    function loadItem ()
    {
        if ( _curLoadItem == null )
        {
            loading ();
            return;
        }

        var resList = getResList ( _curLoadItem.arr );
        _curLoadItem.arr = resList;

        //如果加载完了就回调
        if ( resList.length <= 0 )
        {
            if ( _curLoadItem.callBack )
            {
                _curLoadItem.callBack.call ( _curLoadItem.obj, LoadEvent.LOAD_COMPLETE, _curLoadItem.loadName, _curLoadItem.parameter );
            }
            _curLoadItem = null;
            loading ();
            return;
        }

        //每次三个加载
        _loadCount = 3;
        if ( _loadCount > resList.length ) _loadCount = resList.length;
        var len = _loadCount;
        for ( var i = 0 ; i < len ; i++ )
        {
            var resPath = resList.shift ();

            if ( _curLoadItem.callBack )
            {
                _curLoadItem.callBack.call ( _curLoadItem.obj, LoadEvent.LOAD_PROGRESS, _curLoadItem.loadName );
            }
            //判断加载类型
            if ( resPath.indexOf(".plist") != -1 )
            {
                var index = resPath.indexOf ( ".plist" );
                var resName = resPath.slice ( 0 , index );
                loadPlist ( resName );
            }
            else
            {
                loadRes ( resPath );
            }
        }
    }

    function loadPlist ( resName )
    {
        var plist = resName + ".plist";
        var png = resName + ".png";

        cc.loader.load ( [ plist , png ] , function ( err )
        {
            if ( err )
            {
                cc.error ( "加载失败: %s " , plist );
                error ();
            }
            else if(cc.loader.getRes(plist) == null  )
            {
                cc.error( "加载失败: %s" , plist  );
                error ();
            }
            else
            {
                cc.spriteFrameCache.addSpriteFrames ( plist );
                _resCache[ resName + ".plist" ] = 1;
                cc.log ( "加载成功：%s " , plist );
                complete ();
            }
        } );
    }

    function loadRes ( resPath )
    {
        cc.loader.load ( [ resPath ] , function ( err )
        {
            if ( err )
            {
                cc.error ( "加载失败: %s" , resPath );
                error ();
            }
            else if( cc.loader.getRes(resPath) == null )
            {
                cc.error( "加载失败: %s" , resPath  );
                error ();
            }
            else
            {
                _resCache[ resPath ] = 1;
                cc.log ( "资源加载成功: %s" , resPath );
                complete ();
            }

        } );
    }

    function complete ()
    {
        _loadCount--;

        if ( _loadCount <= 0 )
        {
            loadItem ();
        }
    }

    function error ()
    {
        _loadCount--;

        if ( _loadCount <= 0 )
        {
            loadItem ();
        }
    }

    /****************************animation***************************************/

    this.getAnimation = function( key )
    {

    }

    /****************************animation***************************************/

    /****************************cofnig***************************************/

    /*
     * 设置语言
     */

    this.setLanguage = function( str )
    {
        _language = str;
    }

    /*
     * 读取JOSN
     * configName 配置表的名字,不用带后缀
     * key
     * isShared 是否与服务端共享的,需特需处理
     * return  返回OBJECT
     */
    this.getJSON = function( configName, key , isShared )
    {
        var path = this._jsonPath + configName + ".json";
        var obj = null;
        var config = null;
        if( isShared )
        {
            var dataObject = _josnToObjectDic[path];
            if( dataObject )
            {
                config = dataObject;
            }
            else
            {
                //在解析一次。把数组转成OBJECT
                var data = this.getRes( path );
                if( data == null || data.length < 2 ) return null;
                var keys = data.shift(); //删除第一个数组,作为KEY
                var root = {};
                for( var i=0; i<data.length; i++ )
                {
                    var arr = data[i];
                    var item = {};
                    for( var j=0; j<keys.length; j++ )
                    {
                        var itemKey = keys[j];
                        var value = arr[j];
                        item[itemKey] = value;
                    }
                    var keyIndex = 0;
                    if( path == "res/configs/jsons/City_Storage.json")
                    {
                        keyIndex = 6;
                    }
                    else if( path == "res/configs/jsons/City_Wall.json")
                    {
                        keyIndex = 7;
                    }
                    else if( path == "res/configs/jsons/City_Tower.json" )
                    {
                        keyIndex = 6;
                    }

                    if ( path == "res/configs/jsons/City_College_tech.json") {
                        root[""+arr[6]+arr[0]] = item;
                    }
                    else {
                        root[arr[keyIndex]] = item;
                    }

                }
                _josnToObjectDic[path] = root;
                config = root;
            }
        }
        else
        {
            var data = this.getRes( path );
            if( data == null ) return null;
            config = data;
        }

        if( config && key != undefined )
        {
            obj = config[key];
        }
        else
        {
            obj = config;
        }

        return obj;
    }

    /*
     * 读取csv
     * configName 配置表的名字,不用带后缀
     * key
     * return  返回OBJECT
     */
    this.getCSV = function( configName, key )
    {
        var path = this._csvPath + configName + ".csv";

        var obj = null;
        var data = null;
        do
        {
            if( _csvToObjectDic[path] )
            {
                data = _csvToObjectDic[path];
                break;
            }

            var txt = this.getRes( path );
            if( txt == null ) break;
            data = parsingData( txt );
            if( data == null ) break;
            _csvToObjectDic[path] = data;

        }while( false );


        if( data && key != undefined )
        {
            obj = data[key];
        }
        else
        {
            obj = data;
        }

        return obj;
    }


    this.getMapConfig = function( path )
    {
        var path = this._mapPath + path + ".json";
        var obj = this.getRes( path );
        return obj;
    }



    this.getString = function( key )
    {
        var str = "null";
        var obj = this.getCSV( _language, key );
        if( obj ) str = obj.value;
        return str;
    }

    this.getIcoPath = function( id )
    {
        var str = this._icoPath + id + "0.png";
        return str;
    }

    this.getItemName = function( id )
    {
        var str = this.getString( id + "0" );
        return str;
    }

    this.getItemMsg = function( id )
    {
        var str = this.getString( id + "1" );
        return str;
    }

    /*
     * 解析文本
     */
    function parsingData ( text )
    {
        var data = {};

        var strText = text;
        var tempArr = strText.split( String.fromCharCode( 13 ) );
        var arr = [];
        for ( var i in tempArr )
        {
            var str = tempArr[i];
            str = str.replace( /\n/g, "" );
            tempArr[i] = str;
            if ( str == "" ) arr.push( i );
        }
        for ( var i in arr )
        {
            tempArr.splice( arr[i], 1 );
        }
        if ( tempArr.length < 2 ) return null;

        var keyName = tempArr[0].split( "," );

        var len = tempArr.length;
        for ( var i = 1; i < len; i++ )
        {
            var value_arr = tempArr[i].split( "," );
            var obj = {};
            var keyLen = keyName.length;
            for ( var j = 0; j < keyLen; j++ )
            {
                var key = keyName[j];
                if ( key == "" ) continue;
                obj[key] = value_arr[j];
            }
            data[ obj[ keyName[ 0 ] ] ] = obj;
        }
        return data;
    }

    /****************************Text***************************************/

    init ();
}

ResMgr.instance = null;
ResMgr.inst = function ()
{
    if ( ResMgr.instance == null )
    {
        ResMgr.instance = new ResMgr ();
    }
    return ResMgr.instance;
}

cc.loader.register(["csv"], cc._txtLoader);
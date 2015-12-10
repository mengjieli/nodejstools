//2015-11-06 shenwei
//读取配置表模块数据
/*使用该模块前，如果本地有配置表名字列表，记得配置加载路径
**目录本地预先创建好,例如:  res/configs/referTables/, 该目录见提供的设置方法
**/

ConfigTableUpdateLocalEvent = {};
//更新进度: 1/10 2/10 3/10 ...
//开始
ConfigTableUpdateLocalEvent.PROGRESS_BEGIN = "progress_begin";
//进度
ConfigTableUpdateLocalEvent.PROGRESS_PAIR = "progress_pair";
//结束
ConfigTableUpdateLocalEvent.PROGRESS_END = "progress_end";

var configTableUpdatingData = DataBase.extend({

    _configResLocalPath : null,
    _configResList : null,
    _updateCount : null,
    _updateConfigTablesTimer : null,
    _configURL : null,
    _maxProgress : null,

    _isExistAll : null,
    ctor : function()
    {
        this._super();

        this._configResLocalPath = "res/configs/referTables/";
        this._configResList = [];
        this._updateCount = 0;
        this._updateConfigTablesTimer = -1;
        this._configURL = "";
        this._maxProgress = 0;
        this._isExistAll = 0;
    },

    init : function()
    {
        this._super();
    },

    /*本地记录
    **
    */
    loadConfigTableList : function()
    {
        var storagePath = jsb.fileUtils ? jsb.fileUtils.getWritablePath() : "./";
        var fullHeadPath = storagePath + this._configResLocalPath;
        var fileExist = jsb.fileUtils.isFileExist(fullHeadPath + "ini.txt");

        if(fileExist)
        {
            var string = jsb.fileUtils.getValueMapFromFile(fullHeadPath + "ini.txt");
            this._configResList = JSON.parse(JSON.stringify(string["list"]));
            cc.log("本地列表已加载");
        }
        else
        {
            var ret = jsb.fileUtils.writeToFile({"list":[]}, fullHeadPath + "ini.txt");
            if(ret)
            {
                cc.log("本地创建列表");
            }
        }
    },

    getConfigTableResourcesPath : function()
    {
        return this._configResLocalPath;
    },

    //Step : 1
    /*如果不设置，默认使用 res/configs/referTables/ 文件夹
    **
    */
    setConfigTableResourcesPath : function(configPath)
    {
        if(configPath && 0 < configPath.length)
        {
            this._configResLocalPath = configPath;
        }
    },

    //Step : 2
    /*更新表
    **url 资源服务器地址 http://abc.com/tables/
    **completeBack, progressBack 未使用,改用
    **监听事件 ConfigTableUpdateLocalEvent.PROGRESS_PAIR 来查看进度
    **事件附带信息 1/10 2/10 ... 10/10
    **10/10 为结束标识
    */
    loadConfig : function(url)
    {
        this.loadConfigTableList();

        if(!url || 0 == url.length)
        {
            cc.error("输入的资源服务器地址错误，请核查!")
        }

        this._configURL = url;
        if(this._configResList)
        {
            EventMgr.inst().dispatchEvent(ConfigTableUpdateLocalEvent.PROGRESS_BEGIN);
            {
                ResMgr.inst().loadList("更新配置表", [],
                function(event, loadName)
                {
                    if(LoadEvent.LOAD_COMPLETE)
                    {
                        //读取配置
                        NetMgr.inst().sendHttp(this._configURL, null, false, this.checkConfig, this.checkConfigFail, this);
                    }
                },
                this);
            }
        }
    },

    //Step : 3
    /*获取本地配置表内容,原生服务器json格式
    **
    */
    getConfigTableData : function(name)
    {
        var storagePath = jsb.fileUtils ? jsb.fileUtils.getWritablePath() : "./";
        var fullHeadPath = storagePath + this._configResLocalPath;
        var fileExist = jsb.fileUtils.isFileExist(fullHeadPath + name);
        //cc.log("测试显示用￥￥￥￥￥￥￥￥￥￥￥");
        //cc.log(this._configResLocalPath);
        //cc.log(fullHeadPath);
        //cc.log(name);
        //cc.log("测试显示用￥￥￥￥￥￥￥￥￥￥￥");
        var string = null;
        if(fileExist)
        {
            string = jsb.fileUtils.getValueMapFromFile(fullHeadPath + name);
        }
        else
        {
            cc.error("该文件不存在:" + fullHeadPath + name);
        }

        return (null == string) ? "" : string["value"] ;
    },

    //Step : 4
    /*根据表名与键值查找该键值对应配置表一行数据,派克如果有双键，记得修改该方法
    **tableName : "abc" 不要加后缀.txt
    **key : 索引字段
    **返回一行
    */
    getConfigTableValueByKey : function(tableName, key)
    {
        return TabManager.getInstance().getDataByKey(tableName, key);
    },
    //整个表
    getConfigTableValueAll : function(tableName)
    {
        return TabManager.getInstance().getList(tableName);
    },
    /*内部使用
    **首次写入本地目录
    **data 已是合法JSON
    */
    createEmptyConfigTables : function(data)
    {
        var storagePath = jsb.fileUtils ? jsb.fileUtils.getWritablePath() : "./";
        var fullHeadPath = storagePath + this._configResLocalPath;
        var ret = jsb.fileUtils.createDirectory(fullHeadPath);

        var file = null;
        var filename = "";
        if(data)
        {
            for(var o in data)
            {
                filename = o.toString();
                file = jsb.fileUtils.writeToFile({"value":"空"}, fullHeadPath + "/" + filename + ".txt");
                if(file)
                {
                    cc.error("创建" + o + "成功");
                }
                else
                {
                    cc.error("创建" + o + "失败");
                }
            }
            return true;
        }
        else
        {
            return false;
        }
    },

    /*内部使用
    **
    */
    checkConfig : function(data, owner)
    {
        var serverObj = {};
        var objData = JSON.parse(data);

        if(!objData)
        {
            cc.error("获取服务器资源文件列表错误");
            return;
        }

        for(var key in objData)
        {
            serverObj[key] = objData[key];
        }

        //如果本地没有原始数据
        if(0 == owner._configResList.length)
        {
            if(owner.createEmptyConfigTables(objData))
            {
                cc.log("初始创建本地文件列表成功");
            }
            else
            {
                cc.error("初始创建本地文件列表失败");
            }
        }

        var cacheList = [];
        var objDatakeys = Object.keys(objData);
        for(var a = 0; a < objDatakeys.length; ++a)
        {
            var fileName = objDatakeys[a];
            var obj = owner.getConfigTableData(fileName + ".txt");

            if(serverObj[fileName] && serverObj[fileName] != hexMd5StringAsUtf8(obj))
            {
                owner._updateCount++;
                NetMgr.inst().sendHttp(owner._configURL + fileName, null, false, owner.updateConfig, owner.checkConfigFail, [owner, fileName]);
            }
            else
            {
                if(obj)
                {
                    TabManager.getInstance().setTab(fileName,JSON.parse(obj.toString()));
                }
                else
                {
                    cc.error("该表不存在:" + fileName);
                }
                cc.log("该表已存在");
                this._isExistAll++;
            }
            cacheList.push(owner._configResLocalPath + fileName + ".txt");
        }

        owner._maxProgress = owner._updateCount;
        var storagePath = jsb.fileUtils ? jsb.fileUtils.getWritablePath() : "./";
        var fullHeadPath = storagePath + owner._configResLocalPath;
        var ret = jsb.fileUtils.writeToFile({"list":cacheList}, fullHeadPath + "ini.txt");
        if(ret)
        {
            cc.log("本地列表更新成功");
            cacheList = null;
        }

        var configIniExist = jsb.fileUtils.isFileExist(fullHeadPath + "ini.txt");
        if(0 == owner._isExistAll && configIniExist)
        {
            cc.log("表没有变动");
            EventMgr.inst().dispatchEvent(ConfigTableUpdateLocalEvent.PROGRESS_END);
        }
    },

    /*内部使用
    **
    */
    updateConfig : function(data, param)
    {
        TabManager.getInstance().setTab(param[1], JSON.parse(data));
        var storagePath = jsb.fileUtils ? jsb.fileUtils.getWritablePath() : "./";
        var fullHeadPath = storagePath + param[0]._configResLocalPath;
        var ret = jsb.fileUtils.writeToFile({"value":data}, fullHeadPath + param[1] + ".txt");
        if(false == ret)
        {
            cc.error("表" + param[1] + "写入失败");
        }

        param[0]._updateCount--;
        var count = param[0]._maxProgress - param[0]._updateCount;
        var pair = count + "/" + param[0]._maxProgress;
        EventMgr.inst().dispatchEvent(ConfigTableUpdateLocalEvent.PROGRESS_PAIR, pair);

        //TODO:TEST
        //cc.error("pair:" + count + "/" + param[0]._maxProgress);

        if(param[0]._updateCount <= 0)
        {
            cc.log("配置表更新完毕");
            param[0]._updateConfigTablesTimer = setTimeout(function(){EventMgr.inst().dispatchEvent(ConfigTableUpdateLocalEvent.PROGRESS_END);}, 1500);

            //这是测试代码，用完记得注销
            //var configTable=ModuleMgr.inst().getData("ConfigTableUpdator").getConfigTableData("castle_buildingxy.txt");
            //cc.log(typeof(configTable)+"#$$$$$$$$$$$$$$table"+configTable);
        }
    },

    /*内部使用
    **
    */
    checkConfigFail : function(url, status)
    {
        ModuleMgr.inst().openModule("AlertPanel", {"txt":"读取游戏配置失败,请稍后再试:" + url, "type":2});
    },

    destroy : function()
    {
        this._super();

        this._configResLocalPath = null;
        this._configResList = null;
        this._updateCount = null;
        this._updateConfigTablesTimer = null;
        this._configURL = null;
        this._maxProgress = null;

        this._isExistAll = null;
    }
});
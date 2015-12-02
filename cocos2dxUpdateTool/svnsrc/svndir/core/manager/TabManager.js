/**
 * Created by zhouyulong on 2015/5/25.
 */
var TabManager = cc.Class.extend({

    _tabDic:null,

    ctor:function()
    {
        this._tabDic = {};
    },

    /**
     * 设置表数据
     * @tableName       表名
     * @data            数据
     */
    setTab:function(tableName,data)
    {
        this._tabDic[tableName] = this.parseTab(data);
    },

    /**
     * 解析表
     * @data            数据
     */
    parseTab:function(data)
    {
        var result = {};
        var list = [];
        for(var a = 1; a < data.length; a++)//第一个属性属性名称
        {
            var arr = data[a];
            var key = arr[0];
            var child = {};
            for(var b = 0; b < arr.length; b++)
            {
                child[data[0][b]] = arr[b];
            }

            result[key] = child;
            list.push(child);
        }

        result["list"] = list;
        return result;
    },

    /**
     * 通过key获取表数据
     * @tableName            表名
     * @key                  通常是第一个字段
     */
    getDataByKey:function(tableName,key)
    {
        var data = this._tabDic[tableName];
        if(data != null)
        {
           return data[key];
        }
        else
        {
            cc.error("此表未找到:" + tableName);
        }
    },

    /**
     * 获取整张表数据
     * @tableName            表名
     */
    getList:function(tableName)
    {
        var data = this._tabDic[tableName];
        if(data != null)
        {
           return data["list"];
        }
        else
        {
            cc.error("此表未找到:" + tableName);
        }
    },
});

TabManager.instance;
TabManager.getInstance = function()
{
    if(TabManager.instance == null)
    {
        TabManager.instance = new TabManager();
    }

    return TabManager.instance;
}


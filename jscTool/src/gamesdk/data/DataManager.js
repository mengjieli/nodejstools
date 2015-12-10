/**
 * 数据管理器
 * @constructor
 */
var DataManager = function () {
    if (DataManager.instance) {
        GameSDK.Error.throw("DataManager 已经初始化过了");
        return;
    }
    DataManager.instance = this;
    this.defines = {};
}

GameSDK.DataManager = DataManager;

DataManager.prototype.loadDataDefine = function (url) {
    console.log("[Add Data] " + url);
    var _this = this;
    cc.loader.loadJson(url, function (error, data) {
        if (error) {
            console.log("加载配置失败:" + url);
        } else {
            _this.addDataDefine(data);
        }
    });
}

/**
 * 添加数据定义
 * @param data 数据定义，参见 data.json 的数据结构
 */
DataManager.prototype.addDataDefine = function (data) {
    this.defines[data.name] = {
        data: data,
        class: null
    };
}

/**
 * 获取一个新的数据定义对象
 * @param defineName
 */
DataManager.prototype.getNewData = function (defineName) {
    if (!this.defines[defineName]) {
        GameSDK.Error.throw("not define data:" + defineName);
        return;
    }
    //如果数据定义类已经解析过
    if (this.defines[defineName].class) {
        return new this.defines[defineName].class();
    }
    var className = "$" + defineName;
    var classStruct = this.defines[defineName].data;
    var define = "";
    var defineProperties = "";
    var definePropertiesGet = "";
    var definePropertiesSet = "";
    define += "var " + className + " = function() {\n";
    define += "\tthis._parent = null;\n";
    define += "\tthis._parentAttribute = null;\n";
    for (var key in classStruct.members) {
        var struct = classStruct.members[key];
        defineProperties += "__define(" + className + ".prototype,\"" + key + "\"\n";
        defineProperties += "\t, function () {\n";
        definePropertiesGet = "";
        definePropertiesSet = "\t\tif(this._" + key + " == val) return;\n";
        switch (struct.type) {
            case "bool":
                define += "\tthis._" + key + "= 0;\n";
                definePropertiesGet += "\t\treturn this._" + key + ";\n";
                definePropertiesSet += "\t\tthis._" + key + " = !!val;\n";
                break;
            case "int":
                define += "\tthis._" + key + "= 0;\n";
                definePropertiesGet += "\t\treturn this._" + key + ";\n";
                definePropertiesSet += "\t\tthis._" + key + " = val;\n";
                break;
            case "number":
                define += "\tthis._" + key + "= 0;\n";
                definePropertiesGet += "\t\treturn this._" + key + ";\n";
                definePropertiesSet += "\t\tthis._" + key + " = val;\n";
                break;
            case "string":
                define += "\tthis._" + key + "= \"\";\n";
                definePropertiesGet += "\t\treturn this._" + key + ";\n";
                definePropertiesSet += "\t\tthis._" + key + " = val;\n";
                break;
            case "Array":
                define += "\tthis._" + key + "= new GameSDK.ArrayData();\n";
                definePropertiesGet += "\t\treturn this._" + key + ";\n";
                definePropertiesSet += "\t\tthis._" + key + " = val;\n";
                break;
            default :
                define += "\tthis._" + key + "= DataManager.getInstance().getNewData(\"" + struct.type + "\");\n";
                definePropertiesGet += "\t\treturn this._" + key + ";\n";
                definePropertiesSet += "\t\tthis._" + key + " = val;\n";
        }
        definePropertiesSet += "\t\tif (!this.$listeners || !this.$listeners." + key + ") this.call(GameSDK.Event.PROPERTY_CHANGE,\"" + key + "\");\n";
        definePropertiesSet += "\t\tif (this._parent) this._parent.propertyChange(this._parentAttribute);\n";
        defineProperties += definePropertiesGet;
        defineProperties += "\t}\n";
        defineProperties += "\t, function(val) {\n";
        defineProperties += definePropertiesSet;
        defineProperties += "\t}\n";
        defineProperties += ");\n";
        defineProperties += "\n";
    }
    define += "}\n\n";
    define += "global." + className + " = " + className + ";\n";
    define += "ListenerBase.registerClass(" + className + ");\n\n";
    define += defineProperties;
    define += className + ".prototype.setParent = function(parent,attributeName) {\n";
    define += "\tthis._parent = parent;\n";
    define += "\tthis._parentAttribute = attributeName;\n";
    define += "}\n\n";
    define += className + ".prototype.propertyChange = function(name) {\n";
    define += "\tthis.call(GameSDK.Event.PROPERTY_CHANGE,name);\n";
    define += "\tif (this._parent) this._parent.propertyChange(this._parentAttribute);\n";
    define += "}\n\n";
    //console.log(define);
    eval(define);
    this.defines[defineName].class = global[className];
    return new this.defines[defineName].class();
}

/**
 * 添加数据
 * @param name
 * @param defineName
 */
DataManager.prototype.addData = function (name, defineName) {
    this[name] = this.getNewData(defineName);
}

DataManager.instance = null;
DataManager.getInstance = function () {
    return DataManager.instance;
}

DataManager.init = function () {
    if (!DataManager.instance) {
        new DataManager();
    }
}
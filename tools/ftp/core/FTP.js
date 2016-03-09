var path = require('path');
var fs = require('fs');
var Client = require('ftp');
var Promise = require('bluebird');

/**
 * 初始化 ftp 客户端
 * @param host ip 地址
 * @param user 用户名
 * @param password 密码
 * @constructor
 */
global.FTP = function (host, user, password) {
    this.client = null;
    this.host = host;
    this.user = user;
    this.password = password;
    this.isconnect = false;
}

global.__define(global.FTP.prototype, "hasConnect"
    , function () {
        return this.isconnect;
    }
    , function (val) {
    }
);

global.FTP.prototype.connect = function (connectBack, thisObj, args) {
    if (!this.client) {
        this.client = new Client();
        var _this = this;
        this.client.on("ready", function () {
            _this.isconnect = true;
            if (connectBack) {
                connectBack.apply(thisObj, args);
            }
        });
    }
    this.client.connect({
        host: this.host,
        user: this.user,
        password: this.password
    });
}

global.FTP.prototype.uploadExist  = function (file, ftpurl, upload, thisObj) {
    if (!this.isconnect) {
        this.connect(this.uploadExist, this, arguments);
        return;
    }
    var _this = this;
    _this.isExist(ftpurl,function(bool){
        //console.log("bool>>>>>>>>"+bool);
        if(bool) {
            _this.del(ftpurl,function(){
                _this.upload(file,ftpurl,upload,thisObj);
            });
        }else{
            _this.upload(file,ftpurl,upload,thisObj);
        }
    });

}
/**
 * 上传文件
 * @param file 本地文件
 * @param ftpurl ftp 上的目录
 * @param complete 完成回调
 * @param thisObj 完成回调 this 指针
 */
global.FTP.prototype.upload = function (file, ftpurl, complete, thisObj) {
    if (!this.isconnect) {
        this.connect(this.upload, this, arguments);
        return;
    }
    var client = this.client;
    var _this = this;
    client.put(file, ftpurl, function (err) {
        _this.close();
        if (err) {
            console.log(err);
            throw err;
        } else {
            if (complete) {
                complete.apply(thisObj);
            }
        }
    });
}

global.FTP.prototype.del = function (ftpurl, complete, thisObj) {
    if (!this.isconnect) {
        this.connect(this.upload, this, arguments);
        return;
    }
    var client = this.client;
    var _this = this;
    client.delete(ftpurl, function (err) {
        _this.close();
        if (err) {
            console.log(err);
            throw err;
        } else {
            if (complete) {
                complete.apply(thisObj);
            }
        }
    });
}

global.FTP.prototype.list = function(ftpurl,complete,thisObj) {
    if (!this.isconnect) {
        this.connect(this.list, this, arguments);
        return;
    }
    var client = this.client;
    var _this = this;
    client.list(ftpurl, function (code,list) {
        complete.call(thisObj,list);
    });
}

global.FTP.prototype.mkdir = function(ftpurl,complete,thisObj) {
    if (!this.isconnect) {
        this.connect(this.isExist, this, arguments);
        return;
    }
    while(ftpurl.charAt(ftpurl.length-1) == "/") {
        ftpurl = ftpurl.slice(0,ftpurl.length-1);
    }
    var client = this.client;
    var _this = this;
    var urlArray = ftpurl.split("/");
    var url = "";
    var index = 0;
    var func = function(list){
        var find = false;
        for(var i = 0; i < list.length; i++) {
            if(list[i].name == urlArray[index]) {
                find = true;
                break;
            }
        }
        if(find == false) {
            client.mkdir();
            return;
        }
        url += urlArray[index];
        index++;
        if(index == urlArray.length) {
            complete.call(thisObj);
            return;
        }
        _this.list(url,func);
    };
    this.list(url,func);
}

global.FTP.prototype.isExist = function(ftpurl,complete,thisObj) {
    if (!this.isconnect) {
        this.connect(this.isExist, this, arguments);
        return;
    }
    while(ftpurl.charAt(ftpurl.length-1) == "/") {
        ftpurl = ftpurl.slice(0,ftpurl.length-1);
    }
    var client = this.client;
    var _this = this;
    var urlArray = ftpurl.split("/");
    var url = "";
    var index = 0;
    var func = function(list){
        var find = false;
        for(var i = 0; i < list.length; i++) {
            if(list[i].name == urlArray[index]) {
                find = true;
                break;
            }
        }
        if(find == false) {
            complete.call(thisObj,false);
            return false;
        }
        url += urlArray[index];
        index++;
        if(index == urlArray.length) {
            complete.call(thisObj,true);
            return true;
        }
        _this.list(url,func);
    };
    this.list(url,func);
}

global.FTP.prototype.printAPI = function () {
    if (!this.isconnect) {
        this.connect(this.printAPI, this, arguments);
        return;
    }
    var client = this.client;
    for (key in client) {
        console.log(key);
    }
}

global.FTP.prototype.close = function () {
    this.client.end();
    this.client = null;
    this.isconnect = false;
}
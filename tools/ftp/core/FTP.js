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

global.FTP.prototype.close = function () {
    this.client.end();
    this.client = null;
    this.isconnect = false;
}
/**
 * 用户配置
 * @type {
 *  name:"****",
 *  password:"****":,
 *  ip:"****"
 * }
 */
var users = [];

var Config = function () {

}

Config.initUsers = function (list) {
    users = [];
    for (var i = 0; i < list.length; i++) {
        var user = new User(list[i]);
        users.push(user);
    }
}

Config.start = function() {
    for(var i = 0; i < users.length; i++) {
        users[i].start();
    }
}

Config.getUser = function (name) {
    for (var i = 0; i < users.length; i++) {
        if (users[i].name == name) {
            return users[i];
        }
    }
    return null;
}

Config.cmds = {};

//总服务器的端口号
Config.socketPort = 16501;
//更新服务器的端口号从 16600 开始追加
Config.fileSocketPort = 16606;
//所有的客户端更新都从这里开始，子更新 http-server 的 port 从 17611 开始追加
Config.updateServerPort = 17610;

global.Config = Config;
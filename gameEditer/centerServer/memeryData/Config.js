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

Config.getUser = function (name) {
    for (var i = 0; i < users.length; i++) {
        if (users[i].name == name) {
            return users[i];
        }
    }
    return null;
}

Config.cmds = {};

//所有的客户端更新都从这里开始
Config.updateServerPort = 9800;

global.Config = Config;
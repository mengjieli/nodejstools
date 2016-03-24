/**
 更新服务器 httpServer
 **/

function UpdateServer(port) {
    var fork = require('child_process').fork;
    this.main = fork('./updateServer/CenterHttpServer.js', [port]);
    this.main.on('message', this.onReceiveMessageFromMain.bind(this));
    this.user = {};

    this.startClientHttpServer("limengjie",
        5553,
        "/Users/mengjieli/Documents/GameTools/gameEditer/centerServer/data/user/limengjie/update/",
        "::1");
}

UpdateServer.prototype.startHttpServer = function (user, ip, task) {
    if (!this.user[user]) {
        var port = UpdateServer.prototype.port++;
        this.user[user] = {"port": port, "gameIPs": []};
        this.startClientHttpServer(user, port, "./data/user/" + user + "/");
    }
    var ips = this.user[user].gameIPs;
    var find = false;
    for (var i = 0; i < ips.length; i++) {
        if (ips[i] == ip) {
            find = true;
        }
    }
    if (!find) {
        ips.push(ip);
        this.main.send({
            "type": "setTransIP",
            "ip": ip,
            "toServer": "localhost",
            "toPort": this.user[user].port,
            "task": task
        });
    } else {
        task.success();
    }
}

/**
 * 收到来自主 http 服务器进程的消息
 * @param msg
 */
UpdateServer.prototype.onReceiveMessageFromMain = function (msg) {
    if (msg.type == "setTransIPOK") {
        msg.task.success();
    }
}

/**
 * 启动一个对应用户的 http 服务器进程
 * @param user
 * @param port
 * @param dir
 */
UpdateServer.prototype.startClientHttpServer = function (user, port, dir) {
    this.user[user].push(fromIP);
    var fork = require('child_process').fork;
    var sub = fork('./updateServer/TransHttpServer.js', [port, dir]);
}

UpdateServer.prototype.port = 9810;


global.UpdateServer = UpdateServer;
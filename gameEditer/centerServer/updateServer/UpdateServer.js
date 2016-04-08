/**
 更新服务器 httpServer
 **/
var fork = require('child_process').fork;

function UpdateServer(port) {
    this.main = fork('./updateServer/CenterHttpServer.js', [port]);
    this.main.on('message', this.onReceiveMessageFromMain.bind(this));
    this.user = {};
    UpdateServer.prototype.port = this.port + 1;
    //this.startHttpServer("limengjie", "::1");
    //this.startHttpServer("limengjie", "::ffff:192.168.0.112");
}

UpdateServer.prototype.startHttpServer = function (user, ip, port, task) {
    if (!this.user[user]) {
        port = port || UpdateServer.prototype.port++;
        this.user[user] = {"port": port, "gameIPs": [], thread: null};
        var file = new File("./");
        this.user[user].thread = this.startClientHttpServer(user, port, "./data/user/" + user + "/update/");
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
        if (task) {
            task.success();
        }
    }
}

UpdateServer.prototype.hasUserHttpServer = function (user) {
    var thread = this.user[user];
}

UpdateServer.prototype.closeUserHttpServer = function (user) {
    var thread = this.user[user];
    if (thread) {
        thread.send({"type": "close"});
        delete this.user[user];
    }
}

/**
 * 收到来自主 http 服务器进程的消息
 * @param msg
 */
UpdateServer.prototype.onReceiveMessageFromMain = function (msg) {
    if (msg.type == "setTransIPOK") {
        if (msg.tastk) {
            msg.task.success();
        }
    }
}

/**
 * 启动一个对应用户的 http 服务器进程
 * @param user
 * @param port
 * @param dir
 */
UpdateServer.prototype.startClientHttpServer = function (user, port, dir) {
    console.log("Start http server ",port,dir);
    return fork('./updateServer/TransHttpServer.js', [port, dir]);
}

UpdateServer.prototype.port = 9810;


global.UpdateServer = UpdateServer;
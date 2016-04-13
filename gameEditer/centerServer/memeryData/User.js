var User = (function () {

    function User(cfg) {
        User.list.push(this);

        this.name = cfg.name;
        this.password = cfg.password;
        this.ip = cfg.ip;
        this.fileSyncServerConfig = cfg.fileSyncServer;
        this.httpServerConfig = cfg.httpServer;
        //本地客户端
        this.localClient = null;
        //flash 客户端
        this.flashClient = null;
        //游戏客户端
        this.gameClient = null;
        //在线编辑器客户端
        this.editerClient = null;
        //统计客户端
        this.statisticsClient = null;
        //gm 客户端
        this.gmClient = null;
        //同步文件服务器
        this.updateServer = {
            "thread": null, //进程
            "ip": null,
            "port": null,
            "ready": false
        };

        this.clients = {};

        //正在执行的任务
        this.tasks = [];
    }

    var d = __define, c = User;
    p = c.prototype;

    p.start = function () {
        if (this.fileSyncServerConfig && this.fileSyncServerConfig.start) {
            this.checkFileUpdateServer();
        }
        if (this.httpServerConfig) {
            Server.updateServer.startHttpServer(this.name, "", this.httpServerConfig.port || 0, null);
        }
    }

    p.getClientByType = function(type) {
        return this.clients[type];
    }

    /**
     * 验证用户登录信息
     * @param name
     * @param password
     * @param ip
     * @returns {boolean}
     */
    p.isvalid = function (name, password, ip, type) {
        if (name != this.name) return 1;
        if (password != this.password) return 2;
        if (this.ip == "*") return 0;
        if (this.ip != ip) return 3;
        return 0;
    }

    p.loginLocal = function (localClient) {
        if (this.localClient) return 7;
        this.localClient = localClient;
        localClient.addEventListener(Event.CLOSE, function () {
            this.localClient = null;
        }, this);
        return 0;
    }

    p.loginEditer = function (editerClient) {
        if (this.editerClient) return 7;
        this.editerClient = editerClient;
        editerClient.addEventListener(Event.CLOSE, function () {
            this.editerClient = null;
        }, this);
        return 0;
    }

    p.loginFlashClient = function (flashClient) {
        if (this.flashClient) return 7;
        this.flashClient = flashClient;
        flashClient.addEventListener(Event.CLOSE, function () {
            this.flashClient = null;
        }, this);
        return 0;
    }

    p.loginGameClient = function (gameClient) {
        if (this.gameClient) return 23;
        this.gameClient = gameClient;
        gameClient.localClient.addEventListener(Event.CLOSE, function () {
            var bytes = new VByteArray();
            bytes.writeUIntV(2009);
            bytes.writeUIntV(0); //remoteId
            bytes.writeUIntV(this.gameClient.id);
            this.notifyLinkClient(bytes);
            this.gameClient = null;
        }, this);
        return 0;
    }

    p.notifyLinkClient = function (bytes) {
        if (this.flashClient) {
            this.flashClient.sendData(bytes);
        }
    }

    p.addTask = function (task) {
        //console.log("start task",task.id);
        this.tasks.push(task);
    }

    p.delTask = function (taskId) {
        //console.log("complete task",taskId);
        for (var i = 0; i < this.tasks.length; i++) {
            if (this.tasks[i].id == taskId) {
                this.tasks.splice(i, 1);
                break;
            }
        }
    }

    p.excuteTask = function (taskId, msg) {
        var task;
        for (var i = 0; i < this.tasks.length; i++) {
            if (this.tasks[i].id == taskId) {
                task = this.tasks[i];
                break;
            }
        }
        if (task == null) return false;
        task.excute(msg);
        return true;
    }

    p.sendFileServerToFlash = function () {
        if (this.flashClient && this.updateServer.ready) {
            var msg = new VByteArray();
            msg.writeUIntV(2013);
            msg.writeUIntV(0);
            msg.writeUTFV(this.updateServer.ip);
            msg.writeUIntV(this.updateServer.port);
            this.flashClient.sendData(msg);
        }
    }

    p.checkFileUpdateServer = function () {
        var updateServer = this.updateServer;
        var thread = updateServer.thread;
        if (!thread) {
            var ip = "localhost";
            var port = this.fileSyncServerConfig && this.fileSyncServerConfig.port ? this.fileSyncServerConfig.port : Config.fileSocketPort++;
            updateServer.ip = ip;
            updateServer.port = port;
            var fork = require('child_process').fork;
            updateServer.thread = thread = fork('./fileSyncServer/FileSyncServer.js',
                [updateServer.port, "./data/user/" + this.name + "/update/", this.name, this.httpServerConfig ? this.httpServerConfig.port : Config.updateServerPort]);
            updateServer.ready = false;
            var _this = this;
            thread.on('message', function (msg) {
                if (msg.type == "start") {
                    updateServer.ready = true;
                    _this.sendFileServerToFlash();
                }
            });
            thread.on("exit", function () {
                updateServer.thread = null;
                updateServer.ready = false;
                _this.checkFileUpdateServer();
            });
        }
    }

    User.getUserByName = function (name) {
        var list = User.list;
        for (var i = 0, len = list.length; i < len; i++) {
            if (list[i].name == name) {
                return list[i];
            }
        }
        return null;
    }

    User.list = [];

    return User;
})();

global.User = User;
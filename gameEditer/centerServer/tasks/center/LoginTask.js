var LoginTask = (function (_super) {

    __extends(LoginTask, _super);

    function LoginTask(user, client, cmd, msg) {
        _super.call(this, user, client, cmd, msg);
    }

    var d = __define, c = LoginTask;
    var p = c.prototype;

    /**
     * 开始执行任务
     * @param cmd
     * @param msg
     */
    p.startTask = function (cmd, msg) {
        var type = msg.readUTFV();
        if (type == "local") {
            var name = msg.readUTFV();
            var password = msg.readUTFV();
            var ip = msg.readUTFV();
            var user = Config.getUser(name);
            if (!user) {
                this.fail(1);
            } else {
                var code = user.isvalid(name, password, ip);
                if (code == 0) {
                    code = user.loginLocal(this.client);
                    if(code == 0) {
                        this.client.hasLogin = true;
                        this.client.user = user;
                        this.success();
                    } else {
                        this.fail(code);
                    }
                } else {
                    this.fail(code);
                }
            }
        } else if (type == "editer") {
            var name = msg.readUTFV();
            var password = msg.readUTFV();
            var ip = msg.readUTFV();
            var user = Config.getUser(name);
            if (!user) {
                this.fail(1);
            } else {
                var code = user.isvalid(name, password, ip);
                if (code == 0) {
                    code = user.loginEditer(this.client);
                    if(code == 0) {
                        this.client.hasLogin = true;
                        this.client.user = user;
                        this.success();
                    } else {
                        this.fail(code);
                    }
                } else {
                    this.fail(code);
                }
            }
        } else if (type == "control") {
            var name = msg.readUTFV();
            var password = msg.readUTFV();
            if (name == "admin" && password == "duoduo520") {
                this.client.hasLogin = true;
                this.success();
            } else {
                this.fail(name != "admin"?1:2);
            }
        } else {
            this.fail(4);
        }
    }

    return LoginTask;

})(TaskBase);

global.LoginTask = LoginTask;
var LinkClient = (function (_super) {

    __extends(LinkClient, _super);

    function LinkClient(user, fromClient, cmd, msg) {
        _super.call(this, user, fromClient, cmd, msg);
    }

    var d = __define, c = LinkClient;
    var p = c.prototype;

    /**
     * 开始执行任务
     * @param cmd
     * @param msg
     */
    p.startTask = function (cmd, msg) {
        var name = msg.readUTFV();
        var user = User.getUserByName(name);
        if(user && user.flashClient) {
            this.client.user = user;
            var code = user.loginGameClient(this.client.gameClient);
            var bytes = new VByteArray();
            bytes.writeUIntV(2007);
            bytes.writeUIntV(0);
            bytes.writeUIntV(this.client.gameClient.id);
            bytes.writeUTFV(this.client.ip);
            user.notifyLinkClient(bytes);
        }
        this.success();
    }

    return LinkClient;

})(TaskBase);

global.LinkClient = LinkClient;
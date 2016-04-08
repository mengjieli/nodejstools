var GameClient = (function () {

    function GameClient(id, client, gameName,userName) {
        this.id = id;
        this.client = client;
        this.gameName = gameName;
        this.userName = userName;
        this.client.addEventListener(Event.CLOSE, this.onClientClose, this);

        console.log("new game client ", gameName, this.id);
        //var bytes = new VByteArray();
        //bytes.writeUIntV(501);
        //bytes.writeUIntV(this.id);
        //bytes.writeUIntV(this.cmd);
        //var url = msg.readUTFV();
        //bytes.writeUTFV(url);
        //this.user.localClient.sendData(bytes);
    }

    var d = __define, c = GameClient;
    p = c.prototype;

    global.__define(p, "localClient",
        function () {
            return this.client;
        },
        function (val) {
        }
    );

    p.onClientClose = function () {
        if(this.client == null) {
            return;
        }
        this.client = null;
        GameClient.removeClient(this);
    }

    p.sendData = function(data) {
        if(!this.client) {
            return false;
        }
        this.client.sendData(data);
        return true;
    }

    GameClient.id = 0;

    GameClient.clients = [];

    /**
     * 添加游戏客户端
     * @param client
     * @param gameName
     * @returns {GameClient}
     */
    GameClient.addClient = function (client, gameName,userName) {
        var client = new GameClient(GameClient.id++, client, gameName,userName);
        GameClient.clients.push(client);
        return client;
    }

    /**
     * 移除游戏客户端
     * @param gameClient
     */
    GameClient.removeClient = function (gameClient) {
        var list = GameClient.clients;
        for (var i = 0, len = list.length; i < len; i++) {
            if (list[i] == gameClient) {
                list.splice(i, 1);
                break;
            }
        }
    }

    GameClient.getClient = function(id) {
        var list = GameClient.clients;
        for (var i = 0, len = list.length; i < len; i++) {
            if(list[i].id == id) {
                return list[i];
            }
        }
        return null;
    }

    return GameClient;
})();

global.GameClient = GameClient;
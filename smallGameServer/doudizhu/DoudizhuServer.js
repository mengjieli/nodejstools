require("./../../tools/com/requirecom");
require("./../../tools/shell/requireshell");
require("./../../tools/ftp/requireftp");
require("./../../tools/net/requirenet");


require("./DoudizhuClient");

var Room = (function (_super) {
    __extends(Room, _super);

    function Room(players) {
        _super.call(this);
        this.players = players;
        this.id = Room.id++;
        //游戏是否已经开始
        this.startFlag = false;
        //所有玩家的牌
        this.cards = {};
        //底牌
        this.bcards = {};
    }

    var d = __define, c = Room;
    var p = c.prototype;

    p.start = function () {
        for (var i = 0; i < this.players.length; i++) {
            this.players[i].enterRoom(this);
            this.players[i].ready = 0;
            this.players[i].addEventListener("ready", this.onPlayerReady, this);
            this.players[i].addEventListener("sendCardComplete", this.onPlayerSendCardReady, this);
            this.players[i].addEventListener("callBottom", this.onPlayerCallBottom, this);
            this.players[i].addEventListener("showCard", this.showCard, this);
        }
        //进入桌内:1002
        //uint  tableId  桌子id
        //Array (数组的长度是一个uint，在最前面)
        //uint  id  玩家id
        //string  nick   玩家昵称
        //uint  score  玩家积分
        var msg = new VByteArray();
        msg.writeUIntV(1002);
        msg.writeUIntV(this.id);
        msg.writeUIntV(this.players.length);
        for (var i = 0; i < this.players.length; i++) {
            var player = this.players[i];
            msg.writeUIntV(player.id);
            msg.writeUTFV(player.nick);
            msg.writeIntV(player.score);
            msg.writeUIntV(player.ready);
        }
        this.sendAllPlayer(msg);
        console.log("send 1002");
    }

    p.sendAllPlayer = function (msg) {
        for (var i = 0; i < this.players.length; i++) {
            var player = this.players[i];
            player.sendData(new Buffer(msg.data));
        }
    }

    p.sendToPlayer = function (player, msg) {
        player.sendData(new Buffer(msg.data));
    }

    p.onPlayerReady = function (e) {
        var player = e.currentTarget;
        this.updatePlayer(player);
        for (var i = 0; i < this.players.length; i++) {
            var player = this.players[i];
            if (player.ready == 0) {
                return;
            }
        }
        this.startGame();
    }

    p.startGame = function () {
        //游戏开始
        this.startFlag = true;
        var msg = new VByteArray();
        msg.writeUIntV(1010);
        this.sendAllPlayer(msg);

        //所有玩家的牌
        this.cards = {};
        //底牌
        this.bcards = {};
        //开始发牌
        var cards = [];
        for (var i = 0; i < 54; i++) {
            cards[i] = i + 1;
        }
        //交换牌的顺序
        var count = 0;
        while (count < 10) {
            for (var i = 0; i < cards.length; i++) {
                var r = Math.floor(Math.random() * 54);
                var change = cards[r];
                cards[r] = cards[i];
                cards[i] = change;
            }
            count++;
        }
        //每个人开始分牌
        for (var i = 0; i < this.players.length; i++) {
            player = this.players[i];
            this.cards[player.id] = [];
            this.cards[player.id] = cards.slice(i * 17, (i + 1) * 17);
            var msg = new VByteArray();
            msg.writeUIntV(1012);
            msg.writeUIntV(this.cards[player.id].length);
            for (var c = 0; c < this.cards[player.id].length; c++) {
                msg.writeUIntV(this.cards[player.id][c]);
            }
            this.sendToPlayer(player, msg);
        }
        //底牌
        this.bcards = cards.slice(51, 54);
        this.sendCardReady = {};
        for (var i = 0; i < this.players.length; i++) {
            this.sendCardReady[this.players[i].id] = false;
        }
    }

    /**
     * 玩家发牌结束
     * @param e
     */
    p.onPlayerSendCardReady = function (e) {
        var player = e.currentTarget;
        console.log("ready:", player.id);
        this.sendCardReady[player.id] = true;
        for (var key in this.sendCardReady) {
            if (this.sendCardReady[key] == false) {
                console.log("not ready:", key);
                return;
            }
        }
        console.log("call bottom");
        //开始叫底牌
        this.startCallBottom();
    }

    //叫牌
    p.startCallBottom = function () {
        this.calls = this.players.concat();
        for (var i = 0; i < this.calls.length; i++) {
            var r = Math.floor(Math.random() * this.calls.length);
            var change = this.calls[r];
            this.calls[r] = this.calls[i];
            this.calls[i] = change;
        }
        this.callIndex = 0;
        this.callScore = 1;
        this.callPlayer = null;
        this.callNext();
    }

    //下一个玩家叫牌
    p.callNext = function () {
        var player = this.calls[this.callIndex];
        var msg = new VByteArray();
        msg.writeUIntV(1014);
        msg.writeUIntV(player.id);
        msg.writeUIntV(this.callScore);
        this.sendAllPlayer(msg);
        console.log("call card:", 1014, player.id);
    }

    //玩家叫底牌
    p.onPlayerCallBottom = function (e) {
        var player = e.currentTarget;
        if (player != this.calls[this.callIndex]) {
            return;
        }
        //通知谁抢地主多少分 1034
        //uint  id  玩家id
        //uint   score  抢的多少分(1分 2分 或 3分)
        var msg = new VByteArray();
        msg.writeUIntV(1034);
        msg.writeUIntV(player.id);
        msg.writeUIntV(e.data);
        this.sendAllPlayer(msg);
        if (e.data > this.callScore) {
            this.callScore = e.data;
        }
        this.callIndex++;
        console.log("call Index", this.callIndex);
        if (this.callScore == 3 || this.callIndex == this.calls.length) {
            this.callPlayer = player;
            this.callBottomComplete();
        } else {
            this.callScore++;
            this.callNext();
        }
    }

    p.callBottomComplete = function () {
        //如果没有人叫底牌则继续，否则重新发牌
        if (this.callPlayer) {
            //通知谁是地主:1016
            //uint  id  玩家id
            //Array
            //    uint  cardId  底牌的id
            var msg = new VByteArray();
            msg.writeUIntV(1016);
            msg.writeUIntV(this.callPlayer.id);
            msg.writeUIntV(this.bcards.length);
            for (var i = 0; i < this.bcards.length; i++) {
                msg.writeUIntV(this.bcards[i]);
            }
            this.sendAllPlayer(msg);
            for (var i = 0; i < this.players.length; i++) {
                if (this.players[i] == this.callPlayer) {
                    this.startIndex = i;
                    break;
                }
            }

            this.startTurn();
        } else {
            this.startGame();
        }
    }

    p.startTurn = function () {
        var player = this.players[this.startIndex];
        this.currentIndex = this.startIndex;
        //轮到谁出牌:1020
        //uint  id   玩家id
        //Array
        //    uint   cardId  上一个玩家出的什么牌
        var msg = new VByteArray();
        msg.writeUIntV(1020);
        msg.writeUIntV(player.id);
        msg.writeUIntV(0);
        this.sendAllPlayer(msg);
    }

    /**
     * 谁出了什么牌
     * @param e
     */
    p.showCard = function (e) {
        var cards = e.data;
        var player = e.currentTarget;
        //通知玩家出了什么牌:1021
        //uint  id  玩家id
        //Array
        //    uint   id   牌id
        var msg = new VByteArray();
        msg.writeUIntV(1041);
        msg.writeUIntV(player.id);
        msg.writeUIntV(cards.length);
        for (var i = 0; i < cards.length; i++) {
            msg.writeUIntV(cards[i]);
        }
        this.sendAllPlayer(msg);

        var playerCards = this.cards[player.id];
        while (cards.length) {
            var card = cards.pop();
            for (var i = 0; i < playerCards.length; i++) {
                if (playerCards[i] == card) {
                    playerCards.splice(i, 1);
                    break;
                }
            }
        }
        if (playerCards.length == 0) {
            //游戏结果:1028
            //Array
            //    uint   id  玩家id
            //    int   score   玩家得分
            var msg = new VByteArray();
            msg.writeUIntV(1028);
            msg.writeUIntV(this.players.length);
            for (var i = 0; i < this.players.length; i++) {
                msg.writeUIntV(this.players[i].id);
                if (this.players[i] == player) {
                    this.players[i].score += 3;
                } else {
                    this.players[i].score -= 3;
                }
                msg.writeIntV(this.players[i].score);
                this.updatePlayer(this.players[i]);
            }
            this.sendAllPlayer(msg);

        } else {
            this.nextPlayerTurn();
        }
    }

    p.nextPlayerTurn = function () {
        this.currentIndex++;
        if (this.currentIndex >= this.players.length) {
            this.currentIndex = 0;
        }
        var player = this.players[this.currentIndex];
        //轮到谁出牌:1020
        //uint  id   玩家id
        //Array
        //    uint   cardId  上一个玩家出的什么牌
        var msg = new VByteArray();
        msg.writeUIntV(1020);
        msg.writeUIntV(player.id);
        msg.writeUIntV(0);
        this.sendAllPlayer(msg);
        //trace("player turn:",player.id," index=",);
    }

    p.updatePlayer = function (player) {
        var msg = new VByteArray();
        msg.writeUIntV(1024);
        msg.writeUIntV(player.id);
        msg.writeIntV(player.score);
        msg.writeUIntV(player.ready);
        this.sendAllPlayer(msg);
    }

    Room.id = 1;

    return Room;

})(EventDispatcher);

var GameServer = (function (_super) {
    __extends(GameServer, _super);

    function GameServer() {
        _super.call(this, DoudizhuClient);

        this.id = 0;
        this.rooms = [];

        //setInterval(this.checkClient.bind(this), 30000);
    }

    var d = __define, c = GameServer;
    var p = c.prototype;

    p.connectClient = function (request) {
        var client = _super.prototype.connectClient.call(this, request);
        client.init(this, this.id++);
        var clients = this.clients;
        var count = 3;
        var players = [client];
        console.log("connect current client number:", client.id, clients.length);
        for (var i = 0; i < clients.length; i++) {
            if (clients[i] != client && clients[i].hasRoom() == false) {
                players.push(clients[i]);
                if (players.length == count) {
                    var room = new Room(players);
                    console.log("Player has 3,go to room!", room);
                    this.rooms.push(room);
                    room.start();
                    break;
                }
            }
        }
    }

    p.closeClient = function (event) {
        console.log("close !!!!", event);
        var client = _super.prototype.closeClient.call(this, event);
    }

    p.checkClient = function () {
        var clients = this.clients.concat();
        var time = (new Date()).getTime();
        for (var i = 0, len = clients.length; i < clients.length; i++) {
            clients[i].checkHeart(time);
        }
    }

    p.sendDataToAll = function (bytes) {
        for (var i = 0; i < this.clients.length; i++) {
            this.clients[i].sendData(bytes);
        }
    }

    return GameServer;

})(WebSocketServer);

var server = new GameServer();
server.start(16081);
console.log("start on 16081");
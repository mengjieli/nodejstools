/**
 *
 * @author
 *
 */
var GameNet = (function (_super) {
    __extends(GameNet, _super);
    function GameNet() {
        _super.call(this);
        this.connectFlag = false;
        this.backs = {};
        var sock = new egret.WebSocket();
        this.sock = sock;
        sock.addEventListener(egret.ProgressEvent.SOCKET_DATA, this.onReceiveMessage, this);
        sock.addEventListener(egret.Event.CONNECT, this.onSocketOpen, this);
        sock.addEventListener(egret.Event.CLOSE, this.onClose, this);
        sock.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onIOError, this);
    }
    var d = __define,c=GameNet;p=c.prototype;
    p.connect = function (ip, port) {
        this.sock.connect(ip, port);
    };
    p.onClose = function (e) {
        this.connectFlag = false;
        alert("与游戏服务器断开链接，请刷新页面");
    };
    p.onIOError = function (e) {
        alert("链接服务器错误");
    };
    p.onSocketOpen = function () {
        this.connectFlag = true;
        this.dispatchEventWith("connect");
        setInterval(function () {
            console.log("发送心跳包");
            var bytes = new VByteArray();
            bytes.writeByte(0);
            bytes.writeByte(0);
            bytes.writeByte(0);
            bytes.writeByte(0);
            GameNet.sendMessage(bytes);
        }, 10000);
    };
    p.sendMessage = function (vbytes) {
        if (!this.connectFlag)
            return;
        var bytes = new egret.ByteArray();
        vbytes.writeToByteArray(bytes);
        bytes.position = 0;
        this.sock.type = egret.WebSocket.TYPE_BINARY;
        this.sock.writeBytes(bytes, 0, bytes.length);
        console.log("发送消息：" + bytes.toString());
    };
    p.onReceiveMessage = function (e) {
        var bytes = new egret.ByteArray();
        this.sock.readBytes(bytes, 0, this.sock["bytesAvailable"]);
        bytes.position = 0;
        var vbytes = new VByteArray();
        vbytes.readFromByteArray(bytes);
        var cmd = vbytes.readUIntV();
        console.log("收到消息 cmd : " + cmd + " ,内容 ：" + vbytes.toString());
        if (cmd == 0) {
            var requestCmd = vbytes.readUIntV();
            var code = vbytes.readIntV();
            if (code > 10000) {
                alert(Language.getErrorTip(code));
                return;
            }
        }
        var bool = false;
        if (this.backs[cmd]) {
            var list = this.backs[cmd];
            for (var i = 0; i < list.length; i++) {
                list[i].back.apply(list[i].thisObj, [cmd, vbytes]);
                bool = true;
            }
        }
        if (!bool) {
            console.log("未解析的协议：" + cmd);
        }
    };
    p.registerBack = function (cmd, back, thisObj) {
        if (!this.backs[cmd]) {
            this.backs[cmd] = [];
        }
        this.backs[cmd].push({ back: back, thisObj: thisObj });
    };
    GameNet.getInstance = function () {
        if (!GameNet.ist) {
            GameNet.ist = new GameNet();
        }
        return GameNet.ist;
    };
    GameNet.connect = function (ip, port) {
        if (!GameNet.ist) {
            GameNet.ist = new GameNet();
        }
        GameNet.ist.connect(ip, port);
    };
    GameNet.sendMessage = function (vbytes) {
        if (!GameNet.ist) {
            GameNet.ist = new GameNet();
        }
        GameNet.ist.sendMessage(vbytes);
    };
    GameNet.registerBack = function (cmd, back, thisObj) {
        if (!GameNet.ist) {
            GameNet.ist = new GameNet();
        }
        GameNet.ist.registerBack(cmd, back, thisObj);
    };
    return GameNet;
})(egret.EventDispatcher);
egret.registerClass(GameNet,"GameNet");

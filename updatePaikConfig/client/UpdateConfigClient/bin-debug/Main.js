var Main = (function (_super) {
    __extends(Main, _super);
    function Main() {
        _super.apply(this, arguments);
    }
    var d = __define,c=Main;p=c.prototype;
    p.createChildren = function () {
        _super.prototype.createChildren.call(this);
        this.stage.scaleMode = egret.StageScaleMode.NO_SCALE;
        this.tip = new eui.Label();
        this.addChild(this.tip);
        this.tip.size = 20;
        this.tip.x = 10;
        this.tip.y = 10;
        this.tip.lineSpacing = 5;
        var theme = new eui.Theme("resource/default.thm.json", this.stage);
        RES.getResByUrl("resource/ip.txt", function (data) {
            var port = 6001;
            this.tip.text = "链接服务器... " + data + ":" + port;
            GameNet.getInstance().addEventListener("connect", this.onConnectServer, this);
            GameNet.connect(data, port);
            GameNet.registerBack(100, function (cmd, bytes) {
                var ip = bytes.readUTFV();
                this.tip.text = "正在从 " + ip + " 更新配置文件";
            }, this);
            GameNet.registerBack(101, function (cmd, bytes) {
                this.tip.text = "更新完毕，下载配置文件:\nhttp://" + data + ":7000/" + bytes.readUTFV() + "\n\n解压缩后上传到 svn 地址：\npaike_client/ParkerEmpire/res/configs/table/server/" + "\n\n游戏版本号更改在 svn 地址:\npaike_client/ParkerEmpire/res/configs/table/GameServer.txt";
            }, this);
        }, this);
    };
    p.onConnectServer = function (e) {
        this.tip.text = "已连上服务器";
        var btn = new eui.Button();
        this.addChild(btn);
        btn.label = "从内网更新配置";
        btn.x = 10;
        btn.y = 250;
        btn.addEventListener(egret.TouchEvent.TOUCH_TAP, function (e) {
            var bytes = new VByteArray();
            bytes.writeUIntV(100);
            bytes.writeUIntV(1);
            GameNet.sendMessage(bytes);
        }, null);
        var btn = new eui.Button();
        this.addChild(btn);
        btn.label = "从外网更新配置";
        btn.x = 200;
        btn.y = 250;
        btn.addEventListener(egret.TouchEvent.TOUCH_TAP, function (e) {
            var bytes = new VByteArray();
            bytes.writeUIntV(100);
            bytes.writeUIntV(2);
            GameNet.sendMessage(bytes);
        }, null);
    };
    p.onButtonClick = function (e) {
    };
    return Main;
})(eui.UILayer);
egret.registerClass(Main,"Main");

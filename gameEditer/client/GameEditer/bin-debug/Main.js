var Main = (function (_super) {
    __extends(Main, _super);
    function Main() {
        _super.apply(this, arguments);
    }
    var d = __define,c=Main;p=c.prototype;
    p.createChildren = function () {
        _super.prototype.createChildren.call(this);
        this.stage.scaleMode = egret.StageScaleMode.NO_SCALE;
        var theme = new eui.Theme("resource/default.thm.json", this.stage);
        Config.width = this.stage.stageWidth;
        Config.height = this.stage.stageHeight;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addToStage, this);
    };
    p.addToStage = function (e) {
        this.addChild(this.loading = new LoadingUI());
        var loading = new PreLoadingPanel();
        loading.addEventListener("complete", this.start, this);
    };
    p.start = function () {
        this.loading.parent.removeChild(this.loading);
        this.txt = new eui.Label();
        this.txt.text = "链接中服务器中...";
        this.addChild(this.txt);
        var _this = this;
        GameNet.getInstance().addEventListener("connect", function (e) {
            this.txt.text = "已连上服务器，启动资源服务器中...";
            var bytes = new VByteArray();
            bytes.writeUIntV(2);
            bytes.writeUIntV(Config.localResourceServerPort);
            bytes.writeUTFV(Config.workFile);
            GameNet.sendMessage(bytes);
        }, this);
        GameNet.registerBack(3, function (cmd, data) {
            var flag = data.readByte();
            var port = data.readUIntV();
            Config.localResourceServer += port;
            var dir = data.readUTFV();
            if (dir == Config.workFile) {
                if (flag == 0) {
                    this.txt.parent.removeChild(this.txt);
                    this.allReady();
                }
                else {
                    this.txt.text = "启动资源服务器失败";
                    ;
                }
            }
        }, this);
        GameNet.connect("localhost", 9500);
    };
    p.allReady = function () {
        var main = new MainPanel();
        this.addChild(main);
        this.addChild(new PopManager());
        main.start();
    };
    return Main;
})(eui.UILayer);
egret.registerClass(Main,"Main");

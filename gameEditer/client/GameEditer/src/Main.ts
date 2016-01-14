class Main extends eui.UILayer {

    private txt: eui.Label;
    private loading: LoadingUI;
    private content:egret.Sprite;
    
    protected createChildren(): void {
        super.createChildren();
        
        this.stage.scaleMode = egret.StageScaleMode.NO_SCALE;
        
        var theme = new eui.Theme("resource/default.thm.json", this.stage);
        
        Config.width = this.stage.stageWidth;
        Config.height = this.stage.stageHeight;
        
        this.addEventListener(egret.Event.ADDED_TO_STAGE,this.addToStage,this);
    }
    
    private addToStage(e:egret.Event):void {
        this.addChild(this.loading = new LoadingUI());
        var loading = new PreLoadingPanel();
        loading.addEventListener("complete",this.start,this);
    }
    
    private start(): void {
        this.loading.parent.removeChild(this.loading);

        this.addChild(this.content = new egret.Sprite());
        this.addChild(new PopManager());
        
        this.txt = new eui.Label();
        this.txt.text = "链接中服务器中...";
        this.addChild(this.txt);
        var _this = this;

        GameNet.getInstance().addEventListener("connect",function(e: egret.Event): void {
            this.txt.text = "已连上服务器，启动资源服务器中...";
            
            //登录
            var bytes = new VByteArray();
            bytes.writeUIntV(1);
            bytes.writeUTFV("editer");
            bytes.writeUTFV("limengjie");
            bytes.writeUTFV("limengjie");
            bytes.writeUTFV("*");
            GameNet.sendMessage(bytes);
        },this);
        
        GameNet.registerSuccessBack(1,function():void{
            var bytes = new VByteArray();
            bytes.writeUIntV(602);
            bytes.writeUIntV(Config.localResourceServerPort);
            GameNet.sendMessage(bytes);
        },this);
        
        GameNet.registerBack(603,function(cmd: number,data: VByteArray) {
            var flag = data.readBoolean();
            var port = data.readUIntV();
            Config.localResourceServer += port;
            if(flag) {
                this.txt.parent.removeChild(this.txt);
                this.allReady();
            } else {
                this.txt.text = "启动资源服务器失败";
            }
        },this);
        GameNet.connect("localhost",9500);
    }
    
    private allReady():void {
        var main = new MainPanel();
        this.content.addChild(main);
        main.start();
    }
}


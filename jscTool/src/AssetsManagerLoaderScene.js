var __failCount = 0;

var AssetsManagerLoaderScene = cc.Scene.extend({
    _am: null,
    _progress: null,
    _percent: 0,
    _percentByFile: 0,
    _listener: null,

    _preloadScene: null,
    _preloadPanel: null,
    _loadingBar: null,
    load: function () {
        if(pc) {
            console.log("热更新直接结束");
            this.loadGame();
            return;
        }
        this._preloadScene = ccs.load("res/loadingAndLogining/loadingUIPre.json").node;

        if (null == this._preloadScene) {
            cc.error("AssetsManagerLoaderScene失败");
            return;
        }

        this.addChild(this._preloadScene);

        this._preloadPanel = this._preloadScene.getChildByName("panel");
        var view = cc.view.getFrameSize();
        var visibleSize = cc.director.getVisibleSize();
        this._preloadScene.setContentSize(visibleSize);
        ccui.helper.doLayout(this._preloadScene);

        //字体
        var labelContainer = ["loading_text_up", "loading_text_down", "loading_tip", "waiting_tip_up", "waiting_tip_down"];
        for (var i = 0; i < labelContainer.length; ++i) {
            var child = ccui.helper.seekWidgetByName(this._preloadPanel, labelContainer[i]);
            child.ignoreContentAdaptWithSize(true);
            if ("loading_tip" == child.getName()) {
                child.y = 40;
            }
        }

        var bkgName = "bkg";
        var bkg = ccui.helper.seekWidgetByName(this._preloadPanel, bkgName);
        bkg.loadTexture("res/loadingAndLogining/loading_beijing.png", ccui.Widget.LOCAL_TEXTURE);

        //进度条重设
        var loadingBarName = "loading_bar";
        this._loadingBar = ccui.helper.seekWidgetByName(this._preloadPanel, loadingBarName);
        this._loadingBar.setPercent(0);

        //隐藏次要
        var hideContainer = ["loading_text_up", "loading_text_down", "waiting_tip_up", "waiting_tip_down", "beauty", "desk_left", "desk_mid", "desk_right", "logo"];
        for (var i = 0; i < hideContainer.length; ++i) {
            var child = ccui.helper.seekWidgetByName(this._preloadPanel, hideContainer[i]);
            if (child) child.setVisible(false);
        }

        this.run();
    },
    run: function () {
        if (!cc.sys.isNative) {
            this.loadGame();
            return;
        }

        var layer = new cc.Layer();
        this.layer = layer;
        this.addChild(layer);
        //this._progress = new cc.LabelTTF.create("0%", "Arial", 12);
        //this._progress.x = cc.winSize.width / 2;
        //this._progress.y = cc.winSize.height / 2 + 50;
        //this._progress.setColor({r: 255, g: 0, b: 0, a: 255});
        //layer.addChild(this._progress);


        // android: /data/data/com.huanle.magic/files/
        var storagePath = (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : "./");
        console.log("进入更新:" + storagePath);

        this._am = new jsb.AssetsManager("res/project.manifest", storagePath);
        this._am.retain();

        if (!this._am.getLocalManifest().isLoaded()) {
            console.log("Fail to update assets, step skipped.");
            this.error();
        }
        else {
            var that = this;
            var listener = new jsb.EventListenerAssetsManager(this._am, function (event) {
                switch (event.getEventCode()) {
                    case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                        console.log("No local manifest file found, skip assets update.");
                        that.error(null, jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST);
                        break;
                    case jsb.EventAssetsManager.UPDATE_PROGRESSION:
                        that._percent = event.getPercent();
                        that._percentByFile = event.getPercentByFile();
                        cc.log(that._percent + "%");
                        that._loadingBar.setPercent(that._percent);
                        var msg = event.getMessage();
                        if (msg) {
                            cc.log(msg);
                        }
                        break;
                    case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
                    case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                        console.log("Fail to download manifest file, update skipped.");
                        that.error(null, jsb.EventAssetsManager.ERROR_PARSE_MANIFEST);
                        break;
                    case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                    case jsb.EventAssetsManager.UPDATE_FINISHED:
                        console.log("Update finished.");
                        that.loadGame();
                        break;
                    case jsb.EventAssetsManager.UPDATE_FAILED:
                        console.log("Update failed. " + event.getMessage());

                        __failCount++;
                        if (__failCount < 5) {
                            that._am.downloadFailedAssets();
                        }
                        else {
                            console.log("Reach maximum fail count, exit update process");
                            __failCount = 0;
                            that.error(null, jsb.EventAssetsManager.UPDATE_FAILED);
                        }
                        break;
                    case jsb.EventAssetsManager.ERROR_UPDATING:
                        console.log("Asset update error: " + event.getAssetId() + ", " + event.getMessage());
                        that.error(null, jsb.EventAssetsManager.ERROR_UPDATING);
                        break;
                    case jsb.EventAssetsManager.ERROR_DECOMPRESS:
                        console.log("错误:" + event.getMessage());
                        that.error(null, jsb.EventAssetsManager.ERROR_DECOMPRESS);
                        break;
                    default:
                        break;
                }
            });

            cc.eventManager.addListener(listener, 1);
            this._am.update();
            cc.director.runScene(this);
        }

        this.schedule(this.updateProgress, 0.5);
    },
    loadGame: function () {
        console.log("加载js文件");
        var owner = this;
        cc.loader.loadJs(["src/files.js"], function (err) {
            if (err) {
                console.log("加载出错 files.js " + err);
            } else {
                console.log("重新加载js文件");
                var files = jsFiles;
                cc.loader.loadJs(files, function (err) {
                    if (err) {
                        cc.error("重新加载js文件出错");
                    }
                    else {
                        cc.log("游戏脚本加载完成");
                        owner.removeAllChildren();
                        owner.removeFromParent();
                        new Game();
                    }
                });
            }
        });
    },
    updateProgress: function (dt) {
        //this._progress.string = "" + this._percent;
    },
    start: function (event) {
        cc.error("热更新开始");
        this._am.update();
    },
    error: function (event, msg) {
        var code = (parseInt)(msg);
        if (code != (jsb.EventAssetsManager.UPDATE_FINISHED) &&
            code != (jsb.EventAssetsManager.ALREADY_UP_TO_DATE)) {
            cc.error("热更新失败,错误代码:" + msg);
            //派克的需求，看是否删除//
            var value = ResMgr.inst().getString("denglu_72");
            ModuleMgr.inst().openModule("AlertPanel", {"txt": value, "type": 2});
        }
        else {
            cc.error("热更新完成");
        }
    },
    onExit: function () {
        cc.error("热更新结束本地");
        if (this._listener) cc.eventManager.removeListener(this._listener);
        this._listener = null;
        if (this._am) this._am.release();
        this._am = null;
        this._progress = null;
        this._percent = null;
        this._percentByFile = null;
        this._preloadScene = null;
        this._preloadPanel = null;
        this._loadingBar = null;
        this._super();
    }
});
var flower;
(function (flower) {
    var CCSManager = (function () {
        function CCSManager() {
            if (flower.CCSManager.classLock == true) {
                flower.DebugInfo.debug("|创建CCStudioManager| 此类为单例模式，请访问CCStudioManager.getInstance()获取该类", flower.DebugInfo.ERROR);
                return;
            }
            this.list = new Array();
        }

        var d = __define, c = CCSManager;
        p = c.prototype;

        p.createUI = function (url) {
            var info = this.loadCCS(url);
            var myUrl = "";
            var urls = (url.split(".")[0]).split("/");
            for (var i = 0; i < urls.length - 1; i++) {
                myUrl += urls[i] + "/";
            }
            var panel = this.createPanel(info.content, myUrl);
            return panel;
        }

        /*p.loadCCS = function (url) {
            for (var i = 0; i < this.list.length; i++) {
                if (this.list[i].url == url) {
                    return this.list[i];
                }
            }
            flower.DebugInfo.debug("|读取ccs文件| " + url, flower.DebugInfo.TIP);
            var info = new flower.CCSFileInfo(url);
            this.list.push(info);
            return info;
        }*/

        p.delCCS = function (url) {
            for (var i = 0; i < this.list.length; i++) {
                if (this.list[i].url == url) {
                    this.list.splice(i, 1)[0].dispose();
                    flower.DebugInfo.debug("|删除ccs文件| " + url, flower.DebugInfo.TIP);
                    return;
                }
            }
            flower.DebugInfo.debug("|删除ccs文件| 未找到文件：" + url, flower.DebugInfo.TIP);
        }

        p.createPanel = function (cfg, myUrl) {
            var textures = cfg.textures;
            for (var i = 0; i < textures.length; i++) {
                flower.PlistManager.getInstance().addPlist(myUrl + textures[i]);
            }
            var widget = this.createWidgetObject(cfg.widgetTree, myUrl);
            return widget;
        }

        p.createWidgetObject = function (cfg, myUrl) {
            var widget;
            if (cfg.classname == "Panel") {
                var panel = flower.CCSPanel.create();
                widget = panel;
            }
            if (cfg.classname == "ImageView") {
                var image = flower.CCSImageView.create();
                widget = image;
            }
            if (cfg.classname == "Button") {
                var button = flower.CCSButton.create();
                widget = button;
            }
            if (cfg.classname == "CheckBox") {
                var checkBox = flower.CCSCheckBox.create();
                widget = checkBox;
            }
            if (cfg.classname == "Label") {
                var label = flower.CCSLabel.create();
                widget = label;
            }
            if (cfg.classname == "LabelAtlas") {
                var labelAtlas = flower.CCSLabelAtlas.create("", "", 0, 0, "");
                widget = labelAtlas;
            }
            if (cfg.classname == "TextField") {
                var input = flower.CCSInput.create(0, 0, 0, 0);
                widget = input;
            }
            if (widget == null) {
                cc.log("[底层Error] CCSGUIReader::createWidgetObject$ 没有解析的结构: " + cfg.classname);
                widget = flower.CCSPanel.create();
            }
            widget.setOptions(cfg.options, myUrl);
            var childs = cfg.children;
            for (var c = 0; c < childs.length; c++) {
                widget.addChild(this.createWidgetObject(childs[c], myUrl));
            }
            return widget;
        }

        CCSManager.classLock = true;
        CCSManager.ist;
        CCSManager.getInstance = function () {
            if (!CCSManager.ist) {
                CCSManager.classLock = false;
                CCSManager.ist = new CCSManager();
                CCSManager.classLock = true;
            }
            return CCSManager.ist;
        };

        return CCSManager;
    })();
    flower.CCSManager = CCSManager;
})(flower || (flower = {}));

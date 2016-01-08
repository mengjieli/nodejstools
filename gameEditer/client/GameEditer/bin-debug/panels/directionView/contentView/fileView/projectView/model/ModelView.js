/**
 *
 * @author
 *
 */
var ModelView = (function (_super) {
    __extends(ModelView, _super);
    function ModelView(file) {
        _super.call(this);
        this.initUI();
        this.file = file;
        if (this.file.hasLoad == false) {
            RES.getResByUrl(Config.getResourceURL(file.url), function (config) {
                var project = this.file.more;
                (new ProjectDirectionCommand(project)).updateFile(project.getData(file.url, LocalFileFormat.MODEL), config, LocalFileFormat.MODEL, file.url);
                this.file.hasLoad = true;
                this.dataReady();
            }, this, RES.ResourceItem.TYPE_JSON);
        }
        else {
            this.dataReady();
        }
    }
    var d = __define,c=ModelView;p=c.prototype;
    p.validateDisplayList = function () {
        _super.prototype.validateDisplayList.call(this);
        this.logicList.height = (this.height - 25) * 0.67;
        this.logicListBg.height = (this.height - 25) * 0.67 + 25;
        this.viewListBg.y = (this.height - 25) * 0.67 + 20;
        this.viewListBg.height = this.height - this.viewListBg.y - 25;
        this.viewListTitle.y = (this.height - 25) * 0.67 + 25;
        this.editer.width = this.width - 160;
    };
    p.initUI = function () {
        this.percentWidth = 100;
        this.percentHeight = 100;
        this.logicListBg = new WinBgImage(2);
        this.addChild(this.logicListBg);
        this.logicList = new eui.List();
        this.logicList.itemRenderer = ModelLogicItem;
        this.logicList.x = 5;
        this.logicList.y = 30;
        this.logicList.width = 200;
        this.addChild(this.logicList);
        this.logicList.addEventListener("selected", this.onSelectItem, this);
        this.addLogicBtn = new ImageButton(RES.getRes("addFloder"));
        this.addLogicBtn.x = 190;
        this.addLogicBtn.y = 5;
        this.addLogicBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.addLogic, this);
        this.addChild(this.addLogicBtn);
        this.logicListBg.width = 210;
        this.viewListBg = new WinBgImage(2);
        this.addChild(this.viewListBg);
        this.viewListBg.width = 210;
        var label = new eui.Label();
        label.size = 14;
        label.text = "模块逻辑、接口";
        label.textColor = 0xaaaaaa;
        this.addChild(label);
        label.y = 5;
        label.x = 5;
        label = new eui.Label();
        label.size = 14;
        label.text = "模块视图";
        label.textColor = 0xaaaaaa;
        this.addChild(label);
        label.y = 2;
        label.x = 5;
        this.viewListTitle = label;
        this.editer = new ModelEditer();
        this.editer.percentHeight = 100;
        this.editer.x = 209;
        this.addChild(this.editer);
    };
    p.addLogic = function (e) {
        PopManager.pop(new ModelAddLogicPanel(this.data), true, true);
    };
    p.onSelectItem = function (e) {
        this.editer.showLogic(this.logicList.selectedItem);
    };
    p.dataReady = function () {
        this.data = this.file.data;
        this.data.addEventListener(egret.Event.CHANGE, this.onChangeData, this);
        this.logicList.dataProvider = this.data.logics;
        if (this.logicList.dataProvider.length) {
            this.logicList.selectedIndex = 0;
        }
    };
    p.onChangeData = function () {
    };
    p.isExist = function (e) {
        if (e.file == this.file) {
            return true;
        }
        return false;
    };
    d(p, "name"
        ,function () {
            if (this.data) {
                return this.file.name + "    " + (this.data.isNew == false ? "*" : "") + "    ";
            }
            return this.file.name + "        ";
        }
    );
    return ModelView;
})(ConentPanelItemBase);
egret.registerClass(ModelView,"ModelView");

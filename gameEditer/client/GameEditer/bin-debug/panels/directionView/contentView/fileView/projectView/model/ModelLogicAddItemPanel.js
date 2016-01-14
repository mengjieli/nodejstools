/**
 *
 * @author
 *
 */
var ModelLogicAddItemPanel = (function (_super) {
    __extends(ModelLogicAddItemPanel, _super);
    function ModelLogicAddItemPanel(type, name, data, parentLogic) {
        _super.call(this, "", name, "确定", this.clickSure, this, "取消");
        this.type = type;
        this.data = data;
        this.parentLogic = parentLogic;
        if (type == LogicType.DEFINE) {
            this.define();
        }
        else if (type == LogicType.CALL_API) {
            this.callAPI();
        }
    }
    var d = __define,c=ModelLogicAddItemPanel;p=c.prototype;
    p.define = function () {
        this.width = 400;
        this.height = 300;
        var cp = new eui.Component();
        this.addChild(cp);
        var exml = "<e:Skin xmlns:e=\"http://ns.egret.com/eui\">\n                <e:Label x=\"20\" y=\"50\" text=\"名称\" size=\"14\" textColor=\"0\"/>\n                <e:Label id=\"nameTxt\" x=\"70\" y=\"50\" size=\"14\" textColor=\"0\" border=\"true\" borderColor=\"0\" width=\"150\" height=\"20\" type=\"input\" restrict=\"a-z A-Z 0-9\"/>\n                <e:Label x=\"20\" y=\"80\" text=\"描述\" size=\"14\" textColor=\"0\"/>\n                <e:Label id=\"descTxt\" x=\"70\" y=\"80\" size=\"14\" textColor=\"0\" border=\"true\" borderColor=\"0\" width=\"150\" height=\"20\" type=\"input\"/>\n                <e:Label x=\"20\" y=\"110\" text=\"类型\" size=\"14\" textColor=\"0\"/>\n                <e:Label x=\"20\" y=\"140\" text=\"初始值\" size=\"14\" textColor=\"0\"/>\n                <e:Label id=\"initTxt\" x=\"200\" y=\"140\" size=\"14\" textColor=\"0\" border=\"true\" borderColor=\"0\" width=\"150\" height=\"20\" type=\"input\"/>\n            </e:Skin>";
        cp.skinName = exml;
        var initType = new DropDownList(100, 60);
        initType.dataProvider = new eui.ArrayCollection([{ "label": "无初始值", "value": false }, { "label": "有初始值", "value": true }]);
        this.addChild(initType);
        initType.x = 70;
        initType.y = 140;
        cp.initTxt.visible = false;
        initType.addEventListener(egret.Event.CHANGE, function (e) {
            cp.initTxt.visible = initType.selectedItem.value;
        }, null);
        var type = new DropDownList(120, 200);
        type.dataProvider = DataConfig.typeDropDownData;
        this.addChild(type);
        type.x = 70;
        type.y = 110;
        type.addEventListener(egret.Event.CHANGE, function (e) {
            if (type.selectedItem.type == "Array") {
                typeValue.visible = true;
            }
            else {
                typeValue.visible = false;
            }
        }, null);
        var typeValue = new DropDownList(120, 200);
        typeValue.dataProvider = DataConfig.typeArrayDropDownData;
        this.addChild(typeValue);
        typeValue.x = 210;
        typeValue.y = 110;
        typeValue.visible = false;
        var data = this.data;
        var parentLogic = this.parentLogic;
        this.sureBack = function () {
            var logic = data.getNewLogic(this.type);
            logic.name = cp.nameTxt.text;
            logic.desc = cp.descTxt.text;
            logic.varType = new TypeInfo(type.selectedItem.type, typeValue.visible ? typeValue.selectedItem.type : null);
            logic.init = cp.initTxt.visible ? cp.initTxt.text : null;
            if (parentLogic) {
                parentLogic.next = logic.id;
            }
            data.addLogic(logic);
        };
    };
    p.callAPI = function () {
        this.width = 600;
        this.height = 500;
        var label = Label.create({
            "text": "API",
            "x": 20,
            "y": 50,
            "size": 14,
            "color": 0
        });
        this.addChild(label);
        var apis = new List();
        this.addChild(apis);
        apis.width = 300;
        apis.height = 350;
        apis.x = 20;
        apis.y = 80;
        var c = new eui.ArrayCollection();
        for (var i = 0; i < 25; i++)
            c.addItem({ "label": "main.load" });
        apis.dataProvider = c;
    };
    p.clickSure = function () {
        if (this.sureBack) {
            this.sureBack.call(this);
        }
    };
    return ModelLogicAddItemPanel;
})(AlertPanel);
egret.registerClass(ModelLogicAddItemPanel,"ModelLogicAddItemPanel");

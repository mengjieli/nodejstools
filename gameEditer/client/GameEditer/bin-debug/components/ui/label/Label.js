/**
 *
 * @author
 *
 */
var Label = (function (_super) {
    __extends(Label, _super);
    function Label() {
        _super.call(this);
        this.more = false;
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.click, this);
    }
    var d = __define,c=Label;p=c.prototype;
    p.click = function (e) {
        if (this.more) {
            var label = new eui.Label();
            label.textColor = 0xffffff;
            label.text = this._content;
            label.size = 20;
            var _this = this;
            PopManager.pop(label, true, true);
            var touch = function () {
                label.parent.removeChild(label);
                this.stage.removeEventListener(egret.TouchEvent.TOUCH_TAP, touch, this);
            };
            setTimeout(function () {
                _this.stage.addEventListener(egret.TouchEvent.TOUCH_TAP, touch, _this);
            }, 0);
        }
    };
    d(p, "content",undefined
        ,function (val) {
            if (val.length > this.maxChars) {
                this.text = val.slice(0, this.maxChars - 2) + "...";
                this._content = val;
                this.more = true;
            }
            else {
                this.text = val;
                this.more = false;
            }
        }
    );
    Label.create = function (params) {
        var label = new Label();
        for (var key in params) {
            if (key == "size") {
                label.size = params.size;
            }
            if (key == "color") {
                label.textColor = params.color;
            }
            if (key == "align") {
                label.textAlign = params.align;
            }
            if (key == "max") {
                label.maxChars = params.max;
            }
            if (key == "text") {
                label.content = params.text;
            }
            if (key == "x") {
                label.x = params.x;
            }
            if (key == "y") {
                label.y = params.y;
            }
            if (key == "width") {
                label.width = params.width;
            }
            if (key == "height") {
                label.height = params.height;
            }
        }
        return label;
    };
    Label.createInput = function (params) {
        var label = Label.create(params);
        label.type = egret.TextFieldType.INPUT;
        for (var key in params) {
            if (key == "border") {
                label.border = true;
                label.borderColor = params.border;
            }
            if (key == "backgroud") {
                label.background = true;
                label.backgroundColor = params.background;
            }
        }
        return label;
    };
    return Label;
})(eui.Label);
egret.registerClass(Label,"Label");

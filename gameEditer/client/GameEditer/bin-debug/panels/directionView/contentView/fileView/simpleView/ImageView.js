/**
 *
 * @author
 *
 */
var ConentPanelItemBase = (function (_super) {
    __extends(ConentPanelItemBase, _super);
    function ConentPanelItemBase() {
        _super.call(this);
    }
    var d = __define,c=ConentPanelItemBase;p=c.prototype;
    p.isExist = function (e) {
        return false;
    };
    return ConentPanelItemBase;
})(eui.Component);
egret.registerClass(ConentPanelItemBase,"ConentPanelItemBase");
/**
 *
 * @author
 *
 */
var ImageView = (function (_super) {
    __extends(ImageView, _super);
    function ImageView(file) {
        _super.call(this);
        this.file = file;
        var exml = "<e:Skin xmlns:e = \"http://ns.egret.com/eui\">\n                <e:Label id=\"infoTxt\" size=\"14\"/>\n            </e:Skin>";
        this.skinName = exml;
        this.percentWidth = this.percentHeight = 100;
        this.infoTxt.lineSpacing = 3;
        var imageLoader = new egret.ImageLoader();
        imageLoader.load(Config.localResourceServer + "/" + file.url);
        imageLoader.addEventListener(egret.Event.COMPLETE, this.onLoadImageComplete, this);
        //this.image.source = Config.localResourceServer + "/" + file.url;
    }
    var d = __define,c=ImageView;p=c.prototype;
    p.onLoadImageComplete = function (e) {
        var imageLoader = e.currentTarget;
        this.bitmap = new egret.Bitmap(imageLoader.data);
        this.bitmap.x = 0;
        this.addChild(this.bitmap);
        //        this.bitmap.x = (this.width - this.bitmap.width) / 2;
        //        this.bitmap.y = (this.height - this.bitmap.height) / 2;
        this.infoTxt.text = "图片信息: \n" + this.file.url;
        this.infoTxt.text += "\n宽: " + this.bitmap.width + "   高: " + this.bitmap.height;
        this.infoTxt.x = this.bitmap.width + 50;
    };
    p.isExist = function (e) {
        if (e.file == this.file) {
            return true;
        }
        return false;
    };
    d(p, "name"
        ,function () {
            return this.file.name + "        ";
        }
    );
    return ImageView;
})(ConentPanelItemBase);
egret.registerClass(ImageView,"ImageView");

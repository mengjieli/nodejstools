/**
 *
 * @author
 *
 */
var TextView = (function (_super) {
    __extends(TextView, _super);
    function TextView(file) {
        _super.call(this);
        this.file = file;
        this.percentWidth = this.percentHeight = 100;
        this.addChild(this.content = new eui.Label());
        this.content.size = 14;
        this.content.percentWidth = 100;
        this.content.wordWrap = true;
        this.content.multiline = true;
        RES.getResByUrl(Config.getResourceURL(this.file.url), this.onGetComplete, this, RES.ResourceItem.TYPE_TEXT);
        //        request.addEventListener(egret.IOErrorEvent.IO_ERROR,this.onGetIOError,this);
        //        request.addEventListener(egret.ProgressEvent.PROGRESS,this.onGetProgress,this);
    }
    var d = __define,c=TextView;p=c.prototype;
    p.onGetComplete = function (data) {
        this.content.text = data;
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
    return TextView;
})(ConentPanelItemBase);
egret.registerClass(TextView,"TextView");

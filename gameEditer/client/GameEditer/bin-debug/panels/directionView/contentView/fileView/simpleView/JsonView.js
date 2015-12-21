/**
 *
 * @author
 *
 */
var JsonView = (function (_super) {
    __extends(JsonView, _super);
    function JsonView(file) {
        _super.call(this);
        this.file = file;
        this.percentWidth = this.percentHeight = 100;
        this.addChild(this.content = new eui.Label());
        this.content.size = 14;
        this.content.percentWidth = 100;
        this.content.wordWrap = true;
        this.content.multiline = true;
        RES.getResByUrl(Config.localResourceServer + "/" + this.file.url, this.onGetComplete, this);
        //        request.addEventListener(egret.IOErrorEvent.IO_ERROR,this.onGetIOError,this);
        //        request.addEventListener(egret.ProgressEvent.PROGRESS,this.onGetProgress,this);
    }
    var d = __define,c=JsonView;p=c.prototype;
    p.onGetComplete = function (data) {
        this.content.text = JSON.stringify(data);
        /*var request = <egret.HttpRequest>event.currentTarget;
        console.log("get data : ",request.response);
        this.content.text = request.response;*/
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
    return JsonView;
})(ConentPanelItemBase);
egret.registerClass(JsonView,"JsonView");

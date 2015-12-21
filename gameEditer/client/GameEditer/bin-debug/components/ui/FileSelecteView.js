/**
 *
 * @author
 *
 */
var FileSelecteView = (function (_super) {
    __extends(FileSelecteView, _super);
    function FileSelecteView(path) {
        _super.call(this);
        this.title = "选择文件";
        this.width = 400;
        this.height = 600;
        this.directionData = new DirectionData(path);
        this.addChild(this.directionView = new DirectionView());
        this.directionView.y = 30;
        this.directionView.percentWidth = 100;
        this.directionView.dataProvider = this.directionData.data;
        var btn = new eui.Button();
        this.addChild(btn);
        btn.bottom = 0;
        btn.right = 0;
        btn.height = 30;
        btn.label = "确定";
        btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickSure, this);
        this.directionData.flush();
    }
    var d = __define,c=FileSelecteView;p=c.prototype;
    p.validateDisplayList = function () {
        _super.prototype.validateDisplayList.call(this);
        this.directionView.height = this.height - this.directionView.y - 30;
    };
    p.onClickSure = function (e) {
        var file = this.directionView.selectedItem;
        new AlertPanel("当前选择的文件：\n" + file.url, "标题啊", "嗯？", null, null, "哦！");
    };
    return FileSelecteView;
})(eui.Panel);
egret.registerClass(FileSelecteView,"FileSelecteView");

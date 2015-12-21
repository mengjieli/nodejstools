/**
 *
 * @author
 *
 */
var ProjectDirectionView = (function (_super) {
    __extends(ProjectDirectionView, _super);
    function ProjectDirectionView(direction) {
        _super.call(this, ProjectDirectionItem);
        this.data = new ProjectData();
        new LoadingView(this.data);
        this.data.loadConfig(direction);
        this.dataProvider = this.data.direction;
    }
    var d = __define,c=ProjectDirectionView;p=c.prototype;
    return ProjectDirectionView;
})(DirectionView);
egret.registerClass(ProjectDirectionView,"ProjectDirectionView");

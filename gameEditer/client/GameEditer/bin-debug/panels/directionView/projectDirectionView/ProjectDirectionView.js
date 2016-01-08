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
        this.dataProvider = this.data.direction;
        (new LoadProjectCommand(this.data, direction)).addEventListener(LoadingEvent.COMPLETE, function () {
            var file = this.data.getFile("model/GameLoading.json");
            if (file) {
                EditerData.getInstance().conteView.viewFile(file);
            }
        }, this);
    }
    var d = __define,c=ProjectDirectionView;p=c.prototype;
    return ProjectDirectionView;
})(DirectionView);
egret.registerClass(ProjectDirectionView,"ProjectDirectionView");

/**
 *
 * @author
 *
 */
var EditerData = (function () {
    function EditerData() {
        this.conteView = new ContentViewData();
        this.ui = new UIData();
        this.menu = new MenuData();
    }
    var d = __define,c=EditerData;p=c.prototype;
    EditerData.getInstance = function () {
        if (!EditerData.ist) {
            EditerData.ist = new EditerData();
        }
        return EditerData.ist;
    };
    return EditerData;
})();
egret.registerClass(EditerData,"EditerData");

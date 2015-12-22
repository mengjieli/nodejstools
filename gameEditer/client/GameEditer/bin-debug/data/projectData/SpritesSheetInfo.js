var SpritesSheetItem = (function () {
    function SpritesSheetItem(url, width, height, offX, offY, resourceWidth, resourceHeight, rot) {
        this.url = url;
        this.width = width;
        this.height = height;
        this.offX = offX;
        this.offY = offY;
        this.resourceWidth = resourceWidth;
        this.resourceHeight = resourceHeight;
        this.rot = rot;
    }
    var d = __define,c=SpritesSheetItem;p=c.prototype;
    return SpritesSheetItem;
})();
egret.registerClass(SpritesSheetItem,"SpritesSheetItem");
/**
 *
 * @author
 *
 */
var SpritesSheetInfo = (function (_super) {
    __extends(SpritesSheetInfo, _super);
    function SpritesSheetInfo(url, name, desc) {
        _super.call(this, url, name, desc);
        this.images = [];
    }
    var d = __define,c=SpritesSheetInfo;p=c.prototype;
    d(p, "fileContent"
        ,function () {
            var config = {
                "name": this.name,
                "desc": this.desc,
                "images": this.images
            };
            return JSON.stringify(config);
        }
    );
    return SpritesSheetInfo;
})(FileInfoBase);
egret.registerClass(SpritesSheetInfo,"SpritesSheetInfo");

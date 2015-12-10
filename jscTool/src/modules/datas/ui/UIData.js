function UIData() {
    this.showType = UIData.SHOW_CASTLE;
}

UIData.prototype.showMapComplete = function () {
    this.showType = UIData.SHOW_MAP;
    this.call(UIData.SHOW_MAP_COMPLETE);
}

UIData.prototype.showCastleComplete = function () {
    this.showType = UIData.SHOW_CASTLE;
    this.call(UIData.SHOW_CASTLE_COMPLETE);
}

ListenerBase.registerClass(UIData);

UIData.instance = null;
UIData.getInstance = function () {
    if (!UIData.instance) {
        UIData.instance = new UIData();
    }
    return UIData.instance;
}

UIData.SHOW_CASTLE = "show_castle";
UIData.SHOW_MAP = "show_map";

UIData.SHOW_MAP_COMPLETE = "show_map_complete";
UIData.SHOW_CASTLE_COMPLETE = "show_castle_complete";
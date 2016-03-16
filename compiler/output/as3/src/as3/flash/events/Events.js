/**
 * Created by mengj_000 on 2015/5/2.
 */
var as3;
(function (as3) {
    function cloneMouseEvent(e) {
        var res = new egret.TouchEvent();
        res.localX = e.localX;
        res.localY = e.localY;
        res.stageX = e.stageX;
        res.stageY = e.stageY;
        res.touchDown = e.touchDown;
        res.touchPointID = e.touchPointID;
        return res;
    }
    as3.cloneMouseEvent = cloneMouseEvent;
})(as3 || (as3 = {}));
//# sourceMappingURL=Events.js.map
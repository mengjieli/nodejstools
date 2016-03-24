/**
 * Created by mengj_000 on 2015/5/2.
 */

module as3
{
    export function cloneMouseEvent(e:egret.TouchEvent):egret.TouchEvent
    {
        var res:egret.TouchEvent = new egret.TouchEvent();
        res.localX = e.localX;
        res.localY = e.localY;
        res.stageX = e.stageX;
        res.stageY = e.stageY;
        res.touchDown = e.touchDown;
        res.touchPointID = e.touchPointID;
        return res;
    }
}
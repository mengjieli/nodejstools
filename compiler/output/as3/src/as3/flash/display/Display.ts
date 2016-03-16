/**
 * Created by mengj_000 on 2015/5/2.
 */

module as3 {
    export function getBounds(display:egret.DisplayObject, target?:egret.DisplayObject):egret.Rectangle {
        return display.getBounds(new egret.Rectangle(), true);
    }

    export function globalToLocal(display:egret.DisplayObject, point:egret.Point):egret.Point {
        return display.globalToLocal(point.x, point.y, point);
    }

    export function localToGlobal(display:egret.DisplayObject, point:egret.Point):egret.Point {
        return display.localToGlobal(point.x, point.y, point);
    }

    var addStageDragEvent:boolean = false;
    var drags:Array<any> = [];
    var dragStartX:number;
    var dragStartY:number;
    export function startDrag(display:egret.DisplayObject):void
    {
        if(!addStageDragEvent)
        {
            as3.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN,as3.onDragBegin,null);
            as3.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE,as3.onDragMove,null);
        }
        for(var i:number = 0; i < drags.length; i++)
        {
            if(drags[i][0] == display) return;
        }
        drags.push([display,display.x,display.y]);
    }

    export function stopDrag(display:egret.DisplayObject):void
    {
        for(var i:number = 0; i < drags.length; i++)
        {
            if(drags[i][0] == display)
            {
                drags.splice(i,1);
                break;
            }
        }
    }

    export function onDragBegin(e:egret.TouchEvent):void
    {
        for(var i:number = 0; i < drags.length; i++)
        {
            drags[i][1] = drags[i][0].x;
            drags[i][2] = drags[i][0].y;
        }
        dragStartX = e._stageX;
        dragStartY = e._stageY;
    }

    export function onDragMove(e:egret.TouchEvent):void
    {
        var moveX:number = e.stageX - dragStartX;
        var moveY:number = e.stageY - dragStartY;
        for(var i:number = 0; i < drags.length; i++)
        {
            drags[i][0].x = drags[i][1] + moveX;
            drags[i][0].y = drags[i][2] + moveY;
        }
    }
}
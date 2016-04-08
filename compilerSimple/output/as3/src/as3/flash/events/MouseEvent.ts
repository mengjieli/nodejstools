/**
 * Created by huitao on 2015/5/12.
 */
module as3
{
    export class MouseEvent extends egret.TouchEvent
    {
        /**不建议使用*/
        static DOUBLE_CLICK:string = "doubleClick";

        /**不建议使用*/
        static MOUSE_OVER:string = "mouseOver";

        /**不建议使用*/
        static MOUSE_WHEEL:string = "mouseWheel";

        /**不建议使用*/
        static ROLL_OUT:string = "rollOut";

        /**不建议使用*/
        static ROLL_OVER:string = "rollOver";

        constructor(type:string, bubbles:boolean = true, cancelable:boolean = true,
                    touchPointID:number = 0, stageX:number = 0, stageY:number = 0,
                    ctrlKey:boolean=false,altKey:boolean=false,shiftKey:boolean=false,touchDown:boolean=false) {
            super(type, bubbles, cancelable);
            this.touchPointID = touchPointID;
            this._stageX = stageX;
            this._stageY = stageY;
            this.ctrlKey = ctrlKey;
            this.altKey = altKey;
            this.touchDown = touchDown;
        }


    }
}

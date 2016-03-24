
/**
 * Created by huitao on 2015/5/8.
 */
module as3
{
    export class Stage extends egret.Stage
    {

        public align : string;
        public displayState : string;
        public focus:egret.DisplayObject;
        public frameRate : number;
        public mouseChildren : boolean;
        public numChildren : number;
        public quality : string;
        public scaleMode : string;
        public showDefaultContextMenu : boolean;
        public stageFocusRect : boolean;
        public stageHeight : number;
        public stageWidth : number;
        public tabChildren : boolean;
        public textSnapshot : egret.TextSnapshot;
        public width : number;
        public transform:Transform ;


        constructor()
        {
            super();
            addEventListener(as3.MouseEvent.MOUSE_OVER,this.movefun,false);
            this._localPoint = new egret.Point();
        }

        private movefun(e:as3.MouseEvent):void
        {

            this.loopMouse(this,e);
        }

        public addEventListener_as3(type: string, listener: Function, useCapture?: boolean, priority?: number,weak?:boolean): void
        {
            this.addEventListener(type,listener,null,useCapture,priority);
        }

        private _localPoint:egret.Point;
             /**
         * 循环设置 显示对象openMouse值为true 的显示对象 mouseX、mouseY值
         */
        private loopMouse(_dis:any,e:as3.MouseEvent):void
        {

            if(_dis instanceof as3.DisplayObjectContainer && _dis.openMouse)
            {
                var num:number = (<as3.DisplayObjectContainer> _dis).numChildren;

                for(var n:number = 0; n < num ;n ++)
                {
                   this.loopMouse(_dis.getChildIndex(n),e);
                }

            }
            else if(_dis instanceof as3.DisplayObject)
            {
                if(_dis.openMouse)
                {
                    this._localPoint.x = e.stageX;
                    this._localPoint.y = e.localY;
                    this._localPoint = globalToLocal(_dis,this._localPoint)

                    _dis.mouseX = this._localPoint.x;
                    _dis.mouseY = this._localPoint.y ;
                }

            }
        }

    }
}

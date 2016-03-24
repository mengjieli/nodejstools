/**
 * Created by huitao on 2015/5/12.
 */
module as3
{
    export class DisplayObjectContainer extends egret.DisplayObjectContainer
    {
        constructor()
        {
            super();
        }

        public addEventListener_as3(type: string, listener: Function, useCapture?: boolean, priority?: number,weak?:boolean): void
        {
            this.addEventListener(type,listener,null,useCapture,priority);
        }

    }
}
/**
 * Created by huitao on 2015/5/14.
 */
module as3
{
    export class EventDispatcher extends egret.EventDispatcher
    {
        constructor(target?: any)
        {
            super(target);
        }

        public addEventListener_as3(type: string, listener: Function, useCapture?: boolean, priority?: number,weak?:boolean): void
        {
            this.addEventListener(type,listener,null,useCapture,priority);
        }

    }
}

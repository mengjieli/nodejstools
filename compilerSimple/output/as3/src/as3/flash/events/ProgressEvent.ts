/**
 * Created by huitao on 2015/5/11.
 */
module as3
{
    export class ProgressEvent extends egret.ProgressEvent
    {
        constructor(type: string, bubbles?: boolean, cancelable?: boolean, bytesLoaded?: number, bytesTotal?: number)
        {
            super(type, bubbles, cancelable, bytesLoaded, bytesTotal);
        }
    }
}
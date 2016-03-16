/**
 * Created by huitao on 2015/5/11.
 */
module as3
{
    export class IOErrorEvent extends egret.IOErrorEvent
    {
        constructor(type: string, bubbles?: boolean, cancelable?: boolean)
        {
            super(type,bubbles,cancelable);
        }
    }

}

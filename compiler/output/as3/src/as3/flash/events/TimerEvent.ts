/**
 * Created by huitao on 2015/5/8.
 */
module as3
{
    export class TimerEvent extends egret.TimerEvent
    {


        constructor(type: string, bubbles: boolean, cancelable: boolean)
        {
            super(type,bubbles,cancelable);
        }

    }
}
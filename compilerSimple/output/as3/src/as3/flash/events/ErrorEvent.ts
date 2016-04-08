/**
 * Created by huitao on 2015/5/15.
 */
module as3
{
    export class Errorvent extends as3.Event
    {

        static ERROR : string= "error";

        constructor(type: string, bubbles: boolean = false, cancelable: boolean= false)
        {
            super(type,bubbles,cancelable);
        }

    }
}

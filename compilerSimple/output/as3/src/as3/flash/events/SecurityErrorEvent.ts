/**
 * Created by huitao on 2015/5/11.
 */
module as3
{
    export class SecurityErrorEvent extends egret.Event
    {
        static SECURITY_ERROR:string = "securityerror";

        constructor(type: string, bubbles?: boolean, cancelable?: boolean)
        {
            super(type,bubbles,cancelable);
        }
    }
}

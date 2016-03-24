/**
 * Created by huitao on 2015/5/8.
 */
module as3
{
    export class Event extends egret.Event
    {

        static CANCEL: string = "cancel";
        static FULLSCREEN: string = "fullScreen";
        static ID3: string = "id3";
        static INIT: string = "init";
        static MOUSE_LEAVE: string = "mouseLeave";
        static OPEN: string = "open";
        static SCROLL: string = "scroll";
        static SELECT: string = "select";
        static SOUND_COMPLETE: string = "soundComplete";
        static TAB_CHILDREN_CHANGE: string = "tabChildrenChange";
        static TAB_ENABLED_CHANGE: string = "tabEnabledChange";
        static TAB_INDEX_CHANGE: string = "tabIndexChange";
        static UNLOAD: string = "unload";

        private _bytesLoaded:number;
        private _totalLoaded:number;
        constructor(type: string, bubbles: boolean = false, cancelable: boolean= false)
        {
            super(type,bubbles,cancelable);
            egret.localStorage
        }



        public formatToString(cn:string,...arg):string
        {
            return cn + arg.toString();
        }

        public clone():Event
        {
            var temp:Event = new Event(this._type,this._bubbles,false);
            temp.data = this.data;
            return temp;
        }
    }
}

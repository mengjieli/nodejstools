/**
 * Created by huitao on 2015/5/11.
 */

module as3
{
    export class URLLoader extends egret.URLLoader
    {

        /**sorry  这个目前还不支持*/
        public bytesLoaded:number = 0 ;
        public bytesTotal:number = 0 ;

        constructor(req?:as3.URLRequest)
        {
            super(req);
        }

        /**
         * 没有实现
         */
        public close():void
        {

        }

        //public addEventListener_as3(type: string, listener: Function, useCapture?: boolean, priority?: number,weak?:boolean): void
        //{
        //    this.addEventListener(type,listener,null,useCapture,priority);
        //}

    }
}
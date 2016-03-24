/**
 * Created by huitao on 2015/5/9.
 */
module as3
{
    export class DisplayObject extends egret.DisplayObject {

        public accessibilityProperties:AccessibilityProperties;
        public filters:Array<any> = null;
        private _loaderInfo:LoaderInfo;


        public get loaderInfo():LoaderInfo
        {
            var info:as3.LoaderInfo = new as3.LoaderInfo();
            info.applicationDomain = new as3.ApplicationDomain();
            return this._loaderInfo;
        }

        /**手动设置无效 鼠标x*/
        public mouseX:number = 0 ;
        /**手动设置无效 鼠标y 通过stage 的move事件实现设置*/
        public mouseY:number = 0;

        public opaqueBackground:Object;

        private _root:egret.DisplayObject;

        public scale9Grid:egret.Rectangle;


        private _transform:Transform;

        /**是否计算 mouseX 、mouseY*/
        public openMouse:boolean = false;

        private _mmask:as3.DisplayObject;

        public get transform():Transform {
            return this._transform;
        }
        public set transform(_value:Transform)
        {
            this._transform = _value;
        }

        constructor()
        {
            super();
            this._transform = new as3.Transform();
            this._transform.owner = this;
            this._transform ._matrix = this.__hack_local_matrix;
        }
        public addEventListener_as3(type: string, listener: Function, useCapture?: boolean, priority?: number,weak?:boolean): void
        {
            this.addEventListener(type,listener,null,useCapture,priority);
        }



        public get mmask():as3.DisplayObject
        {
            return this._mmask;
        }

        public set mmask(val:as3.DisplayObject)
        {
            this._mmask = val;


        }


        private _selfMask:as3.DisplayObject;

        public getMask():as3.DisplayObject
        {
            return null;
        }

        public get root():as3.DisplayObject
        {
            return this;
        }

        //public get name():string
        //{
        //    return super.name;
        //}
        //
        //public set name(_value:string)
        //{
        //    super.name = _value;
        //}
    }
}

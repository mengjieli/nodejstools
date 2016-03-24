/**
 * Created by mengj_000 on 2015/4/27.
 */


module as3
{
    export class Bitmap extends egret.DisplayObjectContainer
    {
        private _bitmapData:as3.BitmapData;
        private _pixelSnapping:string;
        private _smoothing:boolean;

        public constructor(bitmapData?:as3.BitmapData,pixelSnapping?:string,smoothing?:boolean,preLoadingURL?:string)
        {
            super();
            if(bitmapData) this.bitmapData = bitmapData;
            this._pixelSnapping = pixelSnapping==undefined?"auto":pixelSnapping;
            this._smoothing = smoothing==undefined?false:smoothing;
            if(preLoadingURL != undefined)
            {
                this.bitmapData = LoadingUI.getEmbedBitmapData(preLoadingURL);
            }
        }


        public addEventListener_as3(type: string, listener: Function, useCapture?: boolean, priority?: number,weak?:boolean): void
        {
            this.addEventListener(type,listener,null,useCapture,priority);
        }

        /**
         * 设置位图数据
         * @param val
         */
        public set bitmapData(bitmapData:as3.BitmapData)
        {
            while(this.numChildren)
            {
                this.removeChildAt(0);
            }
            if(this._bitmapData)
            {
                this._bitmapData.removeEventListener(egret.Event.COMPLETE,this.updateByBitmapData,this);
                this._bitmapData = null;
            }
            if(bitmapData)
            {
                this._bitmapData = bitmapData;
                if(this._bitmapData._list.length) this.updateByBitmapData();
                this._bitmapData.addEventListener(egret.Event.COMPLETE,this.updateByBitmapData,this);
            }
            else
            {
                this._bitmapData = null;
            }
        }

        public get bitmapData():as3.BitmapData
        {
            return this._bitmapData;
        }

        public updateByBitmapData()
        {
            while(this.numChildren)
            {
                this.removeChildAt(0);
            }
            var list:Array<BitmapDataInfo> = this._bitmapData._list;
            if(list.length)
            {
                for(var i = 0; i < list.length; i++)
                {
                    this.addChild(list[i].getDisplay());
                }
            }
        }
    }
}
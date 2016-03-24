/**
 * Created by mengj_000 on 2015/4/27.
 */


module as3
{
    export class BitmapData extends egret.EventDispatcher
    {
        private _width:number;
        private _height:number;
        private _transparent:boolean;
        private _fillColor:number;
        private _lock:boolean = false;
        public _list:Array<BitmapDataInfo>;

        public get width():number
        {
            return this._width;
        }

        public get height():number
        {
            return this._height;
        }


        public constructor(width:number, height:number, transparent?:boolean, fillColor?:number,txt?:egret.Texture)
        {
            super();
            this.initWidthTexture(width,height,transparent,fillColor,txt);
        }

        public initWidthTexture(width:number, height:number, transparent?:boolean, fillColor?:number,txt?:egret.Texture)
        {
            this._width = width;
            this._height = height;
            this._transparent = transparent==undefined?true:transparent;
            this._fillColor = fillColor==undefined?0xffffffff:fillColor;
            if(txt)
            {
                var info:BitmapDataInfo = new BitmapDataInfo();
                info.texture = txt;
                info.tsx = 0;
                info.tsy = 0;
                info.tsw = txt._bitmapWidth;
                info.tsh = txt._bitmapHeight;
                this._list = [info];
            }
            else
            {
                this._list = [];
            }
        }

        public lock():void
        {
            this._lock = true;
        }

        public unlock(changeRect?:egret.Rectangle):void
        {
            this._lock = false;
        }

        public clone():as3.BitmapData
        {
            var bmd = new as3.BitmapData(this._width,this._height,this._transparent,this._fillColor);
            for(var i = 0; i < this._list.length; i++)
            {
                bmd._list.push(this._list[i].clone());
            }
            return bmd;
        }

        public addEventListener_as3(type: string, listener: Function, useCapture?: boolean, priority?: number,weak?:boolean): void
        {
            this.addEventListener(type,listener,null,useCapture,priority);
        }


        public copyPixels(sourceBitmapData:as3.BitmapData, sourceRect:egret.Rectangle, destPoint:egret.Point, alphaBitmapData?:BitmapData, alphaPoint?:egret.Point, mergeAlpha?:boolean):void
        {
            alphaBitmapData = alphaBitmapData==undefined?null:alphaBitmapData;
            alphaPoint = alphaPoint==undefined?null:alphaPoint;
            mergeAlpha = mergeAlpha==undefined?false:mergeAlpha;
            var txt:as3.BitmapDataInfo = sourceBitmapData._list[0];
            var copy:egret.Texture = new egret.Texture();
            copy._setBitmapData(txt.texture._bitmapData);
            var w:number = txt.tsw;
            var h:number = txt.tsh;
            if(sourceRect.x + sourceRect.width > w) w = w - sourceRect.x;
            if(destPoint.x + w > this.width) w = this.width - destPoint.x;
            w = w<0?0:w;
            h = h<0?0:h;
            if(sourceRect.y + sourceRect.height > h) h = h - sourceRect.y;
            if(destPoint.y + h > this.height) h = this.height - destPoint.y;
            w = w<0?0:w;
            h = h<0?0:h;
            copy._bitmapWidth = copy._textureWidth = w;
            copy._bitmapHeight = copy._textureHeight = h;
            copy._bitmapX = sourceRect.x + txt.tsx;
            copy._bitmapY = sourceRect.y + txt.tsy;
            console.log("w?",w,"h?",h,"x?",copy._bitmapX,"y?",copy._bitmapY);
            var item:as3.BitmapDataInfo = new as3.BitmapDataInfo();
            item.texture = copy;
            item.tsx = sourceRect.x + txt.tsx;
            item.tsy = sourceRect.y + txt.tsy;
            item.tsw = w;
            item.tsh = h;
            item.x = destPoint.x;
            item.y = destPoint.y;
            //如果发现copy了一张满屏的图则清掉之前所有的图，无论此图是否为透明的
            if(item.x <= 0 && item.y <= 0 && w >= this.width && h >= this.height)
            {
                this._list = [];
            }
            this._list.push(item);
            this.dispatchEvent(new egret.Event(egret.Event.COMPLETE));
        }
        //egret.Event.COMPLETE;
    }
}
/**
 * Created by mengj_000 on 2015/4/27.
 */


module as3
{
    export class BitmapDataInfo
    {
        public type:number = 1; //1表示图片 2表示文字

        public texture:egret.Texture;
        public tsx:number;
        public tsy:number;
        public tsw:number;
        public tsh:number;

        public text:string;

        public x:number = 0;
        public y:number = 0;
        public scaleX:number = 1;
        public scaleY:number = 1;
        public rotation:number = 0;
        public skewX:number = 0;
        public skewY:number = 0;

        public constructor()
        {
        }

        public getDisplay():egret.DisplayObject
        {
            if(this.type == 1)
            {
                return new egret.Bitmap(this.texture);
            }
            else
            {

            }
        }

        public clone():as3.BitmapDataInfo
        {
            var info:as3.BitmapDataInfo = new as3.BitmapDataInfo();
            info.type = this.type;
            info.texture = this.texture;
            info.tsx = this.tsx;
            info.tsy = this.tsy;
            info.tsw = this.tsw;
            info.tsh = this.tsh;
            info.text = this.text;
            info.x = this.x;
            info.y = this.y;
            info.scaleX = this.scaleX;
            info.scaleY = this.scaleY;
            info.rotation = this.rotation;
            info.skewX = this.scaleX;
            info.skewY = this.skewY;
            return info;
        }
    }
}
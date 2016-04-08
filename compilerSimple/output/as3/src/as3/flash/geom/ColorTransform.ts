/**
 * Created by huitao on 2015/5/9.
 */
module as3
{
    export class ColorTransform
    {
        public redMultiplier:number;

        public greenMultiplier:number;

        public blueMultiplier:number;

        public alphaMultiplier:number;

        public redOffset:number;

        public greenOffset:number;

        public blueOffset:number;

        public alphaOffset:number;


        constructor(redMultiplier:number=1, greenMultiplier:number=1, blueMultiplier:number=1, alphaMultiplier:number=1, redOffset:number=0, greenOffset:number=0, blueOffset:number=0, alphaOffset:number=0)
        {
            this.redMultiplier = redMultiplier;
            this.greenMultiplier = greenMultiplier;
            this.blueMultiplier = blueMultiplier;
            this.alphaMultiplier = alphaMultiplier;
            this.redOffset = redOffset;
            this.greenOffset = greenOffset;
            this.blueOffset = blueOffset;
            this.alphaOffset = alphaOffset;
        }

        public get color():number
        {
            //notImplemented("color");
            return 0;
        }

        public set color(newColor:number)
        {

            //notImplemented("color");
        }

        public concat(second:ColorTransform):void
        {

            //notImplemented("concat");
        }

        public toString():string
        {

            //notImplemented("toString");
            return "";
        }
    }
}
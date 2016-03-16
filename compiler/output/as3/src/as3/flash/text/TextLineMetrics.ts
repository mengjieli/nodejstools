/**
 * Created by huitao on 5/5/2015.
 */
module as3
{
    export class TextLineMetrics
    {
        public ascent : number;
        public descent : number;
        public height : number;
        public leading : number;
        public width : number;
        public x : number;

        constructor(x:number, width:number, height:number, ascent:number, descent:number, leading:number)
        {
            this.ascent = ascent;
            this.x = x;
            this.width = width;
            this.height = height;
            this.descent = descent;
            this.leading = leading;
        }
    }
}

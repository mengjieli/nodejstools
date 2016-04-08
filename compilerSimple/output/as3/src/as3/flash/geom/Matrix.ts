/**
 * Created by huitao on 2015/5/9.
 */
module as3
{
    export class Matrix extends egret.Matrix
    {

        public owner:as3.Transform;

        constructor(a:number=1, b:number=0, c:number=0, d:number=1, tx:number=0, ty:number=0)
        {
            super(a,b,c,d,tx,ty);
        }


        /**
         * 返回一个新的 Matrix 对象，它是此矩阵的克隆，带有与所含对象完全相同的副本。
         * @returns {as3.Matrix}
         */
        public clone():Matrix
        {
            return new Matrix(this.a,this.b,this.c,this.d,this.tx,this.ty);
        }


        public set tx(val:number)
        {
            //this.tx = val;
            if((this.owner != undefined && this.owner != null) && (this.owner.owner != undefined && this.owner.owner != null))
            {
                this.owner.owner.x = this.tx;
            }
        }

        public set ty(val:number)
        {
            //this.ty = val;
            if((this.owner != undefined && this.owner != null) && (this.owner.owner != undefined && this.owner.owner != null))
            {
                this.owner.owner.y = this.ty;
            }
        }

        public rotate(angle: number):any
        {
            //super.rotate(angle);

            if((this.owner != undefined && this.owner != null) && (this.owner.owner != undefined && this.owner.owner != null))
            {
                this.owner.owner.rotation = angle;
                this.owner.owner.x += this.tx;
                this.owner.owner.y += this.ty;
            }
            return this;
        }

        public scale(sx:number, sy:number):any
        {
            //super.scale(sx,sy);
            if((this.owner != undefined && this.owner != null) && (this.owner.owner != undefined && this.owner.owner != null))
            {
                this.owner.owner.scaleX = sx;
                this.owner.owner.scaleY = sy;
            }
        }

        public translate(dx:number, dy:number):any
        {
            super.translate(dx,dy);

        }

        public invert():any
        {
            super.invert();
        }


        public concat(m:Matrix):void
        {

        }

        public createBox(scaleX:number, scaleY:number, rotation:number = 0, tx:number = 0, ty:number = 0):void
        {

        }
        public createGradientBox(width:number, height:number, rotation:number = 0, tx:number = 0, ty:number = 0):void
        {

        }
        public deltaTransformPoint(point:egret.Point):egret.Point
        {

            return null;
        }


        public transformPoint(point:egret.Point):egret.Point
        {
            return null;
        }


        public toString():string
        {
            return this.a+","+this.b+","+this.c+","+this.d+","+this.tx+","+this.ty;
        }




    }
}

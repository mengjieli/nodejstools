/**
 * Created by mengj_000 on 2015/5/1.
 */

module as3
{
    export function equalsRectangle(rect1:egret.Rectangle,rect2:egret.Rectangle):boolean
    {
        if(rect1.x == rect2.x && rect1.y == rect2.y && rect1.width == rect2.width && rect1.height == rect2.height) return true;
        return false;
    }

    export function cloneMatrix(matrix:egret.Matrix):egret.Matrix
    {
        var mt:egret.Matrix = new egret.Matrix();
        mt.a = matrix.a;
        mt.b = matrix.b;
        mt.c = matrix.c;
        mt.d = matrix.d;
        mt.tx = matrix.tx;
        mt.ty = matrix.ty;
        return mt;
    }

    export function concatMatrix(source:egret.Matrix,mt:egret.Matrix):egret.Matrix
    {
        return source.append(mt.a,mt.b,mt.c,mt.d,mt.tx,mt.ty);
    }

    export function identityMatrix(matrix:egret.Matrix):void
    {
        matrix.a = matrix.d = 1;
        matrix.b = matrix.c = matrix.tx = matrix.ty = 0;
    }
}
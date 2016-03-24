/**
 * Created by huitao on 2015/5/9.
 */
module as3
{
    export class Transform
    {
        /**一个 ColorTransform 对象，其中包含整体调整显示对象颜色的值。 Transform*/
        public colorTransform : ColorTransform;

        public owner:any;

        /**[read-only] 一个 ColorTransform 对象，表示应用于此显示对象及其所有父级对象的组合颜色转换，回到根级别。  Transform*/
        private _concatenatedColorTransform : ColorTransform
        public get concatenatedColorTransform():ColorTransform
        {
            return this._concatenatedColorTransform;
        }

        /**[read-only] 一个 Matrix 对象，表示此显示对象及其所有父级对象的组合转换矩阵，回到根级别。  Transform*/
        private _concatenatedMatrix : Matrix;
        public get concatenatedMatrix():Matrix
        {
            return this._concatenatedMatrix;
        }

        /**一个 Matrix 对象，其中包含影响显示对象的缩放、旋转和平移的值。 Transform*/
        public _matrix : Matrix;
        public get matrix():Matrix
        {
            return this._matrix;
        }

        public set matrix(_val:Matrix)
        {
            this._matrix = _val;
            this._matrix.owner = this;

            if(this.owner != null && this.owner != undefined)
            {
                this.owner.x += _val.tx;
                this.owner.y += _val.ty;
            }
        }

        /**[read-only] 一个 Rectangle 对象，定义舞台上显示对象的边界矩形。*/
        private _pixelBounds : egret.Rectangle;

        public get pixelBounds():egret.Rectangle
        {
            return this._pixelBounds;
        }

        constructor()
        {
            this.matrix = new as3.Matrix();
            this.matrix.owner = this;
        }
    }
}

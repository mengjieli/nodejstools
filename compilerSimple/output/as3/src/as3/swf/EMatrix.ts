
module egret {

	export class EMatrix{
		public constructor(matrix:Matrix = null){
			this.CopyFromMatrix(matrix);
		}

		public CopyFromMatrix(matrix:Matrix = null):void{
			if(null != matrix){
				this.scaleX = matrix.a;
				this.rotateSkew0 = matrix.b;
				this.rotateSkew1 = matrix.c;
				this.scaleY = matrix.d;
				this.tx = matrix.tx;
				this.ty = matrix.ty;
			}
		}
		
		public tx:number = 0;//matrix.tx
		public ty:number = 0;//matrix.ty
		/**
		 * a
		 */		
		public scaleX:number = 1;//matrix.a
		/**
		 * b
		 */		
		public rotateSkew0:number = 0;//matrix.b
		/**
		 * c
		 */		
		public rotateSkew1:number = 0;//matrix.c
		/**
		 * d
		 */		
		public scaleY:number = 1;//matrix.d
	}
}
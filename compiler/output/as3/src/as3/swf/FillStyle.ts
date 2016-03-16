
module egret {

	export class FillStyle extends TransformInfo{
		public bitmapId:number = 0;
		
		public constructor(obj:any=null){
			super();
			this.createFromObject(obj);
		}
		
		public toString():string{
			return JSON.stringify(this);
		}
	}
}
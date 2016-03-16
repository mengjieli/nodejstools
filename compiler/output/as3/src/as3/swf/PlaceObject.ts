
module egret {

	export class PlaceObject extends TransformInfo{
		public id:number = 0;
		
		public depth:number = 0;
		/**
		 * 实例名
		 */		
		public instanceName:string = "";
		/**
		 * 最先出现在哪一帧
		 */		
		public fristframe:number = 0;
		
		//public var colorTransform:ColorTransform;// 暂不支持
		
		public constructor(obj:any = null){
			super();
			this.createFromObject(obj);
		}
		
	}
}
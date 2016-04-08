
module egret {

	export class DefineImage extends DefineBase{
		public w:number = 0;
		
		public h:number = 0;
		
		public constructor(obj:any = null){
			super();
			this.createFromObject(obj);
			this.t = Config.RESImage;
		}
	}
}

module egret {

	export class DefineStage extends DefineSprite{
		public constructor(obj:any = null){
			super();
			this.createFromObject(obj);
			
			this.t = Config.RESStage;
		}
	}
}
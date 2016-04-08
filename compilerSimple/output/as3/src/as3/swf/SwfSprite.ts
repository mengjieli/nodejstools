
module egret {

	export class SwfSprite extends egret.Sprite{

		public conf:egret.Resconfig = null;// 配置的引用
		public symbolName:string = "";


		/**
		 * 对应的资源定义id
		 */		
		public ID:number = 0;
		/**
		 * 
		 */		
		public extendinfo:any = null;
		/**
		 * 实例名
		 */		
		private _instanceName:string = "";
		public get instanceName():string
		{
			return this._instanceName;
		}
		public set instanceName(value:string)
		{
			this.name = value;
			this._instanceName = value;
		}
		//子对象列表直接在保存在动态属性中
		//public var childrenDic:Object = {};
		
		public constructor(){
			super();
		}
		
	}
}

module egret {

	export class SwfImage extends DisplayObjectContainer{

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
		
		public conf:egret.Resconfig = null;// 配置的引用
		public symbolName:string = "";

		public constructor(conf:egret.Resconfig, symbolName:string = ""){
			super();
			this.conf = conf;
			this.symbolName = symbolName;
			
			this.init();
		}

		private init():void{
			if(null == this.conf.symbols[this.symbolName]){
				console.warn("symbolName is null!");
				return;
			}
			var symbol:SymbolClass = <SymbolClass> (this.conf.symbols[this.symbolName]);
			var def:DefineImage = <DefineImage> (this.conf.resDefs[symbol.id]);
			var imgDis:SwfSprite = SwfRes.Pool_getByID(this.conf.path, this.conf, def.id);
			this.addChild(imgDis);
		}
		
	}
}

module egret {

	export class Resconfig{
		/**
		 * 资源全路径
		 */		
		public path:string = "";//"C:/Users/chenpeng/Documents/e/helloworld/resource/swfres/testres/testpos/file1/"
		/**
		 * 相对路径
		 */		
		public relativeDir:string = "";//swfres/testres/testpos/file1/
		// relativeDir转换来的相对路径字符串
		public resNamePrefix:string = "";//swfres_testres_testpos_file1_
		// 资源包路径
		public resModule:string = ""//swfres.testres.testpos.file1.
		/**
		 * 舞台的所有对象
		 */		
		//public var stage:DefineStage = new DefineStage();
		/**
		 * 所有对象的定义
		 */		
		public resDefs:any = {};
		/**
		 * 所有的链接类定义
		 */		
		public symbols:any = {};
		
		public constructor(obj:any = null){
			this.createFromObject(obj);
		}
		
		/**
		 * 需要从Object对象反序列化到Resconfig对象
		 * @param target
		 * 
		 */		
		public createFromObject(target:any):void{
			if(null == target){
				return;
			}
			for(var key in target){
				if("symbols" == key){
					var temp_symbols:any = target[key];
					for (var symbol_key in temp_symbols){
						var newSymbol:SymbolClass = new SymbolClass(temp_symbols[symbol_key]);
						this.symbols[symbol_key] = newSymbol;
					}
				}
				else if("resDefs" == key){
					var new_resdef:any = {};
					var temp_resdef:any = target[key];
					for (var tagid = 0 in temp_resdef){
						var tagobj:any = temp_resdef[tagid];
						switch(tagobj.t){
							case Config.RESImage:
								var img:DefineImage = new DefineImage(tagobj);
								new_resdef[tagid] = img;
								break;
							case Config.RESShape:
								var shape:DefineShape = new DefineShape(tagobj);
								new_resdef[tagid] = shape;
								break;
							case Config.RESSprite:
								var sprite:DefineSprite = new DefineSprite(tagobj);
								new_resdef[tagid] = sprite;
								break;
							case Config.RESStage:
								var stage:DefineStage = new DefineStage(tagobj);
								new_resdef[tagid] = stage;
								break;
							case Config.RESText:
								var text:DefineText = new DefineText(tagobj);
								new_resdef[tagid] = text;
								break;
							case Config.RESFont:
								var font:DefineFont = new DefineFont(tagobj);
								new_resdef[tagid] = font;
								break;
							default:
								//Log.warning("数据反序列化，未处理的类型：" + tagobj.t);
								break;
							
						}
					}
					this.resDefs = new_resdef;
				}
				else{
					this[key] = target[key];
				}
			}
		}
		
	}
}
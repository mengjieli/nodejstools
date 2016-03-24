
module egret {

	export class SwfResPool{
		/**
		 * 资源的配置文件
		 */		
		private resconf:Resconfig = null;
		/**
		 * poolname标识本资源池
		 */		
		private poolname:string = "";
		
		public constructor(_poolname:string, _resconf:Resconfig){
			this.poolname = _poolname;
			this.resconf = _resconf;
		}
		
		// 资源池，防止过多创建资源，提升性能。防止频繁移除显示对象再创建导致闪烁
		private loadedResPool:any = {};// 已加载资源的池 Vector.<object>

		public Pool_recycle(target:SwfSprite, objID:number, extendInfo:any = null):void{
			var key:string = objID + Config.GetExtendString(extendInfo);
			var objPool:SwfSprite[] = null;
			if(this.loadedResPool[key] != null){
				objPool = <SwfSprite[]> (this.loadedResPool[key]);
			}
			else{
				objPool	= [];
			}
			if(objPool.indexOf(target) == -1){
				objPool.push(target);
			}
			target.instanceName = "";
			this.loadedResPool[key] = objPool;
		}
		
		public Pool_getByID(objID:number, extendInfo:any = null):SwfSprite{
			var target:SwfSprite = new SwfSprite();
			target.ID = objID;
			target.extendinfo = extendInfo;
			
			var key:string = objID + Config.GetExtendString(extendInfo);
			if(this.loadedResPool[key] != null){
				var objPool:SwfSprite[] = <SwfSprite[]> (this.loadedResPool[key]);
				if(objPool.length > 0){
					target = objPool.pop();
					return target;
				}
			}
			var bitmapName:string = "";
			var defbase:DefineBase = <DefineBase>(this.resconf.resDefs[objID]);
			switch(defbase.t){
				case Config.RESImage:
					var image:DefineImage = <DefineImage> defbase;
					var imageName:string = Config.GetResName(image.id, Config.RESImage, extendInfo);
					bitmapName = this.resconf.resNamePrefix + imageName;
					break;
				case Config.RESShape:
					var shape:DefineShape = <DefineShape> defbase;
					var shapeName:string = Config.GetResName(shape.id, Config.RESShape, extendInfo);
					bitmapName = this.resconf.resNamePrefix + shapeName;
					break;
				case Config.RESFont:// 从字形字体里读取文字图片
					var font:DefineFont = <DefineFont>defbase;
					var picName:string = Config.GetResName(font.id, Config.RESFont, extendInfo);
					bitmapName = this.resconf.resNamePrefix + picName;
					break;
				default:
					break;
			}
			var bitmap:egret.Bitmap = this.createBitmapByName(bitmapName);
			target.addChild(bitmap);
			return target;
		}
		/**
		 * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
		 * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
		 */
		private createBitmapByName(name: string): egret.Bitmap {
			var result: egret.Bitmap = new egret.Bitmap();
			var texture: egret.Texture = RES.getRes(name);
			//console.log("", name, texture);
			result.texture = texture;
			return result;
		}
		public onIOError(event:IOErrorEvent):void{
			// TODO Auto-generated method stub
			console.log(event.toString());
		}
		
		/*protected function onLoadFondPicComplete(event:Event):void
		{
		// TODO Auto-generated method stub
		var loaderinfo:LoaderInfo = event.target as LoaderInfo;
		var dis:DisplayObject = loaderinfo.content as DisplayObject;
		var prew:Number = dis.width;
		dis.width = 20;// 等宽大小，默认宽度值
		var ratio:Number = dis.width/prew;
		dis.height = dis.height * ratio;
		if(dis.height > dis.width)
		{
		dis.height = 20;
		}
		}*/
		
	}
}
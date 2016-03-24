
module egret {

	export class DefineSprite extends DefineBase{
		/** 
		 * FrameCount
		 */
		public f:number = 1;
		
		/**
		 * 帧数据，每一帧是一个数组Vector.<PlaceObject>，这种数据格式支持嵌套
		 */ 
		public fd:Array<any> = [];
		
		public constructor(obj:any = null){
			super();
			this.createFromObject(obj);
			this.t = Config.RESSprite;
		}
		
		public saveKey(key:string, keyobj:any):boolean{
			if(key == "fd"){
				if(null != keyobj){
					var keyobjarr:any[] = <any[]> keyobj;
					for(var i:number=0;i<keyobjarr.length;i++){
						var vec:Array<PlaceObject> = new Array<PlaceObject>();
						this.fd[i] = vec;
						var vecarr:any[] = <any[]> (keyobjarr[i]);
						for(var j:number=0;j<vecarr.length;j++){
							var po:PlaceObject = new PlaceObject(vecarr[j]);
							vec.push(po);
						}
					}
				}
				return true;
			}
			return false;
		}
		
		/**
		 * 从帧中取出实例名为name的对象
		 * @param frame
		 * @param name
		 * @return 
		 * 
		 */
		public getObjByInstanceName(frame:number, name:string):PlaceObject{
			var frameObjs:Array<PlaceObject> = this.fd[frame];
			var length:number = frameObjs.length;
			for(var i:number = 0;i < length;i++){
				var po:PlaceObject = frameObjs[i];
				if(po.instanceName == name){
					return po;
				}
			}
			return null;
		}
		
		public checkLegal():boolean{
			if(this.f != this.fd.length){
				return false;
			}
			return true;
		}
	}
}
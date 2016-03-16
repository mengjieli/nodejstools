
module egret {

	export class DefineBase{
		/**
		 * type 从Config中读，默认为空字符串
		 */		
		public t:string = "";
		/**
		 * ID tagID，默认为-1表示未赋值的
		 */		
		public id:number = -1;
		
		public constructor(obj:any = null){
			this.createFromObject(obj);
		}
		
		public createFromObject(obj:any):void{
			if(null == obj){
				return;
			}
			for(var key in obj){
				if(this.saveKey(key, obj[key])){
					continue;
				}
				this[key] = obj[key];
			}
		}
		/**
		 * 提供给子类，特殊解析的属性
		 * @param key
		 * @param keyobj
		 * @return 
		 * 
		 */		
		public saveKey(key:string, keyobj:any):boolean{
			return false;
		}
		
		public toString():string{
			return JSON.stringify(this);
		}
	}
}
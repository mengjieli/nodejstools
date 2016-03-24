
module egret {

	export class SymbolClass{
		/**
		 * 链接类的定义characterId, 0是文档类
		 */		
		public id:number = 0;
		/**
		 * 链接类名
		 */		
		public className:string = "";
		
		public constructor(obj:any = null){
			this.createFromObject(obj);
		}
		
		public createFromObject(obj:any):void{
			if(null == obj){
				return;
			}
			for(var key in obj){
				this[key] = obj[key];
			}
		}
	}
}
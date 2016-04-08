
module egret {

	export class RecordInfo{
		public fontId:number = 0;
		
		public color:EColorTransform = null;
		
		public textHeight:number = 0;
		/**
		 * 字符在font里的index
		 */		
		public glyp:Array<any> = [];
		/**
		 * 每个字符的增量
		 */		
		public advances:Array<any> = [];

		public fromObject(obj:any):void {
			for (var key in obj){
				if("color" == key){
					if(this.hasOwnProperty(key)){
						var c:EColorTransform = new EColorTransform();
						S2PUtils.TransFromObject(c, obj[key]);
						this[key] = c;
					}
				}
				else{
					this[key] = obj[key];
				}
			}
		}
	}
}
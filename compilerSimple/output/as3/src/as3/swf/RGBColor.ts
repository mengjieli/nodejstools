
module egret {

	export class RGBColor{
		public red:number = 0;
		
		public green:number = 0;
		
		public blue:number = 0;
		
		public constructor(){
		}
		
		public colorValue():number{
			return this.red << 16 | this.green << 8 | this.blue;
		}
	}
}
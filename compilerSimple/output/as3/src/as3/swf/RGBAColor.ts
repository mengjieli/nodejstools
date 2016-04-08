
module egret {

	export class RGBAColor extends RGBColor{
		public alpha:number = 0;
		
		public constructor(){
			super();
		}
		
		public colorValue():number{
			return this.alpha << 24 | this.red << 16 | this.green << 8 | this.blue;
		}
	}
}
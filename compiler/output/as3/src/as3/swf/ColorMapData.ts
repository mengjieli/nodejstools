
module egret {

	export class ColorMapData{
		/**
		 * 长度为BitmapColorTableSize+1 
		 */		
		public colormapTable:Array<RGBColor> = null;

		public colormapPixelData:Array<number> = null;
		
		public constructor(){
		}
	}
}
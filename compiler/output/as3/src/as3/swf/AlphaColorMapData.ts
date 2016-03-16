
module egret {

	export class AlphaColorMapData{
		/**
		 * 长度为BitmapColorTableSize+1 
		 */		
		public alphaColormapTable:Array<RGBAColor> = null;
		
		public alphaColormapPixelData:Array<number> = null;
		
		public constructor(){
		}
	}
}
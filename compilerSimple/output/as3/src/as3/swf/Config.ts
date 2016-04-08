
module egret {

	export class Config{
		public static resDirName:string = "swfres\\";
		/**
		 * 导出png图片，配置等的路径
		 */		
		public static resDir:string = "C:\\Users\\chenpeng\\Documents\\e\\helloworld\\resource\\" ;
		
		
		public static pngIDLength:number = 4;
		
		/// 开关
		/**
		 * 矢量图按照有效像素来导出png
		 */		
		public static Switch_DrawShapeByColor:boolean = true;
		/**
		 * 矢量图按照endFill来切分成不同的位图 - 暂不支持，数据支持还没做到
		 */		
		public static Switch_SplitDrawShape:boolean = false;
		/**
		 * 打印矢量图的绘图脚本代码
		 */		
		public static Switch_Log_ShowShapeAction:boolean = false;
		
		/**
		 * 有效像素区与原矩形大小差距阀值 
		 */		
		public static DrawShapeByColorPixels:number = 1;
		
		
		/// 导出资源前缀
		public static RESImage:string = "image";
		public static RESShape:string = "shape";
		public static RESSprite:string = "sprite";
		public static RESText:string = "text";
		public static RESFont:string = "font";
		public static RESStage:string = "stage";//stage只作为标识
		
		// config names
		public static ConfigStage:string = "stage";
		/**
		 * 输出的文件名
		 * @param characterId
		 * @param resType
		 * @param extendInfo 扩展字段，支持多个扩展信息，以-分隔
		 * @return filename_resType_CharacterID-part1-xxx2
		 * 
		 */		
		public static GetResName(characterId:number, resType:string, extendInfo:any = null):string{
			var resname:string = "";
			resname = resType + "_" + characterId;
			resname += Config.GetExtendString(extendInfo);
			return resname;
		}
		public static GetExtendString(extendInfo:any = null):string{
			var extendstr:string = "";
			if(extendInfo != null){
				if(extendInfo instanceof Array)
				{
					var extendInfoArr:any[] = <any[]> extendInfo;
					var length:number = extendInfoArr.length;
					for(var i:number = 0;i < length;i++){
						var str:string = extendInfoArr[i];
						extendstr = extendstr + ("-" + str);
					}
				}
				else// if(extendInfo is String || extendInfo is int){
					extendstr = extendstr + ("-" + extendInfo);
				}
			return extendstr;
			}
		}
}
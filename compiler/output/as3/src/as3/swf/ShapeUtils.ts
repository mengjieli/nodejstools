
module egret {

	export class ShapeUtils{
		public constructor(){
		}
		/**
		 * eg:
		 * // Fills:
			graphics.lineStyle();
			graphics.beginFill(0xcccccc);
			graphics.moveTo(167.9, 23.8);
			graphics.curveTo(181.7, 37.6, 181.8, 57);
			graphics.lineTo(181.8, 104.4);
			graphics.lineTo(164.3, 104.4);
			graphics.lineTo(164.4, 57.1);
			graphics.curveTo(164.3, 44.8, 155.6, 36.1);
			graphics.curveTo(146.9, 27.4, 134.6, 27.4);
			graphics.curveTo(122.3, 27.4, 113.6, 36.2);
			graphics.curveTo(104.8, 44.9, 104.8, 57.2);
			graphics.curveTo(104.8, 69.5, 113.5, 78.2);
			graphics.curveTo(122.2, 86.9, 134.5, 87);
			graphics.lineTo(160.5, 87);
			graphics.lineTo(160.5, 104.4);
			graphics.lineTo(134.4, 104.4);
			graphics.curveTo(114.9, 104.3, 101.2, 90.5);
		 * @param str 字符串绘图命令
		 * @param spliteShape 默认输出一帧上所有的矢量图到一个shape中，true（按照endFill等命令拆为多个shape）
		 * @return 绘制好的shape矢量图 singleShape==true，返回的长度为1
		 * 
		 */		
		public static CreateShapeFromString(str:string, spliteShape:boolean = false):Array<any>{
			var shapeArr:Array<any> = [];
			var s:Shape = new Shape();
			var g:Graphics = s.graphics;
			shapeArr.push(s);
			//str = StringUtils.trim(str);
			str = str.split("\ ").join("");
			var regexp:RegExp = /\/\/.*this.$/gm;
			str = str.replace(regexp,"");//去注释
			var commandArr:Array<any> = str.split("\r");
			var length:number = commandArr.length;
			for(var i:number = 0;i < length;i++){
				var commandLine:string = commandArr[i];
				/* test beginGradientFill with params
				commandLine = "graphics.beginGradientFill('linear',[0xffff00,0xffff00,0xffff00],[1,0.5019607843137255,0],[0,133,255]);";
				DrawCommand(g, commandLine);
				commandLine = "graphics.beginGradientFill('linear',[0xffff00,0xffff00,0xffff00],[1,0.5019607843137255,0],[0,133,255],,"pad","rgb",0);";
				DrawCommand(g, commandLine);
				commandLine = "graphics.beginGradientFill('linear',[0xffff00,0xffff00,0xffff00],[1,0.5019607843137255,0],[0,133,255],newMatrix(0,-0.0732421875,-0.0732421875,0,240,-60),"pad","rgb",0);";
				DrawCommand(g, commandLine);
				return shapeArr;
				*/
				var drawResult:string = ShapeUtils.DrawCommand(g, commandLine);
				if(spliteShape && (drawResult == "endFill")){
					s = new Shape();
					g = s.graphics;
					shapeArr.push(s);
				}
			}
			//trace("shapeArr.length : " + shapeArr.length);
			return shapeArr;
		}
		
		/**
		 * 执行单条指令
		 * eg: graphics.curveTo(150.9,50.3,146.1,45.6);
		 * 支持SolidFill填充方式
		 * 注意：暂不支持渐变填充与位图填充graphics.beginGradientFill和graphics.beginBitmapFill。
		 * 对于渐变填充：graphics.beginGradientFill(type:String, colors:Array, alphas:Array, ratios:Array, matrix:Matrix = null, spreadMethod:String = SpreadMethod.PAD, interpolationMethod:String = InterpolationMethod.RGB, focalPointRatio:Number = 0）
		 * 需要正确解析出参数中的Array和Matrix；
		 * 对于位图填充：graphics.beginBitmapFill(1,newMatrix(1,0,0,1,-23,-91),false,true);
		 * 需要将第一个参数（id替换为相应位图的BitmapData数据）；
		 * @param g
		 * @param commandLine
		 * @return 
		 * 
		 */		
		private static DrawCommand(g:Graphics, commandLine:string):string{
			if(commandLine == null || commandLine == ""){
				return "empty";
			}
			var indexOfGraphics:number = commandLine.indexOf("graphics.");
			if(-1 == indexOfGraphics){
				return "can not find key word 'graphics'!";
			}
			var indexOfCommandStart:number = indexOfGraphics + "graphics.".length;
			var indexOfCommandEnd:number = commandLine.indexOf("(", indexOfGraphics);
			var command:string = commandLine.substring(indexOfCommandStart , indexOfCommandEnd);
			
			var indexOfParamEnd:number = commandLine.lastIndexOf(")");
			var substr:string = commandLine.substring(indexOfCommandEnd + 1, indexOfParamEnd);
			var args:Array<any>;
			
			// 渐变填充实现
			//graphics.beginGradientFill('linear',[0xffff00,0xffff00,0xffff00],[1,0.5019607843137255,0],[0,133,255],newMatrix(0,-0.0732421875,-0.0732421875,0,240,-60),1,2,3,4);
			//g.beginGradientFill(fillType, colors, alphas, ratios, matr, spreadMethod); 
			//matrix:Matrix = null, spreadMethod:String = SpreadMethod.PAD, interpolationMethod:String = InterpolationMethod.RGB, focalPointRatio:Number = 0
			if(command == "beginGradientFill"){
				args = [];
				args[0] = "linear";//fillType
				var index:number = commandLine.indexOf("linear");
				var paramstart:number = commandLine.indexOf("[", index);
				var paramend:number = commandLine.indexOf("]", paramstart);
				var param:string = commandLine.substring(paramstart+1, paramend);
				var paramarr:Array<any> = param.split(",");
				args[1] = paramarr;//colors
				paramstart = commandLine.indexOf("[", paramend);
				paramend = commandLine.indexOf("]", paramstart);
				param = commandLine.substring(paramstart+1, paramend);
				paramarr = param.split(",");
				args[2] = paramarr;//alphas
				paramstart = commandLine.indexOf("[", paramend);
				paramend = commandLine.indexOf("]", paramstart);
				param = commandLine.substring(paramstart+1, paramend);
				paramarr = param.split(",");
				args[3] = paramarr;//ratios
				
				paramstart = commandLine.indexOf("newMatrix", paramend);
				if(-1 != paramstart){
					paramstart = commandLine.indexOf("(", paramstart);
					paramend = commandLine.indexOf(")", paramstart);
					param = commandLine.substring(paramstart+1, paramend);
					paramarr = param.split(",");
					var newMatrix:Matrix = new Matrix(paramarr[0], paramarr[1], paramarr[2], paramarr[3], paramarr[4], paramarr[5]);
					args[4] = newMatrix;//matr
				}
				else{
					args[4] = null;
					paramend += 2;
				}
				paramstart = commandLine.indexOf(",", paramend);
				if(-1 != paramstart){
					paramend = commandLine.indexOf(")", paramstart);
					param = commandLine.substring(paramstart+1, paramend);
					paramarr = param.split(",");
					var argLen:number = args.length;
					var length:number = paramarr.length;
					for(var i:number = 0;i < length;i++){
						var v:any = paramarr[i];
						args[argLen++] = v;//spreadMethod:String = SpreadMethod.PAD, interpolationMethod:String = InterpolationMethod.RGB, focalPointRatio:Number = 0, 
					}
				}
			}
			else if(command == "beginBitmapFill"){
				//位图填充shape的代码在脚本中还没有实现，需要将第一个参数（id替换为相应位图的BitmapData数据）
				//graphics.beginBitmapFill(1,newMatrix(1,0,0,1,-23,-91),false,true); 
			}
			else {
				args = substr.split(",");
				if(args.length==1 && args[0]==""){
					args.pop();
				}
			}
			var func:Function = g[command];
			func.apply(g, args);//用分析到的参数调用
			return null;
		}
		
		/*
		private	 static function CreateShape(str:String):Shape
		{
			var s:Shape = new Shape();
			var g:Graphics = s.graphics;
			
			var arr:Array = str.split("\r");
			var len:int = arr.length;
			for(var i:int = 0;i<len;i++){
				var line:String = arr[i];
				if(line){//排除空行
					var regexp:RegExp = /\/\/.*$/gm;
					line = line.replace(regexp,"");//去注视
					line = line.replace(/[\s+\;]/g, "");//去空格、制表符和分号
					if(line){//排除只有空字符的行和纯注释
						var arr1:Array = line.split("(");
						var command:String = arr1[0].split(".")[1];
						//如果担心原代码手误，此处检查一下arr1[1]是否第一字符是"("，最后字符是")";
						var ogArgArr:Array = arr1[1].substr(1, arr1[1].length-1).split(",");//未分类的参数数组，逗号之间的空格已经被去掉了
						var args:Array = [];
						var len_j:int = ogArgArr.length;
						for(var j:int = 0;j<len_j;j++){
							var ogArg:String = ogArgArr[j];
							if(ogArg.indexOf("\"") == 0 || ogArg.indexOf("'") == 0){
								//字符串
								args.push(ogArg.substr(0, ogArg.length-1));
							}else if(ogArg == "true"){
								//特殊
								args.push(true);
							}else if(ogArg == "false"){
								//特殊
								args.push(false);
							}else if(ogArg == "null"){
								//特殊
								args.push(null);
							}else{
								args.push(Number(ogArg));
							}
						}
						
						var func:Function = g[command];//拿到命令
						func.apply(g, args);//用分析到的参数调用
					}
				}
			}
			return s;
		}
		*/
	}
}

module egret {

	export class SwfMovie extends SwfSprite{
		private frameRate:number = 24;
		/// movieclip part start
		private _totalFrames:number = 1;
		public get totalFrames():number{
			return this._totalFrames;
		}
		
		// readonly
		private _currentFrame:number = 1;
		public get currentFrame():number{
			return this._currentFrame;
		}
		// 真实帧值，随着时间不断增加，goto操作可以改变这个值
		private _realPlayFrame:number = 1;
		//read only
		private _isPlaying:boolean = true;
		public get isPlaying():boolean{
			return this._isPlaying;
		}
		//readonly 未支持
		//public var currentFrameLabel:String;
		//readonly 未支持
		//public var currentLabel : String
		//public var numChildren:int = 0;
		
		private updateCurrentFrame():void
		{
			this._currentFrame = this._realPlayFrame % this._totalFrames;
			this._currentFrame = this._currentFrame < 1 ? this._totalFrames : this._currentFrame;
			this._currentFrame = this._currentFrame > this._totalFrames ? 1 : this._currentFrame;
		}
		
		
		//将播放头移到指定帧并播放
		public gotoAndPlay(frame: number): void{
			this._isPlaying = true;
			this._realPlayFrame = frame;
			if(null == this.conf)
			{
				return;
			}
			this.playFrame();
		}
		//将播放头移到指定帧并停止
		public gotoAndStop(frame: number): void{
			this._isPlaying = false;
			this._realPlayFrame = frame;
			if(null == this.conf)
			{
				return;
			}
			this.playFrame();
		}
		//将播放头移到前一帧并停止
		public prevFrame(): void{
			this._isPlaying = false;
			if(null == this.conf)
			{
				return;
			}
			this.playPreFrame();
		}
		private playPreFrame():void{
			this._realPlayFrame--;
			this._realPlayFrame = this._realPlayFrame <= 0 ? 1 : this._realPlayFrame;
			if(null == this.conf)
			{
				return;
			}
			this.playFrame();
		}
		//跳到后一帧并停止
		public nextFrame(): void{
			this._isPlaying = false;
			if(null == this.conf)
			{
				return;
			}
			this.playNextFrame();
		}
		private playNextFrame():void{
			this._realPlayFrame++;
			if(null == this.conf)
			{
				return;
			}
			this.playFrame();
		}
		//继续播放当前动画
		public play():void{
			this._isPlaying = true;
		}
		//暂停播放动画
		public stop(): void{
			this._isPlaying = false;
		}
		/// movieclip part end
		

		/**
		 * 
		 * @param _conf
		 * @param _symbolName
		 * 
		 */		
		public constructor(conf:Resconfig, symbolName:string = ""){
			super();
			this.conf = conf;
			this.symbolName = symbolName;
			if(null == this.conf)
			{
				return;
			}
			this.initMovie();
			this.playFrame();
		}
		private initMovie():void{
			var defID:number = 0;
			if(null != this.conf.symbols[this.symbolName]){
				var symbol:SymbolClass = <SymbolClass> (this.conf.symbols[this.symbolName]);
				defID = symbol.id;
			}
			var defbase:DefineSprite = <DefineSprite> (this.conf.resDefs[defID]);
			this._totalFrames = defbase.f;
			//this.console.log("init movie:" + this.symbolName + " id: " + defID + "  frames:" + this._totalFrames);

			var frameTime:number = 1*1000/this.frameRate;
			//this._isPlaying = true;
			//console.log(frameTime, this, this._isPlaying, this.isPlaying);
			var self = this;
			setInterval(onTimer, frameTime);
			function onTimer():void{
				if(self.isPlaying){
					self.playNextFrame();
				}
			}
		}

		/**
		 * 根据下标播放帧
		 * @param frame
		 * 
		 */		
		private playFrame():void{
			//this.console.log("--play frame:" + frame + "--");
			this.updateCurrentFrame();
			this.recycleInnerObj(this);
			var sp:SwfSprite = this.createFrame(this._realPlayFrame);
			//this.addChild(sp);
		}
		private recycleInnerObj(d:egret.Sprite):void{
			if(null == d){
				return;
			}
			while(d.numChildren > 0){
				var child:DisplayObject = d.removeChildAt(0);
				//如果还有子对象，继续遍历回收
				if(child instanceof SwfSprite && 1 == (<SwfSprite>child).numChildren){
					var result:boolean = SwfRes.Pool_recycle(this.conf.path, this.conf, <SwfSprite>child, (<SwfSprite>child).ID, (<SwfSprite>child).extendinfo);
					if(!result){
						this.recycleInnerObj(<egret.Sprite>child);
					}
				}
				else{
					this.recycleInnerObj(<egret.Sprite>child);
				}
			}
		}
		
		
		/**
		 * 创建一帧的显示对象
		 * @param frame
		 * @return 
		 * 
		 */		
		private createFrame(frame:number = 0):SwfSprite{
			var sp:SwfSprite = new SwfSprite();
			sp = this;
			if("" == this.symbolName){//stage
				var datas:Array<PlaceObject> = this.getFrameData(this._currentFrame, 0);
				this.placeObjects(datas, sp, frame);
			}
			else{
				if(null != this.conf.symbols[this.symbolName]){
					var symbol:SymbolClass = <SymbolClass> (this.conf.symbols[this.symbolName]);
					datas = this.getFrameData(this._currentFrame, symbol.id);
					this.placeObjects(datas, sp, frame);
				}
			}
			return sp;
		}
		/**
		 * 一帧的所有对象的位移变换数据
		 * @param frame
		 * @param id
		 * @return 
		 * 
		 */		
		private getFrameData(frame:number, id:number = 0):PlaceObject[]{
			var datas:PlaceObject[];
			var spdef:DefineSprite = <DefineSprite> (this.conf.resDefs[id]);
			datas = <PlaceObject[]> (spdef.fd[frame-1]);
			return datas;
		}
		
		/**
		 * 填充DefineImage数据
		 * @param defimg
		 * @param parantSP
		 * @param po
		 * 
		 */		
		private addImage(defimg:DefineImage, parantSP:egret.Sprite, po:TransformInfo):void{
			var imgDis:SwfSprite = SwfRes.Pool_getByID(this.conf.path, this.conf, defimg.id);
			parantSP.addChild(imgDis);
			S2PUtils.SetTransform(<DisplayObject>imgDis, po);
		}
		/**
		 * 填充DefineShape数据
		 * @param shape
		 * @param parantSP
		 * @param transInfo
		 * 
		 */		
		private addShape(shape:DefineShape, parantSP:egret.Sprite, transInfo:TransformInfo):void{
			var shapeContainer:egret.Sprite = new egret.Sprite();
			parantSP.addChild(shapeContainer);
			S2PUtils.SetTransform(shapeContainer, transInfo);// 设置placeobject的放置位置，颜色信息
			//shape png
			if(shape.isexportpng){
				var shapePNG:SwfSprite = <SwfSprite>SwfRes.Pool_getByID(this.conf.path, this.conf, shape.id);
				shapeContainer.addChild(shapePNG);
				// 设置自身的偏移（图形在帧上不是放置在0,0点的）
				shapePNG.x = shape.x;
				shapePNG.y = shape.y;
			}
			//bitmap fill
			if(shape.hasOwnProperty(DefineShape.Dynamic_Fillstyles)){
				var fills:FillStyle[] = <FillStyle[]> (shape[DefineShape.Dynamic_Fillstyles]);
				var length:number = fills.length;
				for(var i:number = 0;i < length;i++){
					var fillstyle:FillStyle = fills[i];
					this.addImage(<DefineImage> (this.conf.resDefs[fillstyle.bitmapId]), shapeContainer, fillstyle);
				}
			}
		}
		/**
		 * 填充DefineSprite型数据
		 * eg:[26:PlaceObject2] Depth: 10, CharacterID: 14, Matrix: (1,0,0,1,8579,4221), Name: stagemc3
		 * @param defsp
		 * @param parantSP
		 * @param po
		 * @param frame
		 * 
		 */		
		private addSprite(defsp:DefineSprite, parantSP:SwfSprite, po:PlaceObject, frame:number = 1):void{
			//根据父容器的帧来计算自己应该播放哪一帧
			var thePlayFrame:number = frame - po.fristframe + 1;
			if(thePlayFrame <= 0){
				//this.console.log("erroe frame number!!!");
				thePlayFrame = 1;
			}
			thePlayFrame %= defsp.f;
			if(thePlayFrame == 0){
				thePlayFrame = defsp.f;
			}
			var datas:Array<PlaceObject> = this.getFrameData(thePlayFrame, defsp.id);
			var innersp:SwfSprite = new SwfSprite();
			// 子对象列表
			if(null != po.instanceName && "" != po.instanceName){
				innersp.instanceName = po.instanceName;
				parantSP[po.instanceName] = innersp;
			}
			
			this.placeObjects(datas, innersp, frame);//嵌套元件
			parantSP.addChild(innersp);
			S2PUtils.SetTransform(innersp, po);
		}
		
		private addDisplayObject(po:PlaceObject, parantSP:SwfSprite, frame:number = 1):void{
			var defbase:DefineBase = <DefineBase>(this.conf.resDefs[po.id]);
			switch(defbase.t){
				case Config.RESImage:
					this.addImage(<DefineImage>defbase, parantSP, po);
					break;
				case Config.RESShape:
					this.addShape(<DefineShape>defbase, parantSP, po);
					break;
				case Config.RESSprite:
					this.addSprite(<DefineSprite>defbase, parantSP, po, frame);
					break;
				case Config.RESText:
					new SwfText(this.conf, <DefineText>defbase, parantSP, po);
					break;
				default:
					break;
			}
		}
		/**
		 * 按照深度排序
		 * @param po1
		 * @param po2
		 * @return 
		 * 
		 */		
		public static  sortOnDepth(po1:PlaceObject, po2:PlaceObject):number{
			if(po1.depth > po2.depth){
				return 1;
			}
			else if(po1.depth < po2.depth){
				return -1;
			}
			return 0;
		}
		
		private placeObjects(datas:Array<PlaceObject>, parantSP:SwfSprite=null, frame:number = 1):egret.Sprite{
			if(null == parantSP){
				parantSP = new SwfSprite();
			}
			datas.sort(SwfMovie.sortOnDepth);
			var length:number = datas.length;
			for(var i:number = 0;i < length;i++){
				var po:PlaceObject = datas[i];
				this.addDisplayObject(po, parantSP, frame);
			}
			return parantSP;
		}
	}
}
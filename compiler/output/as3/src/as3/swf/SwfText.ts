
module egret {

	export class SwfText extends egret.DisplayObjectContainer{
		private _instanceName:string = "";
		public get instanceName():string
		{
			return this._instanceName;
		}
		public set instanceName(value:string)
		{
			this.name = value;
			this._instanceName = value;
		}
		
		public resConf:Resconfig = null;

		private flashText:TextField = new TextField();
		public get text():string{
			if(null != this.flashText){
				return this.flashText.text;
			}
			return "";
		}
		public set text(value:string){
			if(null != this.flashText){
				this.flashText.text = value;
			}
		}



		public constructor(_resConf:Resconfig, text:DefineText, parantSP:SwfSprite, po:PlaceObject){
			super();
			this.resConf = _resConf;
			parantSP.addChild(this);
			if(null != po.instanceName && "" != po.instanceName){
				this.instanceName = po.instanceName;
				parantSP[po.instanceName] = this;
			}

			if(text.wasstatic){
				//egret 不支持静态文本
				//trace(text.wasstatic);
				if(text.text == "" && text.glyphText != null){
					var shapePNGParent:egret.DisplayObjectContainer = new egret.DisplayObjectContainer();
					this.addChild(shapePNGParent);
					S2PUtils.SetTransform(shapePNGParent, po);
					shapePNGParent.x += text.x;
					shapePNGParent.y += text.y;

					var totalAdvance:number = 0;
					for(var index:number=0;index<text.glyphText.info.length; index++){
						var rec:RecordInfo = text.glyphText.info[index];
						for(var glypindex:number=0;glypindex<rec.glyp.length;glypindex++){
							var shapePNG:SwfSprite = SwfRes.Pool_getByID(this.resConf.path, this.resConf, rec.fontId, <SwfSprite><any> (rec.glyp[glypindex]));
							var colorTF:egret.ColorTransform = new egret.ColorTransform();
							colorTF.updateColor(rec.color.rm, rec.color.gm, rec.color.bm, rec.color.am, rec.color.ro,rec.color.go,rec.color.bo,rec.color.ao);
							shapePNG.colorTransform = colorTF;// 暂时egret不支持color变换，这据代码没有效果
							shapePNG.alpha = rec.color.am;//设置透明度
							//todo 目前还没法改变显示对象的颜色

							shapePNGParent.addChild(shapePNG);
							shapePNG.x = totalAdvance;
							totalAdvance += rec.advances[glypindex];
							//trace(shapePNGParent.x , totalAdvance, rec.advances[glypindex]);
						}
					}
					return;// 静态文本 使用glyp字体
				}
				else{
					
				}
			}
			this.flashText = new TextField();
			if(text.readOnly){
				this.flashText.type = TextFieldType.DYNAMIC;
			}
			else {
				this.flashText.type = TextFieldType.INPUT;
			}
			S2PUtils.SetTransform(this.flashText, po);
			this.flashText.textColor = text.tc;
			this.flashText.text = text.text;
			//this.flashText.htmlText = text.htmlText;
			this.flashText.x += text.x;
			this.flashText.y += text.y;
			this.flashText.height = text.h;
			this.flashText.width = text.w;
			this.flashText.multiline = text.multiline;
			//this.flashText.wordWrap = text.wordWrap;
			//trace(text.id + " multiline " + text.multiline);
			this.flashText.maxChars = text.maxLength;
			this.flashText.size = text.size;
			this.flashText.bold = text.tb;
			this.flashText.italic = text.ti;
			this.flashText.textAlign = text.ta;
			this.flashText.textColor = text.tc;

			this.addChild(this.flashText);
		}
	}
}
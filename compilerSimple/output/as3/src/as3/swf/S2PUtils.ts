
module egret {

	export class S2PUtils{
		public constructor(){
		}

		/**
		 * 从对象取值
		 * @param source
		 * @param target
		 * 
		 */		
		public static TransFromObject(target:any, source:any):void{
			for(var key in source){
				target[key] = source[key];
			}
		}
		/**
		 * 还原显示对象的transform属性
		 * @param dis
		 * @param po
		 * 
		 */		
		public static SetTransform(dis:DisplayObject, po:TransformInfo):void{
			if(null == po || null == dis){
				return;
			}
			if(!(dis instanceof DisplayObject)){
				return;
			}
			if(null != po.m){

				var m:Matrix = new Matrix(po.m.scaleX, po.m.rotateSkew0, po.m.rotateSkew1, po.m.scaleY, po.m.tx, po.m.ty);
				//egret 不支持matrix  dis.transform.matrix = m;内部暂时暴露的接口是__hack_local_matrix，以后会改要注意
				dis.__hack_local_matrix = m;
				/*
				dis.rotation = po.rotaton;//设置旋转
				//这样直接设置不是真实的缩放值
				dis.scaleX = po.m.scaleX;
				dis.scaleY = po.m.scaleY;
				//设置缩放，真实缩放值为做了旋转、斜切等操作后的值
				//dis.scaleX = po.m.scaleX < 0 ? -po.xscale : po.xscale;
				//dis.scaleY = po.m.scaleY < 0 ? -po.yscale : po.yscale;
				//如果有旋转，不设置斜切值
				if(dis.rotation == 0)
				{
					//设置斜切（注意斜切的单位是角度，做下转换，参考adobe官网的转换方法）
					// 斜切要考虑有缩放的情况，首先还原到缩放前的弧度斜切值
					var skewYReg:number = po.m.rotateSkew0 / po.m.scaleX;
					var skewXReg:number = po.m.rotateSkew1 / po.m.scaleY;
					dis.skewX = Math.atan(skewXReg) * 180 / Math.PI;
					dis.skewY = Math.atan(skewYReg) * 180 / Math.PI;
				}
				//位移
				dis.x = po.m.tx;
				dis.y = po.m.ty;
				if(po instanceof egret.PlaceObject)
				{
					if((<PlaceObject>po).id == 148)
					{
						console.log("dis:", dis.skewX, dis.skewY, po.m.rotateSkew1, po.m.rotateSkew0, dis.scaleX, dis.scaleY);
					}
				}
				 */
			}
			if(null != po.color){
				var colorTF:egret.ColorTransform = new egret.ColorTransform();
				colorTF.updateColor(po.color.rm, po.color.gm, po.color.bm, po.color.am, po.color.ro, po.color.go, po.color.bo, po.color.ao);
				dis.colorTransform = colorTF;// egret中还没有实现colorTransform，这里的赋值是无效的
				dis.alpha = po.color.am;
			}
		}
	}
}
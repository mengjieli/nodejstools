
module egret {

	export class SwfRes{
		public static resPools:any = {};
		
		public constructor(){
		}
		
		private static _instance:SwfRes;
		public instance():SwfRes{
			if(null == SwfRes._instance){
				SwfRes._instance = new SwfRes();
			}
			return SwfRes._instance; 
		}

		
		// pool
		public static hasPool(poolname:string):boolean{
			return SwfRes.resPools[poolname] != null;
		}
		
		public static getPool(poolname:string):SwfResPool{ 
			return <SwfResPool><any> (SwfRes.resPools[poolname]);
		}
		
		public static Pool_recycle(poolname:string, _resconf:Resconfig, target:SwfSprite, objID:number, extendInfo:any = null):boolean{
			if(objID == 0){// 不回收容器对象
				return false;
			}
			var pool:SwfResPool = null;
			if(SwfRes.hasPool(poolname)){
				pool = SwfRes.getPool(poolname);
			}
			else{
				pool = new SwfResPool(poolname, _resconf);
			}
			SwfRes.resPools[poolname] = pool;
			pool.Pool_recycle(target, objID, extendInfo);
			return true;
		}
		
		public static Pool_getByID(poolname:string, _resconf:Resconfig, objID:number, extendInfo:any = null):SwfSprite{
			var pool:SwfResPool = null;
			if(SwfRes.hasPool(poolname)){
				pool = SwfRes.getPool(poolname);
			}
			else{
				pool = new SwfResPool(poolname, _resconf);
			}
			SwfRes.resPools[poolname] = pool;
			return pool.Pool_getByID(objID, extendInfo);
		}
	}
}
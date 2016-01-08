/**
 *
 * @author 
 *
 */
class ModelLogicItemInfo {
    
    private _id:number;
    private _type: string;
    public next:number;
    
	public constructor(type:string,id:number) {
    	this._type = type;
    	this._id = id;
	}
	
	public get id():number {
	    return this._id;
	}
	
	public get type():string {
	    return this._type;
	}
	
	public get fileContent():any {
	    return null;
	}
	
	public decode(info:any):void {
	    
	}
}

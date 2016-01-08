/**
 *
 * @author 
 *
 */
class ModelLogicDefine extends ModelLogicItemInfo {
    
    public name:string;
    public desc:string;
    public varType:TypeInfo;
    public init:string;
    
	public constructor(id:number) {
    	super(LogicType.DEFINE,id);
	}
	
	public get fileContent():any {
        return {
            id: this.id,
            type: this.type,
            next: this.next,
            name: this.name,
            desc: this.desc,
            varType: this.varType.fileContent,
            init:this.init
        };
	}
	
	public decode(info:any):void {
	    this.next = info.next;
	    this.name = info.name;
	    this.desc = info.desc;
	    this.varType = new TypeInfo(info.varType.type,info.varType.typeValue);
	    this.init = info.init;
	}
}

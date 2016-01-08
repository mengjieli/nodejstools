/**
 *
 * @author 
 *
 */
class ParamInfo {

    public name: string;
    public desc: string;
    public type: TypeInfo;
    public init: string;
    
	public constructor() {
	}
	
    public decode(info): void {
        this.name = info.name;
        this.desc = info.desc;
        this.type = new TypeInfo(info.type.type,info.type.typeValue);
        this.init = info.init;
	}
}

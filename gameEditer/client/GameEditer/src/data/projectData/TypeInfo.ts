/**
 *
 * @author 
 *
 */
class TypeInfo {
    
    public type: string;
    public typeValue: string;
    
	public constructor(type:string,typeValue:string=null) {
        this.type = type;
        this.typeValue = typeValue;
	}
	
	public get desc():string {
        var d = DataConfig.typeDesc[this.type];
        if(d) {
            return d;
        }
        return this.type;
	}
	
	public get fileContent():any {
        return {
            type: this.type,
            typeValue:this.typeValue
        };
	}
}

/**
 *
 * @author 
 *
 */
class DataInfoMember {
    
    public desc: string;
    public type: string;
    public typeValue: string;
    
    public constructor(){
        
    }
}

class DataInfo extends FileInfoBase{
    
    private members;
    
	public constructor(url,name,desc) {
        super(url,name,desc);
        this.members = {};
	}
	
	public get fileContent():string {
        var config = {
            "name":this.name,
            "desc":this.desc,
            "members": this.members
	    }
        return JSON.stringify(config);
	}
}
